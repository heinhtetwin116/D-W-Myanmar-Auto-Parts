/**
 * Unified catalog search — the single entry point for product listing data.
 *
 * Reads ERPNext directly (no Supabase mirror): `Item` / `Item Group` list
 * queries for the catalog, `Bin` rows summed per item for stock. Responses
 * keep the `CatalogResult` shape so callers never care about the source.
 *
 * ERPNext field mapping (custom fields + stock source) must be confirmed
 * against the target instance before this returns real data — see MEMORY.md.
 */

import { createERPNextClient, type ERPNextClient } from "@/lib/erpnext/client";
import type {
  CatalogResult,
  CatalogSearchParams,
  Category,
  ERPNextBin,
  ERPNextItem,
  ERPNextItemGroup,
  Product,
  ProductDetailResult,
} from "@/types/index.type";

/** Upper bound for the id-list queries behind counts and stock joins. */
const MAX_LIST_IDS = 10000;

function sortToOrderBy(sort: NonNullable<CatalogSearchParams["sort"]>): string {
  switch (sort) {
    case "price_asc":
      return "custom_price_mmk asc";
    case "price_desc":
      return "custom_price_mmk desc";
    case "newest":
      return "creation desc";
    case "name":
    default:
      return "item_name";
  }
}

function mapGroupToCategory(group: ERPNextItemGroup): Category {
  const now = new Date().toISOString();
  return {
    id: group.name,
    erpnext_id: group.name,
    name_en: group.item_group_name,
    name_my: group.custom_name_my || group.item_group_name,
    description_en: group.description ?? null,
    description_my: group.custom_description_my ?? null,
    enabled: group.disabled !== 1,
    image_url: group.image ?? null,
    created_at: now,
    updated_at: now,
    synced_at: null,
  };
}

function mapItemToProduct(item: ERPNextItem, stock: number): Product {
  const now = new Date().toISOString();
  return {
    id: item.name,
    erpnext_id: item.name,
    category_id: item.item_group,
    sku: item.name,
    name_en: item.item_name,
    name_my: item.custom_name_my || item.item_name,
    description_en: item.description ?? null,
    description_my: item.custom_description_my ?? null,
    specifications: null,
    price_mmk: item.custom_price_mmk ?? 0,
    stock_quantity: stock,
    enabled: item.disabled !== 1,
    image_url: item.image ?? null,
    created_at: now,
    updated_at: now,
    synced_at: null,
  };
}

type ItemFilter = [string, string, string | number | boolean];

function itemFilters(
  categoryId?: string,
  search?: string,
): {
  filters: ItemFilter[];
  orFilters?: ItemFilter[];
} {
  const filters: ItemFilter[] = [["disabled", "=", 0]];
  if (categoryId) {
    filters.push(["item_group", "=", categoryId]);
  }
  if (!search?.trim()) {
    return { filters };
  }
  const like = `%${search.trim()}%`;
  return {
    filters,
    orFilters: [
      ["item_name", "like", like],
      ["name", "like", like],
      ["custom_name_my", "like", like],
    ],
  };
}

/** Sum Bin actual_qty per item code. Missing rows mean zero stock. */
async function fetchStockMap(
  erpnext: ERPNextClient,
  itemCodes: string[],
): Promise<Map<string, number>> {
  const stock = new Map<string, number>();
  if (itemCodes.length === 0) return stock;
  const bins = await erpnext.listDocuments<ERPNextBin>("Bin", {
    fields: ["item_code", "actual_qty"],
    filters: [["item_code", "in", itemCodes.join(",")]],
    limitPageLength: MAX_LIST_IDS,
  });
  for (const bin of bins) {
    stock.set(
      bin.item_code,
      (stock.get(bin.item_code) ?? 0) + (bin.actual_qty ?? 0),
    );
  }
  return stock;
}

function matchesStock(
  quantity: number,
  stock: NonNullable<CatalogSearchParams["stock"]>,
): boolean {
  if (stock === "in_stock") return quantity > 10;
  if (stock === "low_stock") return quantity >= 1 && quantity <= 10;
  return quantity <= 0;
}

export async function searchProducts(
  params: CatalogSearchParams = {},
): Promise<CatalogResult> {
  const {
    categoryId,
    search,
    stock,
    sort = "name",
    page = 1,
    pageSize = 12,
  } = params;
  const erpnext = createERPNextClient();
  const { filters, orFilters } = itemFilters(categoryId, search);

  const [groups, names] = await Promise.all([
    erpnext.listDocuments<ERPNextItemGroup>("Item Group", {
      fields: [
        "name",
        "item_group_name",
        "description",
        "image",
        "disabled",
        "custom_name_my",
        "custom_description_my",
      ],
      filters: [["disabled", "=", 0]],
      orderBy: "item_group_name",
      limitPageLength: MAX_LIST_IDS,
    }),
    erpnext.listDocuments<Pick<ERPNextItem, "name">>("Item", {
      fields: ["name"],
      filters,
      orFilters,
      limitPageLength: MAX_LIST_IDS,
    }),
  ]);

  const categories = groups.map(mapGroupToCategory);
  const stockMap = await fetchStockMap(
    erpnext,
    names.map((item) => item.name),
  );
  const matchingIds = names
    .map((item) => item.name)
    .filter((name) =>
      stock ? matchesStock(stockMap.get(name) ?? 0, stock) : true,
    );
  const total = matchingIds.length;
  const pageIds = matchingIds.slice((page - 1) * pageSize, page * pageSize);

  const items =
    pageIds.length > 0
      ? await erpnext.listDocuments<ERPNextItem>("Item", {
          fields: [
            "name",
            "item_name",
            "item_group",
            "description",
            "image",
            "disabled",
            "custom_name_my",
            "custom_description_my",
            "custom_price_mmk",
          ],
          filters: [["name", "in", pageIds.join(",")]],
          orderBy: sortToOrderBy(sort),
        })
      : [];
  const byId = new Map(items.map((item) => [item.name, item]));
  const products = pageIds.flatMap((id) => {
    const item = byId.get(id);
    return item ? [mapItemToProduct(item, stockMap.get(id) ?? 0)] : [];
  });

  return { source: "erpnext", products, total, categories, page, pageSize };
}

function isNotFoundError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("(404)");
}

/**
 * Unified product detail — the single entry point for single-product data.
 * Returns `null` only when the id exists nowhere (→ not-found page);
 * any other failure throws (→ error boundary).
 */
export async function getProductDetail(
  slug: string,
): Promise<ProductDetailResult | null> {
  const erpnext = createERPNextClient();

  let item: ERPNextItem;
  try {
    item = await erpnext.getDocument<ERPNextItem>("Item", slug);
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
  if (item.disabled === 1) return null;

  const [group, related, stockMap] = await Promise.all([
    erpnext
      .getDocument<ERPNextItemGroup>("Item Group", item.item_group)
      .catch(() => null),
    erpnext
      .listDocuments<ERPNextItem>("Item", {
        fields: [
          "name",
          "item_name",
          "item_group",
          "description",
          "image",
          "disabled",
          "custom_name_my",
          "custom_description_my",
          "custom_price_mmk",
        ],
        filters: [
          ["item_group", "=", item.item_group],
          ["disabled", "=", 0],
        ],
        limitPageLength: 6,
      })
      .catch(() => []),
    fetchStockMap(erpnext, [item.name]),
  ]);

  const relatedIds = related
    .filter((entry) => entry.name !== item.name)
    .slice(0, 4)
    .map((entry) => entry.name);
  const relatedStock = await fetchStockMap(erpnext, relatedIds);
  const relatedProducts = relatedIds.flatMap((id) => {
    const entry = related.find((candidate) => candidate.name === id);
    return entry ? [mapItemToProduct(entry, relatedStock.get(id) ?? 0)] : [];
  });

  return {
    source: "erpnext",
    product: mapItemToProduct(item, stockMap.get(item.name) ?? 0),
    category: group ? mapGroupToCategory(group) : null,
    related: relatedProducts,
  };
}

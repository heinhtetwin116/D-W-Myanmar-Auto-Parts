/**
 * Unified catalog search — the single entry point for product listing data.
 *
 * Reads ERPNext directly (no Supabase mirror, no dummy fallback): `Item` /
 * `Item Group` list queries for the catalog, `Bin` rows summed per item for
 * stock, `Item Price` for selling price. Responses keep the `CatalogResult`
 * shape so callers never care about the source.
 *
 * Confirmed against the live instance: stock (`Bin`) and price
 * (`Item Price`, `Standard Selling`) are populated; the Item doctype has no
 * custom OEM/vehicle-model fields (removed) and no bilingual name/description
 * fields (never added — English is shown as-is by design, see MEMORY.md).
 * Specs are limited to `country_of_origin`.
 */


import { createERPNextClient, type ERPNextClient } from "@/lib/erpnext/client";
import type {
  CatalogResult,
  CatalogSearchParams,
  Category,
  ERPNextBin,
  ERPNextDocType,
  ERPNextFilterValue,
  ERPNextItem,
  ERPNextItemGroup,
  ERPNextItemPrice,
  Product,
  ProductDetailResult,
} from "@/types/index.type";

const MAX_LIST_IDS = 10000;
const CHUNK_SIZE = 100;
const PREFERRED_PRICE_LIST = "Standard Selling";

const ITEM_FIELDS = [
  "name",
  "item_name",
  "item_group",
  "description",
  "image",
  "disabled",
  "country_of_origin",
];

interface ERPNextItemSpecDoc extends ERPNextDocType {
  name: string;
  item_code: string;
  attribute_name: string;
  attribute_value: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatImageUrl(imagePath?: string | null): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const baseUrl = (process.env.ERPNEXT_BASE_URL || "").replace(/\/$/, "");
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
}

function sortToOrderBy(
  sort: NonNullable<CatalogSearchParams["sort"]>,
): string | undefined {
  switch (sort) {
    case "newest":
      return "creation desc";
    case "price_asc":
    case "price_desc":
      return undefined;
    case "name":
    default:
      return "item_name asc";
  }
}

function mapGroupToCategory(group: ERPNextItemGroup): Category {
  const now = new Date().toISOString();

  return {
    id: group.name,
    erpnext_id: group.name,
    name_en: group.item_group_name,
    name_my: group.item_group_name,
    description_en: null,
    description_my: null,
    enabled: group.disabled !== 1,
    image_url: null,
    created_at: now,
    updated_at: now,
    synced_at: null,
  };
}

function mapItemToProduct(
  item: ERPNextItem,
  stock: number,
  price: number,
  customSpecs: Record<string, string> = {},
): Product {
  const now = new Date().toISOString();
  // Keep ERPNext specifications available for search/data processing,
  // but do not expose OEM numbers on the public product page.
  const specifications: Record<string, string> = Object.fromEntries(
    Object.entries(customSpecs).filter(([key]) => {
      const normalizedKey = key
        .replace(/[._-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      return (
        normalizedKey !== "oem no" &&
        normalizedKey !== "oem number" &&
        normalizedKey !== "capital expense (yuan)"
      );
    }),
  );

  if (item.country_of_origin) {
    specifications.purchase_country = item.country_of_origin;
  }

  return {
    id: item.name,
    erpnext_id: item.name,
    category_id: item.item_group,
    sku: item.name,
    name_en: item.item_name,
    name_my: item.item_name,
    description_en: item.description ? stripHtml(item.description) : null,
    description_my: null,
    specifications:
      Object.keys(specifications).length > 0 ? specifications : null,
    price_mmk: price,
    stock_quantity: stock,
    enabled: item.disabled !== 1,
    image_url: formatImageUrl(item.image),
    created_at: now,
    updated_at: now,
    synced_at: null,
  };
}

type ItemFilter = [string, string, ERPNextFilterValue];

function baseItemFilters(categoryId?: string): ItemFilter[] {
  const filters: ItemFilter[] = [["disabled", "=", 0]];

  if (categoryId) {
    filters.push(["item_group", "=", categoryId]);
  }

  return filters;
}

function itemNameSearchFilters(search?: string): ItemFilter[] | undefined {
  const value = search?.trim();
  if (!value) return undefined;

  const like = `%${value}%`;
  return [
    ["item_name", "like", like],
    ["name", "like", like],
  ];
}

/** Sum Bin.actual_qty per item code. Missing rows mean zero stock. */
async function fetchStockMap(
  erpnext: ERPNextClient,
  itemCodes: string[],
): Promise<Map<string, number>> {
  const stock = new Map<string, number>();
  if (itemCodes.length === 0) return stock;

  const chunks: string[][] = [];
  for (let i = 0; i < itemCodes.length; i += CHUNK_SIZE) {
    chunks.push(itemCodes.slice(i, i + CHUNK_SIZE));
  }

  const pages = await Promise.all(
    chunks.map((codes) =>
      erpnext.listDocuments<ERPNextBin>("Bin", {
        fields: ["item_code", "actual_qty"],
        filters: [["item_code", "in", codes]],
        limitPageLength: MAX_LIST_IDS,
      }),
    ),
  );

  for (const bins of pages) {
    for (const bin of bins) {
      stock.set(
        bin.item_code,
        (stock.get(bin.item_code) ?? 0) + (bin.actual_qty ?? 0),
      );
    }
  }

  return stock;
}

function isBetterPriceMatch(
  candidate: ERPNextItemPrice,
  current: ERPNextItemPrice,
): boolean {
  const candidatePreferred = candidate.price_list === PREFERRED_PRICE_LIST;
  const currentPreferred = current.price_list === PREFERRED_PRICE_LIST;

  if (candidatePreferred !== currentPreferred) return candidatePreferred;
  return (candidate.modified ?? "") > (current.modified ?? "");
}

/** Resolve one selling price per item code from Item Price. */
async function fetchPriceMap(
  erpnext: ERPNextClient,
  itemCodes: string[],
): Promise<Map<string, number>> {
  const prices = new Map<string, ERPNextItemPrice>();
  if (itemCodes.length === 0) return new Map();

  const chunks: string[][] = [];
  for (let i = 0; i < itemCodes.length; i += CHUNK_SIZE) {
    chunks.push(itemCodes.slice(i, i + CHUNK_SIZE));
  }

  const pages = await Promise.all(
    chunks.map((codes) =>
      erpnext.listDocuments<ERPNextItemPrice>("Item Price", {
        fields: ["item_code", "price_list", "price_list_rate", "modified"],
        filters: [
          ["item_code", "in", codes],
          ["selling", "=", 1],
        ],
        limitPageLength: MAX_LIST_IDS,
      }),
    ),
  );

  for (const rows of pages) {
    for (const row of rows) {
      const existing = prices.get(row.item_code);
      if (!existing || isBetterPriceMatch(row, existing)) {
        prices.set(row.item_code, row);
      }
    }
  }

  const result = new Map<string, number>();
  for (const [code, row] of prices) {
    result.set(code, row.price_list_rate ?? 0);
  }

  return result;
}

/** Fetch all Item Specification rows for one Item. */
async function fetchItemSpecifications(
  erpnext: ERPNextClient,
  itemCode: string,
): Promise<Record<string, string>> {
  try {
    const specs = await erpnext.listDocuments<ERPNextItemSpecDoc>(
      "Item Specification",
      {
        fields: ["name", "item_code", "attribute_name", "attribute_value"],
        filters: [["item_code", "=", itemCode]],
        limitPageLength: 100,
      },
    );

    const result: Record<string, string> = {};

    for (const spec of specs) {
      const name = spec.attribute_name?.trim();
      const value = spec.attribute_value?.trim();

      if (name && value) {
        result[name] = value;
      }
    }

    return result;
  } catch (error) {
    // Specification data should not break the whole product page.
    console.error(`Failed to fetch Item Specification for ${itemCode}:`, error);
    return {};
  }
}

/**
 * Search Item Specification by attribute value/name.
 * This allows website search to find OEM No., Car Name, etc.,
 * even when the search text is not part of the ERPNext Item name/code.
 */
async function searchItemSpecificationCodes(
  erpnext: ERPNextClient,
  search?: string,
): Promise<string[]> {
  const value = search?.trim();
  if (!value) return [];

  const like = `%${value}%`;

  try {
    const specs = await erpnext.listDocuments<ERPNextItemSpecDoc>(
      "Item Specification",
      {
        fields: ["item_code", "attribute_name", "attribute_value"],
        orFilters: [
          ["attribute_name", "like", like],
          ["attribute_value", "like", like],
        ],
        limitPageLength: MAX_LIST_IDS,
      },
    );

    return [
      ...new Set(
        specs
          .map((spec) => spec.item_code?.trim())
          .filter((code): code is string => Boolean(code)),
      ),
    ];
  } catch (error) {
    console.error("Failed to search Item Specification:", error);
    return [];
  }
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
  const baseFilters = baseItemFilters(categoryId);
  const nameSearch = itemNameSearchFilters(search);

  // Search Item and Item Specification together so OEM No. / Car Name
  // searches work as well as normal Item Name / Item Code searches.
  const [groups, itemNames, specItemCodes] = await Promise.all([
    erpnext.listDocuments<ERPNextItemGroup>("Item Group", {
      fields: ["name", "item_group_name", "parent_item_group"],
      orderBy: "item_group_name asc",
      limitPageLength: MAX_LIST_IDS,
    }),
    erpnext.listDocuments<Pick<ERPNextItem, "name">>("Item", {
      fields: ["name"],
      filters: baseFilters,
      orFilters: nameSearch,
      orderBy: sortToOrderBy(sort),
      limitPageLength: MAX_LIST_IDS,
    }),
    searchItemSpecificationCodes(erpnext, search),
  ]);

  const categories = groups.map(mapGroupToCategory);

  const itemNameCodes = itemNames.map((item) => item.name);
  let allNames = itemNameCodes;

  // If the search matched Item Specification, validate those item codes
  // against the same Item filters before adding them to the result set.
  if (specItemCodes.length > 0) {
    const specMatchedItems = await erpnext.listDocuments<Pick<ERPNextItem, "name">>(
      "Item",
      {
        fields: ["name"],
        filters: [
          ...baseFilters,
          ["name", "in", specItemCodes.slice(0, MAX_LIST_IDS)],
        ],
        limitPageLength: MAX_LIST_IDS,
      },
    );

    allNames = [
      ...new Set([
        ...itemNameCodes,
        ...specMatchedItems.map((item) => item.name),
      ]),
    ];
  }

  if (allNames.length === 0) {
    return {
      source: "erpnext",
      products: [],
      total: 0,
      categories,
      page,
      pageSize,
    };
  }

  const [stockMap, priceMap] = await Promise.all([
    fetchStockMap(erpnext, allNames),
    fetchPriceMap(erpnext, allNames),
  ]);

  let matchingIds = allNames.filter((name) =>
    stock ? matchesStock(stockMap.get(name) ?? 0, stock) : true,
  );

  if (sort === "price_asc" || sort === "price_desc") {
    const direction = sort === "price_asc" ? 1 : -1;
    matchingIds = [...matchingIds].sort(
      (a, b) => direction * ((priceMap.get(a) ?? 0) - (priceMap.get(b) ?? 0)),
    );
  }

  const total = matchingIds.length;
  const pageIds = matchingIds.slice(
    Math.max(0, (page - 1) * pageSize),
    Math.max(0, page * pageSize),
  );

  const items =
    pageIds.length > 0
      ? await erpnext.listDocuments<ERPNextItem>("Item", {
          fields: ITEM_FIELDS,
          // Frappe expects an array for the `in` operator.
          filters: [["name", "in", pageIds]],
          limitPageLength: pageIds.length,
        })
      : [];

  const byId = new Map(items.map((item) => [item.name, item]));

  // Keep the order from matchingIds/pageIds instead of relying on the
  // order returned by ERPNext for the final page query.
  const products = pageIds.flatMap((id) => {
    const item = byId.get(id);
    return item
      ? [mapItemToProduct(item, stockMap.get(id) ?? 0, priceMap.get(id) ?? 0)]
      : [];
  });

  return {
    source: "erpnext",
    products,
    total,
    categories,
    page,
    pageSize,
  };
}

function isNotFoundError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("(404)");
}

/** Single product detail — Item + stock + price + Item Specification. */
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

  const [group, related, stockMap, priceMap, customSpecs] = await Promise.all([
    erpnext
      .getDocument<ERPNextItemGroup>("Item Group", item.item_group)
      .catch(() => null),
    erpnext
      .listDocuments<ERPNextItem>("Item", {
        fields: ITEM_FIELDS,
        filters: [
          ["item_group", "=", item.item_group],
          ["disabled", "=", 0],
        ],
        orderBy: "item_name asc",
        limitPageLength: 6,
      })
      .catch(() => []),
    fetchStockMap(erpnext, [item.name]),
    fetchPriceMap(erpnext, [item.name]),
    fetchItemSpecifications(erpnext, item.name),
  ]);

  const relatedIds = related
    .filter((entry) => entry.name !== item.name)
    .slice(0, 4)
    .map((entry) => entry.name);

  const [relatedStock, relatedPrice] = await Promise.all([
    fetchStockMap(erpnext, relatedIds),
    fetchPriceMap(erpnext, relatedIds),
  ]);

  const relatedProducts = relatedIds.flatMap((id) => {
    const entry = related.find((candidate) => candidate.name === id);

    return entry
      ? [
          mapItemToProduct(
            entry,
            relatedStock.get(id) ?? 0,
            relatedPrice.get(id) ?? 0,
          ),
        ]
      : [];
  });

  // IMPORTANT: pass customSpecs into the mapped product and return that
  // exact object. Do not call mapItemToProduct() again after merging specs.
  const product = mapItemToProduct(
    item,
    stockMap.get(item.name) ?? 0,
    priceMap.get(item.name) ?? 0,
    customSpecs,
  );

  return {
    source: "erpnext",
    product,
    category: group ? mapGroupToCategory(group) : null,
    related: relatedProducts,
  };
}

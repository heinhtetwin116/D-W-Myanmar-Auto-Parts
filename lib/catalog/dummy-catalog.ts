/**
 * Bundled dummy catalog (`data/*.json`).
 * Used when the Supabase catalog is empty or unreachable.
 * Shapes mirror the Supabase `Category` / `Product` rows so callers
 * never need to care which source served the data.
 */

import type {
  Category,
  DummyQuery,
  Product,
  ProductSort,
} from "@/types/index.type";
import { matchesStockFilter } from "@/lib/catalog/stock";
import dummyCategories from "@/data/categories.json";
import dummyProducts from "@/data/products.json";

function sortDummy(products: Product[], sort: ProductSort): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price_asc":
      return sorted.sort((a, b) => a.price_mmk - b.price_mmk);
    case "price_desc":
      return sorted.sort((a, b) => b.price_mmk - a.price_mmk);
    case "newest":
      return sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
    case "name":
    default:
      return sorted.sort((a, b) => a.name_en.localeCompare(b.name_en));
  }
}

/**
 * All enabled dummy categories, ordered by name (English).
 */
export function getDummyCategories(): Category[] {
  return (dummyCategories as Category[])
    .filter((category) => category.enabled)
    .sort((a, b) => a.name_en.localeCompare(b.name_en));
}

/**
 * Filtered, sorted, paginated dummy products.
 */
export function queryDummyProducts(
  query: DummyQuery,
  page: number,
  pageSize: number,
): { products: Product[]; total: number } {
  const normalizedSearch = (query.search ?? "").trim().toLowerCase();
  const filtered = (dummyProducts as Product[]).filter((product) => {
    if (!product.enabled) return false;
    if (query.categoryId && product.category_id !== query.categoryId) {
      return false;
    }
    if (
      query.stock &&
      !matchesStockFilter(product.stock_quantity, query.stock)
    ) {
      return false;
    }
    if (normalizedSearch) {
      const haystack =
        `${product.name_en} ${product.name_my} ${product.sku}`.toLowerCase();
      if (!haystack.includes(normalizedSearch)) return false;
    }
    return true;
  });

  const sorted = sortDummy(filtered, query.sort ?? "name");

  return {
    products: sorted.slice((page - 1) * pageSize, page * pageSize),
    total: sorted.length,
  };
}

/**
 * Single enabled dummy product by id, or `null` when missing/disabled.
 */
export function getDummyProductById(id: string): Product | null {
  const product = (dummyProducts as Product[]).find(
    (item) => item.id === id && item.enabled,
  );
  return product ?? null;
}

/**
 * Single enabled dummy category by id, or `null` when missing/disabled.
 */
export function getDummyCategoryById(id: string): Category | null {
  const category = getDummyCategories().find((item) => item.id === id);
  return category ?? null;
}

/**
 * Enabled dummy products in the same category, excluding one id.
 */
export function getDummyRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit: number,
): Product[] {
  return (dummyProducts as Product[])
    .filter(
      (item) =>
        item.enabled &&
        item.category_id === categoryId &&
        item.id !== excludeId,
    )
    .slice(0, limit);
}

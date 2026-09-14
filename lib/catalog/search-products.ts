/**
 * Unified catalog search — the single entry point for product listing data.
 *
 * Consolidates category / search / stock / sort / pagination logic for both
 * catalog sources behind one function, following the Query Layer pattern
 * (typed, colocated; no raw `.from(...).select(...)` in components or routes).
 *
 * DATA SOURCES — toggle by commenting out one block below:
 *   - SOURCE 1 (Supabase): comment out the try-block to disable DB fetching.
 *   - SOURCE 2 (dummy JSON): comment out the dummy return to disable fallback.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getCategories,
  getProductCount,
  getProducts,
  type ProductSort,
  type StockFilter,
} from "@/lib/erpnext/queries";
import type { Category, Product } from "@/lib/erpnext/types";
import { CATALOG_PAGE_SIZE } from "@/lib/constants";
import { getDummyCategories, queryDummyProducts } from "./dummy-catalog";

export interface CatalogSearchParams {
  categoryId?: string;
  search?: string;
  stock?: StockFilter;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

export interface CatalogResult {
  source: "db" | "dummy";
  products: Product[];
  total: number;
  categories: Category[];
  page: number;
  pageSize: number;
}

export async function searchProducts(
  supabase: SupabaseClient,
  params: CatalogSearchParams = {},
): Promise<CatalogResult> {
  const {
    categoryId,
    search,
    stock,
    sort = "name",
    page = 1,
    pageSize = CATALOG_PAGE_SIZE,
  } = params;

  // ── SOURCE 1: Supabase database ──────────────────────────────────
  // Comment out this entire try-block to disable DB fetching. When
  // disabled, every call falls through to the dummy catalog below.
  try {
    const dbTotal = await getProductCount(supabase);
    if (dbTotal > 0) {
      const [total, products, categories] = await Promise.all([
        getProductCount(supabase, {
          categoryId,
          search,
          stock,
        }),
        getProducts(supabase, {
          categoryId,
          search,
          stock,
          sort,
          limit: pageSize,
          offset: (page - 1) * pageSize,
        }),
        getCategories(supabase),
      ]);
      return { source: "db", products, total, categories, page, pageSize };
    }
  } catch (error) {
    console.error("Catalog DB unavailable, using dummy data:", error);
  }

  // ── SOURCE 2: Bundled dummy data (`data/*.json`) ─────────────────
  // Comment out this return to disable the dummy fallback. When disabled,
  // an empty or unreachable database yields an empty catalog instead.
  const dummy = queryDummyProducts(
    { categoryId, search, stock, sort },
    page,
    pageSize,
  );
  return {
    source: "dummy",
    products: dummy.products,
    total: dummy.total,
    categories: getDummyCategories(),
    page,
    pageSize,
  };
}

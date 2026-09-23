/**
 * Client-side catalog API layer for TanStack Query.
 *
 * Keep API/request code here — never inline fetch implementations inside
 * components. Components consume these through `useQuery` /
 * `useSuspenseQuery` with keys built by `catalogQueryKey` (every variable
 * that affects the response is part of the key).
 */

import type { CatalogFilters, CatalogResult } from "@/types/index.type";

export function catalogQueryKey(filters: CatalogFilters) {
  return [
    "products",
    {
      search: filters.search,
      category: filters.category,
      stock: filters.stock,
      sort: filters.sort,
      page: filters.page,
      pageSize: filters.pageSize,
    },
  ] as const;
}

export function catalogSearchParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.stock) params.set("stock", filters.stock);
  if (filters.sort) params.set("sort", filters.sort);
  params.set("page", String(filters.page));
  params.set("limit", String(filters.pageSize));
  return params;
}

export async function fetchCatalog(
  filters: CatalogFilters,
): Promise<CatalogResult> {
  const response = await fetch(
    `/api/products?${catalogSearchParams(filters).toString()}`,
  );
  if (!response.ok) {
    throw new Error(`Catalog request failed: ${response.status}`);
  }
  return response.json() as Promise<CatalogResult>;
}

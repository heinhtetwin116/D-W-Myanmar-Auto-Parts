import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  searchProducts,
  type CatalogResult,
  type CatalogSearchParams,
} from "@/lib/catalog/search-products";
import type { ProductSort, StockFilter } from "@/lib/erpnext/queries";
import { CATALOG_PAGE_SIZE, CATALOG_PAGE_SIZE_MAX } from "@/lib/constants";

/** Response shape consumed by `components/catalog/product-catalog.tsx`. */
export type CatalogResponse = CatalogResult;

const STOCK_VALUES: StockFilter[] = ["in_stock", "low_stock", "out_of_stock"];
const SORT_VALUES: ProductSort[] = [
  "name",
  "price_asc",
  "price_desc",
  "newest",
];

function parseParams(searchParams: URLSearchParams): CatalogSearchParams {
  const categoryId = searchParams.get("category") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const rawStock = searchParams.get("stock") ?? "";
  const stock: StockFilter | undefined = STOCK_VALUES.includes(
    rawStock as StockFilter,
  )
    ? (rawStock as StockFilter)
    : undefined;

  const rawSort = searchParams.get("sort") ?? "";
  const sort: ProductSort | undefined = SORT_VALUES.includes(
    rawSort as ProductSort,
  )
    ? (rawSort as ProductSort)
    : undefined;

  const rawPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const rawLimit = Number.parseInt(
    searchParams.get("limit") ?? String(CATALOG_PAGE_SIZE),
    10,
  );
  const pageSize =
    Number.isFinite(rawLimit) &&
    rawLimit > 0 &&
    rawLimit <= CATALOG_PAGE_SIZE_MAX
      ? rawLimit
      : CATALOG_PAGE_SIZE;

  return { categoryId, search, stock, sort, page, pageSize };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supabase = await createClient();
  const result = await searchProducts(supabase, parseParams(searchParams));
  return NextResponse.json(result satisfies CatalogResponse);
}

import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/catalog/search-products";
import type {
  CatalogResult,
  CatalogSearchParams,
  ProductSort,
  StockFilter,
} from "@/types/index.type";
import { CATALOG_PAGE_SIZE, CATALOG_PAGE_SIZE_MAX } from "@/lib/constants";

/** Cache catalog responses for 60s (per URL). */
export const revalidate = 60;

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
  try {
    const result = await searchProducts(parseParams(searchParams));
    return NextResponse.json(result satisfies CatalogResult);
  } catch (error) {
    console.error("Catalog API failed:", error);
    const message =
      error instanceof Error ? error.message : "Catalog unavailable";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

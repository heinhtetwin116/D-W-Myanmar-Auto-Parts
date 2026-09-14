import { LOW_STOCK_THRESHOLD } from "@/lib/constants";

/**
 * Stock availability buckets used by catalog filters and status badges.
 */
export type StockFilter = "in_stock" | "low_stock" | "out_of_stock";

export function getStockStatus(quantity: number): StockFilter {
  if (quantity <= 0) return "out_of_stock";
  if (quantity <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
}

export function matchesStockFilter(
  quantity: number,
  stock: StockFilter,
): boolean {
  return getStockStatus(quantity) === stock;
}

export type StockBadgeTone = "success" | "warning" | "critical";

export function stockBadgeTone(quantity: number): StockBadgeTone {
  const status = getStockStatus(quantity);
  if (status === "out_of_stock") return "critical";
  if (status === "low_stock") return "warning";
  return "success";
}

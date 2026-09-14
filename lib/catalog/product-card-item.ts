import type { Locale } from "@/lib/i18n";
import type { Product } from "@/lib/erpnext/types";

/**
 * Display DTO for `ProductCard`. Distinct from the Supabase `Product` row
 * in `lib/erpnext/types.ts` — never alias this as `Product`.
 */
export interface ProductCardItem {
  id: number | string;
  code: string;
  name: string;
  desc: string;
  stock: number;
  price: string;
}

export function formatPriceMmk(amount: number, currencyLabel: string): string {
  return `${amount.toLocaleString()} ${currencyLabel}`;
}

export function toProductCardItem(
  product: Product,
  locale: Locale | string,
  currencyLabel: string,
): ProductCardItem {
  const isMyanmar = locale === "my";
  return {
    id: product.id,
    code: product.sku,
    name: isMyanmar ? product.name_my : product.name_en,
    desc: (isMyanmar ? product.description_my : product.description_en) ?? "",
    stock: product.stock_quantity,
    price: formatPriceMmk(product.price_mmk, currencyLabel),
  };
}

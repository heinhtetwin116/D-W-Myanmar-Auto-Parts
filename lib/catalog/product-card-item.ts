import type { Locale, Product, ProductCardItem } from "@/types/index.type";

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

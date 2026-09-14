import { Suspense } from "react";
import LoadingSpinner from "@/components/loading-spinner";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { getProductDetail } from "@/lib/catalog/search-products";
import ProductDetail from "@/components/catalog/product-detail";
import type { DetailLabels, ProductDetailPageProps } from "@/types/index.type";
import { parseLocale } from "@/lib/i18n";

/** Cache detail pages for 60s (per slug). */
export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = parseLocale(rawLocale);
  const messages = await getMessages({ locale });

  const result = await getProductDetail(slug);

  if (!result) {
    notFound();
  }

  const { product, category, related: relatedProducts } = result;

  const t = messages.products.detail;
  const name = locale === "my" ? product.name_my : product.name_en;
  const categoryName = category
    ? locale === "my"
      ? category.name_my
      : category.name_en
    : product.sku;

  const labels: DetailLabels = {
    enquire: t.enquire,
    backToCatalog: t.back_to_catalog,
    specs: t.specs,
    relatedProducts: t.related_products,
    currency: messages.common.currency,
    inStock: messages.common.stock.in_stock,
    lowStock: messages.common.stock.low_stock,
    outOfStock: messages.common.stock.out_of_stock,
  };

  return (
    <div className="container-custom section-padding !py-10">
      <Suspense fallback={<LoadingSpinner />}>
        <ProductDetail
          locale={locale}
          product={product}
          categoryName={categoryName}
          related={relatedProducts}
          labels={labels}
          homeLabel={messages.common.home}
          productsLabel={messages.common.products}
          currentLabel={name}
        />
      </Suspense>
    </div>
  );
}

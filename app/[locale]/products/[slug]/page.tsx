import { Suspense } from "react";
import LoadingSpinner from "@/components/loading-spinner";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import {
  getCategoryById,
  getProductById,
  getProductsByCategory,
} from "@/lib/erpnext/queries";
import ProductDetail, {
  type DetailLabels,
} from "@/components/catalog/product-detail";
import { parseLocale } from "@/lib/i18n";

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = parseLocale(rawLocale);
  const messages = await getMessages({ locale });

  const supabase = await createClient();
  const product = await getProductById(supabase, slug).catch((error) => {
    console.error("Failed to load product:", error);
    return null;
  });

  if (!product) {
    notFound();
  }

  const [category, related] = await Promise.all([
    getCategoryById(supabase, product.category_id).catch(() => null),
    getProductsByCategory(supabase, product.category_id, { limit: 5 }).catch(
      () => [],
    ),
  ]);
  const relatedProducts = related
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

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

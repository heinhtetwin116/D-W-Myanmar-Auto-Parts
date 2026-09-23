import { Suspense } from "react";
import LoadingSpinner from "@/components/loading-spinner";
import { getMessages } from "next-intl/server";
import ProductCatalog from "@/components/catalog/product-catalog";
import type { CatalogLabels, ProductsPageProps } from "@/types/index.type";
import { parseLocale } from "@/lib/i18n";
import { CATALOG_PAGE_SIZE } from "@/lib/constants";

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale: rawLocale } = await params;
  const locale = parseLocale(rawLocale);
  const messages = await getMessages({ locale });

  const t = messages.products;
  const labels: CatalogLabels = {
    searchPlaceholder: t.search_placeholder,
    allCategories: t.all_categories,
    allStatus: t.all_status,
    inStock: messages.common.stock.in_stock,
    lowStock: messages.common.stock.low_stock,
    outOfStock: messages.common.stock.out_of_stock,
    currency: messages.common.currency,
    viewDetails: messages.common.view,
    addToEnquiry: t.detail.enquire,
    noResults: t.no_results,
    filterByCategories: t.filter_by_categories,
    stockStatus: t.stock_status,
    popular: t.popular,
    productsFound: t.products_found,
    sortName: t.sort_name,
    sortPriceAsc: t.sort_price_asc,
    sortPriceDesc: t.sort_price_desc,
    sortNewest: t.sort_newest,
  };

  return (
    <div className="container-custom section-padding !py-10">
      <Suspense fallback={<LoadingSpinner />}>
        <ProductCatalog
          locale={locale}
          labels={labels}
          pageSize={CATALOG_PAGE_SIZE}
          title={t.title}
          subtitle={t.subtitle}
          homeLabel={messages.common.home}
          productsLabel={messages.common.products}
        />
      </Suspense>
    </div>
  );
}

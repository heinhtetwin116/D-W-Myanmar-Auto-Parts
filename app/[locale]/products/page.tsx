import { Suspense } from "react";
import { getMessages } from "next-intl/server";
import ProductCatalog, {
  type CatalogLabels,
} from "@/components/product-catalog";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

const PAGE_SIZE = 12;

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = locales.includes(rawLocale as Locale)
    ? (rawLocale as Locale)
    : defaultLocale;
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
    showing: messages.common.showing,
    of: messages.common.of,
    results: messages.common.results,
    sortBy: t.sort_by,
    sortName: t.sort_name,
    sortPriceAsc: t.sort_price_asc,
    sortPriceDesc: t.sort_price_desc,
    sortNewest: t.sort_newest,
  };

  return (
    <div className="container-custom section-padding !py-10">
      <Suspense
        fallback={
          <div className="flex justify-center py-16" aria-label="Loading">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
          </div>
        }
      >
        <ProductCatalog
          locale={locale}
          labels={labels}
          pageSize={PAGE_SIZE}
          title={t.title}
          subtitle={t.subtitle}
          homeLabel={messages.common.home}
          productsLabel={messages.common.products}
        />
      </Suspense>
    </div>
  );
}

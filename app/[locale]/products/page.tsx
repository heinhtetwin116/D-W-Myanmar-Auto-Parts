import { Suspense } from "react";
import { Spin, Typography } from "antd";
import { getMessages } from "next-intl/server";
import ProductCatalog, {
  type CatalogLabels,
} from "@/components/product-catalog";
import ProductsBreadcrumb from "@/components/products-breadcrumb";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

const { Title, Paragraph } = Typography;

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
      <ProductsBreadcrumb
        locale={locale}
        homeLabel={messages.common.home}
        productsLabel={messages.common.products}
      />
      <Title level={2} className="!mb-1">
        {t.title}
      </Title>
      <Paragraph type="secondary" className="mb-6">
        {t.subtitle}
      </Paragraph>

      <Suspense
        fallback={<Spin size="large" className="flex justify-center py-16" />}
      >
        <ProductCatalog locale={locale} labels={labels} pageSize={PAGE_SIZE} />
      </Suspense>
    </div>
  );
}

import { Suspense } from "react";
import Link from "next/link";
import { Breadcrumb, Empty, Spin, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { getMessages } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import {
  getCategories,
  getProductCount,
  getProducts,
  type StockFilter,
} from "@/lib/erpnext/queries";
import ProductCatalog, {
  type CatalogLabels,
} from "@/components/product-catalog";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

const { Title, Paragraph } = Typography;

const PAGE_SIZE = 12;
const STOCK_VALUES: StockFilter[] = ["in_stock", "low_stock", "out_of_stock"];

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    search?: string;
    stock?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = locales.includes(rawLocale as Locale)
    ? (rawLocale as Locale)
    : defaultLocale;
  const filters = await searchParams;
  const messages = await getMessages({ locale });

  const categoryId = filters.category ?? "";
  const search = filters.search ?? "";
  const stock: StockFilter | "" = STOCK_VALUES.includes(
    filters.stock as StockFilter,
  )
    ? (filters.stock as StockFilter)
    : "";
  const requestedPage = Number.parseInt(filters.page ?? "1", 10);
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const supabase = await createClient();

  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let total = 0;
  let loadError: string | null = null;

  try {
    [categories, total, products] = await Promise.all([
      getCategories(supabase),
      getProductCount(supabase, {
        categoryId: categoryId || undefined,
        search: search || undefined,
        stock: stock || undefined,
      }),
      getProducts(supabase, {
        categoryId: categoryId || undefined,
        search: search || undefined,
        stock: stock || undefined,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      }),
    ]);
  } catch (error) {
    console.error("Failed to load product catalog:", error);
    loadError = error instanceof Error ? error.message : messages.common.error;
  }

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
  };

  return (
    <div className="container-custom section-padding !py-10">
      <Breadcrumb
        className="mb-4"
        items={[
          {
            title: (
              <Link href={`/${locale}/`}>
                <HomeOutlined /> {messages.common.home}
              </Link>
            ),
          },
          { title: messages.common.products },
        ]}
      />
      <Title level={2} className="!mb-1">
        {t.title}
      </Title>
      <Paragraph type="secondary" className="mb-6">
        {t.subtitle}
      </Paragraph>

      {loadError ? (
        <Empty description={loadError} className="py-16" />
      ) : (
        <Suspense
          fallback={<Spin size="large" className="flex justify-center py-16" />}
        >
          <ProductCatalog
            locale={locale}
            products={products}
            categories={categories}
            total={total}
            page={page}
            pageSize={PAGE_SIZE}
            search={search}
            categoryId={categoryId}
            stock={stock}
            labels={labels}
          />
        </Suspense>
      )}
    </div>
  );
}

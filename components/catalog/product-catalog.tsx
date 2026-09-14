"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  keepPreviousData,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Empty, Input, Menu, Pagination, Select, Tag, Typography } from "antd";
import ProductsBreadcrumb from "@/components/catalog/products-breadcrumb";
import ProductCard from "@/components/catalog/product-card";
import ProductGridSkeleton from "@/components/catalog/product-grid-skeleton";
import { catalogQueryKey, fetchCatalog } from "@/lib/catalog/client";
import type { CatalogFilters, CatalogLabels } from "@/types/index.type";
import { toProductCardItem } from "@/lib/catalog/product-card-item";
import { stockBadgeTone } from "@/lib/catalog/stock";

const { Title, Text, Paragraph } = Typography;
const { CheckableTag } = Tag;

interface ProductCatalogProps {
  locale: string;
  labels: CatalogLabels;
  pageSize: number;
  title: string;
  subtitle: string;
  homeLabel: string;
  productsLabel: string;
}

function stockBadgeText(quantity: number, labels: CatalogLabels): string {
  if (quantity <= 0) return labels.outOfStock;
  if (quantity <= 10) return labels.lowStock;
  return labels.inStock;
}

export default function ProductCatalog({
  locale,
  labels,
  pageSize,
  title,
  subtitle,
  homeLabel,
  productsLabel,
}: ProductCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("category") ?? "";
  const stock = searchParams.get("stock") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const rawPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const filters: CatalogFilters = {
    search,
    category: categoryId,
    stock,
    sort,
    page,
    pageSize,
  };

  // Shared cache entry with the results below: one network request total.
  // keepPreviousData keeps the last count/categories visible while refetching.
  const { data: headerData } = useQuery({
    queryKey: catalogQueryKey(filters),
    queryFn: () => fetchCatalog(filters),
    placeholderData: keepPreviousData,
  });

  const categories = headerData?.categories ?? [];
  const total = headerData?.total ?? 0;

  const pushParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = {
      search:
        updates.search !== undefined ? updates.search : search || undefined,
      category:
        updates.category !== undefined
          ? updates.category
          : categoryId || undefined,
      stock: updates.stock !== undefined ? updates.stock : stock || undefined,
      sort: updates.sort !== undefined ? updates.sort : sort || undefined,
      page: updates.page,
    };
    if (merged.search) params.set("search", merged.search);
    if (merged.category) params.set("category", merged.category);
    if (merged.stock) params.set("stock", merged.stock);
    if (merged.sort) params.set("sort", merged.sort);
    if (merged.page && merged.page !== "1") params.set("page", merged.page);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div>
      <ProductsBreadcrumb
        locale={locale}
        homeLabel={homeLabel}
        trail={[{ label: productsLabel }]}
      />

      {/* Masthead */}
      <header className="flex justify-between items-end border-b border-border py-8">
        <div>
          <Title level={1} className="!mb-0 !text-3xl sm:!text-4xl">
            {title}
          </Title>
          <Paragraph type="secondary" className="!mt-2 !mb-0">
            {subtitle}
          </Paragraph>
        </div>
        <Paragraph type="secondary" className="!mb-0 whitespace-nowrap">
          <Text strong className="text-lg">
            {total}
          </Text>{" "}
          {labels.productsFound}
        </Paragraph>
      </header>

      <div className="flex flex-col gap-8 lg:flex-row py-8">
        {/* Sidebar filters */}
        <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:h-fit lg:w-56">
          <div className="space-y-8">
            <div>
              <Title level={4} className="!mb-2 pb-2 border-b border-border">
                {labels.filterByCategories}
              </Title>
              <Menu
                mode="inline"
                selectedKeys={[categoryId || "all"]}
                onSelect={(info) =>
                  pushParams({
                    category: info.key === "all" ? undefined : String(info.key),
                    page: "1",
                  })
                }
                items={[
                  { key: "all", label: labels.allCategories },
                  ...categories.map((c) => ({
                    key: c.id,
                    label: locale === "my" ? c.name_my : c.name_en,
                  })),
                ]}
              />
            </div>
            <div>
              <Title level={4} className="!mb-2 pb-2 border-b border-border">
                {labels.stockStatus}
              </Title>
              <Menu
                mode="inline"
                selectedKeys={[stock || "all"]}
                onSelect={(info) =>
                  pushParams({
                    stock: info.key === "all" ? undefined : String(info.key),
                    page: "1",
                  })
                }
                items={[
                  { value: "all", label: labels.allStatus },
                  { value: "in_stock", label: labels.inStock },
                  { value: "low_stock", label: labels.lowStock },
                  { value: "out_of_stock", label: labels.outOfStock },
                ].map((item) => ({ key: item.value, label: item.label }))}
              />
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <section className="flex-1 min-w-0">
          <div className="mb-6">
            <Input.Search
              placeholder={labels.searchPlaceholder}
              defaultValue={search}
              key={search}
              allowClear
              enterButton
              size="large"
              onSearch={(value) =>
                pushParams({ search: value || undefined, page: "1" })
              }
            />
          </div>

          <div className="mb-6 flex flex-col items-start justify-between gap-4 pb-5 sm:flex-row sm:items-center border-b border-border">
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
              <Text
                strong
                type="secondary"
                className="shrink-0 text-xs uppercase tracking-wide"
              >
                {labels.popular}:
              </Text>
              {categories.slice(0, 5).map((c) => {
                const label = locale === "my" ? c.name_my : c.name_en;
                const checked = categoryId === c.id;
                return (
                  <CheckableTag
                    key={c.id}
                    checked={checked}
                    onChange={() =>
                      pushParams({
                        category: checked ? undefined : c.id,
                        page: "1",
                      })
                    }
                    className={
                      checked
                        ? "!bg-accent !text-accent-foreground !border-accent"
                        : ""
                    }
                  >
                    {label}
                  </CheckableTag>
                );
              })}
            </div>
            <Select
              value={sort || "name"}
              style={{ width: 160 }}
              onChange={(value) =>
                pushParams({
                  sort: value === "name" ? undefined : value,
                  page: "1",
                })
              }
              options={[
                { value: "name", label: labels.sortName },
                { value: "price_asc", label: labels.sortPriceAsc },
                { value: "price_desc", label: labels.sortPriceDesc },
                { value: "newest", label: labels.sortNewest },
              ]}
            />
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <CatalogResults locale={locale} labels={labels} filters={filters} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

function CatalogResults({
  locale,
  labels,
  filters,
}: {
  locale: string;
  labels: CatalogLabels;
  filters: CatalogFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { data } = useSuspenseQuery({
    queryKey: catalogQueryKey(filters),
    queryFn: () => fetchCatalog(filters),
  });

  const { products, total } = data;

  if (products.length === 0) {
    return <Empty description={labels.noResults} className="py-16" />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={toProductCardItem(product, locale, labels.currency)}
            badge={{
              text: stockBadgeText(product.stock_quantity, labels),
              tone: stockBadgeTone(product.stock_quantity),
            }}
            detailsHref={`/${locale}/products/${product.id}`}
            detailsLabel={labels.viewDetails}
          />
        ))}
      </div>

      {total > filters.pageSize && (
        <div className="mt-8 flex justify-center">
          <Pagination
            current={filters.page}
            pageSize={filters.pageSize}
            total={total}
            showSizeChanger={false}
            onChange={(nextPage) => {
              const params = new URLSearchParams();
              if (filters.search) params.set("search", filters.search);
              if (filters.category) params.set("category", filters.category);
              if (filters.stock) params.set("stock", filters.stock);
              if (filters.sort) params.set("sort", filters.sort);
              if (nextPage !== 1) params.set("page", String(nextPage));
              const query = params.toString();
              router.push(query ? `${pathname}?${query}` : pathname);
            }}
          />
        </div>
      )}
    </>
  );
}

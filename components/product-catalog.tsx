"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Empty, Input, Menu, Pagination, Select, Tag, Typography } from "antd";
import type { CatalogResponse } from "@/app/api/products/route";
import ProductsBreadcrumb from "@/components/products-breadcrumb";
import ProductCard from "@/components/product-card";

const { Title, Text, Paragraph } = Typography;
const { CheckableTag } = Tag;

export interface CatalogLabels {
  searchPlaceholder: string;
  allCategories: string;
  allStatus: string;
  inStock: string;
  lowStock: string;
  outOfStock: string;
  currency: string;
  viewDetails: string;
  addToEnquiry: string;
  noResults: string;
  filterByCategories: string;
  stockStatus: string;
  popular: string;
  productsFound: string;
  sortName: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortNewest: string;
}

interface ProductCatalogProps {
  locale: string;
  labels: CatalogLabels;
  pageSize: number;
  title: string;
  subtitle: string;
  homeLabel: string;
  productsLabel: string;
}

async function fetchCatalog(params: URLSearchParams): Promise<CatalogResponse> {
  const response = await fetch(`/api/products?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Catalog request failed: ${response.status}`);
  }
  return response.json() as Promise<CatalogResponse>;
}

function stockBadge(
  quantity: number,
  labels: CatalogLabels,
): { status: "success" | "warning" | "error"; text: string } {
  if (quantity <= 0) {
    return { status: "error", text: labels.outOfStock };
  }
  if (quantity <= 10) {
    return { status: "warning", text: labels.lowStock };
  }
  return { status: "success", text: labels.inStock };
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

  const queryParams = new URLSearchParams();
  if (search) queryParams.set("search", search);
  if (categoryId) queryParams.set("category", categoryId);
  if (stock) queryParams.set("stock", stock);
  if (sort) queryParams.set("sort", sort);
  queryParams.set("page", String(page));
  queryParams.set("limit", String(pageSize));

  const { data } = useSuspenseQuery({
    queryKey: [
      "products",
      { search, category: categoryId, stock, sort, page, pageSize },
    ],
    queryFn: () => fetchCatalog(queryParams),
  });

  const { products, categories, total } = data;

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
        productsLabel={productsLabel}
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

          {products.length === 0 ? (
            <Empty description={labels.noResults} className="py-16" />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product) => {
                  const badge = stockBadge(product.stock_quantity, labels);
                  const tone =
                    badge.status === "success"
                      ? ("success" as const)
                      : badge.status === "warning"
                        ? ("warning" as const)
                        : ("critical" as const);
                  return (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        code: product.sku,
                        name:
                          locale === "my" ? product.name_my : product.name_en,
                        desc:
                          (locale === "my"
                            ? product.description_my
                            : product.description_en) ?? "",
                        stock: product.stock_quantity,
                        price: `${product.price_mmk.toLocaleString()} ${labels.currency}`,
                      }}
                      badge={{ text: badge.text, tone }}
                      detailsHref={`/${locale}/products/${product.id}`}
                      detailsLabel={labels.viewDetails}
                    />
                  );
                })}
              </div>

              {total > pageSize && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger={false}
                    onChange={(nextPage) =>
                      pushParams({ page: String(nextPage) })
                    }
                  />
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

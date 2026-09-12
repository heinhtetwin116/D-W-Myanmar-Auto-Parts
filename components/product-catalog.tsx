"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Badge,
  Card,
  Col,
  Empty,
  Image,
  Input,
  Pagination,
  Row,
  Select,
  Typography,
} from "antd";
import { EyeOutlined, PictureOutlined, PlusOutlined } from "@ant-design/icons";
import type { Category, Product } from "@/lib/erpnext/types";

const { Title, Text, Paragraph } = Typography;

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
  showing: string;
  of: string;
  results: string;
}

interface ProductCatalogProps {
  locale: string;
  products: Product[];
  categories: Category[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  categoryId: string;
  stock: string;
  labels: CatalogLabels;
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
  products,
  categories,
  total,
  page,
  pageSize,
  search,
  categoryId,
  stock,
  labels,
}: ProductCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();

  const pushParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    if (updates.search) params.set("search", updates.search);
    if (updates.category) params.set("category", updates.category);
    if (updates.stock) params.set("stock", updates.stock);
    if (updates.page && updates.page !== "1") params.set("page", updates.page);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const categoryName = (product: Product) => {
    const category = categories.find((c) => c.id === product.category_id);
    if (!category) return product.sku;
    return locale === "my" ? category.name_my : category.name_en;
  };

  return (
    <div>
      <Card className="mb-6" bordered>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={10}>
            <Input.Search
              placeholder={labels.searchPlaceholder}
              defaultValue={search}
              allowClear
              enterButton
              onSearch={(value) =>
                pushParams({
                  search: value || undefined,
                  category: categoryId || undefined,
                  stock: stock || undefined,
                  page: "1",
                })
              }
            />
          </Col>
          <Col xs={12} md={7}>
            <Select
              className="w-full"
              value={categoryId || "all"}
              onChange={(value) =>
                pushParams({
                  search: search || undefined,
                  category: value === "all" ? undefined : value,
                  stock: stock || undefined,
                  page: "1",
                })
              }
              options={[
                { value: "all", label: labels.allCategories },
                ...categories.map((c) => ({
                  value: c.id,
                  label: locale === "my" ? c.name_my : c.name_en,
                })),
              ]}
            />
          </Col>
          <Col xs={12} md={7}>
            <Select
              className="w-full"
              value={stock || "all"}
              onChange={(value) =>
                pushParams({
                  search: search || undefined,
                  category: categoryId || undefined,
                  stock: value === "all" ? undefined : value,
                  page: "1",
                })
              }
              options={[
                { value: "all", label: labels.allStatus },
                { value: "in_stock", label: labels.inStock },
                { value: "low_stock", label: labels.lowStock },
                { value: "out_of_stock", label: labels.outOfStock },
              ]}
            />
          </Col>
        </Row>
      </Card>

      <Paragraph type="secondary" className="mb-4">
        {labels.showing} <Text strong>{products.length}</Text> {labels.of}{" "}
        <Text strong>{total}</Text> {labels.results}
      </Paragraph>

      {products.length === 0 ? (
        <Empty description={labels.noResults} className="py-16" />
      ) : (
        <Row gutter={[16, 16]}>
          {products.map((product) => {
            const badge = stockBadge(product.stock_quantity, labels);
            const name = locale === "my" ? product.name_my : product.name_en;
            return (
              <Col key={product.id} xs={24} sm={12} lg={8} xl={6}>
                <Link href={`/${locale}/products/${product.id}`}>
                  <Card
                    hoverable
                    className="h-full hex-bloom"
                    cover={
                      <div className="flex h-44 items-center justify-center overflow-hidden bg-muted">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={name}
                            preview={false}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <PictureOutlined className="text-4xl text-muted-foreground" />
                        )}
                      </div>
                    }
                    actions={[
                      <span key="view">
                        <EyeOutlined /> {labels.viewDetails}
                      </span>,
                      <span key="add">
                        <PlusOutlined /> {labels.addToEnquiry}
                      </span>,
                    ]}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <Text type="secondary" className="text-xs">
                        {categoryName(product)}
                      </Text>
                      <Badge status={badge.status} text={badge.text} />
                    </div>
                    <Title level={5} ellipsis={{ rows: 2 }} className="!mb-1">
                      {name}
                    </Title>
                    <Text type="secondary" className="text-xs">
                      SKU: {product.sku}
                    </Text>
                    <div className="mt-2">
                      <Text strong className="text-base text-accent">
                        {product.price_mmk.toLocaleString()} {labels.currency}
                      </Text>
                    </div>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
      )}

      {total > pageSize && (
        <div className="mt-8 flex justify-center">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger={false}
            onChange={(nextPage) =>
              pushParams({
                search: search || undefined,
                category: categoryId || undefined,
                stock: stock || undefined,
                page: String(nextPage),
              })
            }
          />
        </div>
      )}
    </div>
  );
}

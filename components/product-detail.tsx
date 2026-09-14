"use client";

import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Image,
  Row,
  Tag,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  PictureOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import type { Product } from "@/lib/erpnext/types";
import ProductsBreadcrumb from "@/components/products-breadcrumb";

const { Title, Text, Paragraph } = Typography;

export interface DetailLabels {
  enquire: string;
  backToCatalog: string;
  specs: string;
  relatedProducts: string;
  currency: string;
  inStock: string;
  lowStock: string;
  outOfStock: string;
}

interface ProductDetailProps {
  locale: string;
  product: Product;
  categoryName: string;
  related: Product[];
  labels: DetailLabels;
  homeLabel: string;
  productsLabel: string;
  currentLabel: string;
}

export default function ProductDetail({
  locale,
  product,
  categoryName,
  related,
  labels,
  homeLabel,
  productsLabel,
  currentLabel,
}: ProductDetailProps) {
  const name = locale === "my" ? product.name_my : product.name_en;
  const description =
    locale === "my" ? product.description_my : product.description_en;

  const stockBadge =
    product.stock_quantity <= 0
      ? { status: "error" as const, text: labels.outOfStock }
      : product.stock_quantity <= 10
        ? { status: "warning" as const, text: labels.lowStock }
        : { status: "success" as const, text: labels.inStock };

  const specEntries = Object.entries(product.specifications ?? {});

  return (
    <div>
      <ProductsBreadcrumb
        locale={locale}
        homeLabel={homeLabel}
        productsLabel={productsLabel}
        currentLabel={currentLabel}
      />
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={10}>
          <Card bordered className="overflow-hidden">
            <div className="flex min-h-80 items-center justify-center bg-muted">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={name}
                  className="max-h-96 w-full object-contain"
                />
              ) : (
                <Empty
                  image={
                    <PictureOutlined className="text-6xl text-muted-foreground" />
                  }
                  description={false}
                  className="py-16"
                />
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Link href={`/${locale}/products?category=${product.category_id}`}>
              <Tag color="red">{categoryName}</Tag>
            </Link>
            <Badge status={stockBadge.status} text={stockBadge.text} />
          </div>
          <Title level={2} className="!mb-1">
            {name}
          </Title>
          <Text type="secondary">SKU: {product.sku}</Text>

          <div className="mt-4">
            <Text className="text-3xl font-bold text-accent">
              {product.price_mmk.toLocaleString()} {labels.currency}
            </Text>
          </div>

          {description && (
            <Paragraph className="mt-4 text-base">{description}</Paragraph>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/${locale}/contact`}>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                className="hex-bloom"
                disabled={product.stock_quantity <= 0}
              >
                {labels.enquire}
              </Button>
            </Link>
            <Link href={`/${locale}/products`}>
              <Button size="large" icon={<ArrowLeftOutlined />}>
                {labels.backToCatalog}
              </Button>
            </Link>
          </div>

          {specEntries.length > 0 && (
            <>
              <Divider />
              <Title level={4}>{labels.specs}</Title>
              <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                {specEntries.map(([key, value]) => (
                  <Descriptions.Item key={key} label={key}>
                    {String(value)}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </>
          )}
        </Col>
      </Row>

      {related.length > 0 && (
        <div className="mt-12">
          <Title level={3} className="mb-6">
            {labels.relatedProducts}
          </Title>
          <Row gutter={[16, 16]}>
            {related.map((item) => {
              const itemName = locale === "my" ? item.name_my : item.name_en;
              return (
                <Col key={item.id} xs={24} sm={12} lg={6}>
                  <Link href={`/${locale}/products/${item.id}`}>
                    <Card
                      hoverable
                      className="h-full hex-bloom"
                      cover={
                        <div className="flex h-40 items-center justify-center overflow-hidden bg-muted">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={itemName}
                              preview={false}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <PictureOutlined className="text-4xl text-muted-foreground" />
                          )}
                        </div>
                      }
                    >
                      <Title level={5} ellipsis={{ rows: 2 }} className="!mb-1">
                        {itemName}
                      </Title>
                      <Text strong className="text-accent">
                        {item.price_mmk.toLocaleString()} {labels.currency}
                      </Text>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        </div>
      )}
    </div>
  );
}

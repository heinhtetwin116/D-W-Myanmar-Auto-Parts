"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Image,
  Row,
  Tag,
  Typography,
} from "antd";
import { ArrowLeftOutlined, PictureOutlined } from "@ant-design/icons";
import type { ProductDetailProps } from "@/types/index.type";
import ProductsBreadcrumb from "@/components/catalog/products-breadcrumb";
import { formatPriceMmk } from "@/lib/catalog/product-card-item";
import AddToCartButton from "@/components/cart/add-to-cart-button";

const { Title, Text, Paragraph } = Typography;

function resolveImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const baseUrl = (
    process.env.NEXT_PUBLIC_ERPNEXT_BASE_URL ||
    process.env.ERPNEXT_BASE_URL ||
    ""
  ).replace(/\/$/, "");
  return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
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
  const tDetail = useTranslations("products.detail");
  // ERPNext currently provides English item names/descriptions only for many
  // products. Fall back to English instead of leaving the Myanmar page blank.
  const name =
    (locale === "my" ? product.name_my : product.name_en) ||
    product.name_en ||
    product.name_my ||
    product.sku;
  const description =
    (locale === "my" ? product.description_my : product.description_en) ||
    product.description_en ||
    product.description_my ||
    "";

  const isMyanmar = locale === "my";

  const specLabel = (key: string) => {
    if (!isMyanmar) {
      return key.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
    }

    const normalized = key
      .replace(/[._-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    const translations: Record<string, string> = {
      "purchase country": "ဝယ်ယူသည့်နိုင်ငံ",
      "country of origin": "မူရင်းနိုင်ငံ",
      "blade or refill": "Blade အမျိုးအစား",
      products: "အမျိုးအစား",
      size: "အရွယ်အစား",
      weight: "အလေးချိန်",
      material: "ပစ္စည်းအမျိုးအစား",
      brand: "အမှတ်တံဆိပ်",
      model: "မော်ဒယ်",
      "vehicle model": "ကားမော်ဒယ်",
      "car name": "ကားအမည်",
      length: "အလျား",
      width: "အနံ",
      height: "အမြင့်",
    };
    return (
      translations[normalized] ??
      key.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim()
    );
  };

  const specEntries = Object.entries(product.specifications ?? {});
  const mainImageUrl = resolveImageUrl(product.image_url);

  return (
    <div className="space-y-6 pb-8">
      <ProductsBreadcrumb
        locale={locale}
        homeLabel={homeLabel}
        trail={[
          { label: productsLabel, href: `/${locale}/products` },
          { label: currentLabel },
        ]}
      />
      <Row gutter={[28, 28]} align="top">
        <Col xs={24} lg={11}>
          <Card
            variant="outlined"
            className="overflow-hidden !rounded-2xl !border-border !shadow-sm"
          >
            <div className="flex min-h-[320px] items-center justify-center rounded-xl bg-white p-5 sm:min-h-[420px]">
              {mainImageUrl ? (
                <Image
                  src={mainImageUrl}
                  alt={name}
                  className="max-h-[390px] w-full object-contain"
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

        <Col xs={24} lg={13}>
          <Card
            variant="outlined"
            className="!rounded-2xl !border-border !shadow-sm"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Link
                href={`/${locale}/products?category=${product.category_id}`}
              >
                <Tag color="red">{categoryName}</Tag>
              </Link>
            </div>
            <Title level={2} className="!mb-2 !text-2xl sm:!text-3xl">
              {name}
            </Title>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <Text className="text-xl font-bold text-accent sm:text-2xl">
                {formatPriceMmk(product.price_mmk, labels.currency)}
              </Text>
              <Text type="secondary" className="text-xs sm:text-sm">
                {tDetail("price_notice")}
              </Text>
            </div>

            {description && (
              <Paragraph className="mt-4 text-base leading-7 text-foreground/80">
                {description}
              </Paragraph>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <AddToCartButton
                product={{
                  id: String(product.id),
                  code: product.sku,
                  name,
                  price: product.price_mmk,
                  imageUrl: product.image_url ?? undefined,
                }}
                label={isMyanmar ? "ခြင်းထဲထည့်ရန်" : "Add to cart"}
                size="large"
              />
              <Link href={`/${locale}/contact`}>
                <Button size="large">{labels.enquire}</Button>
              </Link>
              <Link href={`/${locale}/products`}>
                <Button size="large" icon={<ArrowLeftOutlined />}>
                  {labels.backToCatalog}
                </Button>
              </Link>
            </div>

            {specEntries.length > 0 && (
              <div className="mt-7 border-t border-border pt-5">
                <Title level={4} className="!mb-4">
                  {labels.specs}
                </Title>
                <Descriptions
                  bordered
                  column={{ xs: 1, sm: 1, md: 2 }}
                  size="middle"
                  className="product-specifications"
                >
                  {specEntries.map(([key, value]) => (
                    <Descriptions.Item key={key} label={specLabel(key)}>
                      {String(value)}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {related.length > 0 && (
        <div className="mt-6">
          <Title level={3} className="!mb-5">
            {labels.relatedProducts}
          </Title>
          <Row gutter={[16, 16]}>
            {related.map((item) => {
              const itemName =
                (locale === "my" ? item.name_my : item.name_en) ||
                item.name_en ||
                item.name_my ||
                item.sku;
              const relatedImageUrl = resolveImageUrl(item.image_url);

              return (
                <Col key={item.id} xs={24} sm={12} lg={6}>
                  <Link href={`/${locale}/products/${item.id}`}>
                    <Card
                      hoverable
                      className="h-full !overflow-hidden !rounded-xl !border-border hex-bloom"
                      cover={
                        <div className="flex h-44 items-center justify-center overflow-hidden bg-white p-3">
                          {relatedImageUrl ? (
                            <Image
                              src={relatedImageUrl}
                              alt={itemName}
                              preview={false}
                              className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <PictureOutlined className="text-4xl text-muted-foreground" />
                          )}
                        </div>
                      }
                    >
                      <Title level={5} ellipsis={{ rows: 2 }} className="!mb-2">
                        {itemName}
                      </Title>
                      <Text strong className="text-accent">
                        {formatPriceMmk(item.price_mmk, labels.currency)}
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

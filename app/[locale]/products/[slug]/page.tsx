import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Badge,
  Breadcrumb,
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
  HomeOutlined,
  PictureOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { getMessages } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import {
  getCategoryById,
  getProductById,
  getProductsByCategory,
} from "@/lib/erpnext/queries";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

const { Title, Text, Paragraph } = Typography;

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = locales.includes(rawLocale as Locale)
    ? (rawLocale as Locale)
    : defaultLocale;
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
  const description =
    locale === "my" ? product.description_my : product.description_en;
  const categoryName = category
    ? locale === "my"
      ? category.name_my
      : category.name_en
    : product.sku;

  const stockBadge =
    product.stock_quantity <= 0
      ? { status: "error" as const, text: messages.common.stock.out_of_stock }
      : product.stock_quantity <= 10
        ? { status: "warning" as const, text: messages.common.stock.low_stock }
        : { status: "success" as const, text: messages.common.stock.in_stock };

  const specEntries = Object.entries(product.specifications ?? {});

  return (
    <div className="container-custom section-padding !py-10">
      <Breadcrumb
        className="mb-6"
        items={[
          {
            title: (
              <Link href={`/${locale}/`}>
                <HomeOutlined /> {messages.common.home}
              </Link>
            ),
          },
          {
            title: (
              <Link href={`/${locale}/products`}>
                {messages.common.products}
              </Link>
            ),
          },
          { title: name },
        ]}
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
              {product.price_mmk.toLocaleString()} {messages.common.currency}
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
                {t.enquire}
              </Button>
            </Link>
            <Link href={`/${locale}/products`}>
              <Button size="large" icon={<ArrowLeftOutlined />}>
                {t.back_to_catalog}
              </Button>
            </Link>
          </div>

          {specEntries.length > 0 && (
            <>
              <Divider />
              <Title level={4}>{t.specs}</Title>
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

      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <Title level={3} className="mb-6">
            {t.related_products}
          </Title>
          <Row gutter={[16, 16]}>
            {relatedProducts.map((item) => {
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
                        {item.price_mmk.toLocaleString()}{" "}
                        {messages.common.currency}
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

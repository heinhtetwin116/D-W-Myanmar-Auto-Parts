import { getMessages, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Truck,
  Shield,
  DollarSign,
  Star,
} from "lucide-react";
import { Card, Row, Col, Button, Badge } from "antd";
import { createClient } from "@/lib/supabase/server";

interface HomePageProps {
  params: Promise<{ locale: "my" | "en" }>;
}

async function getFeaturedProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(3);

  return data || [];
}

async function getStats() {
  const supabase = await createClient();
  const [{ count: productsCount }, { count: customersCount }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);

  return {
    products: productsCount || 500,
    customers: customersCount || 10000,
    years: 20,
    locations: 50,
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const t = messages;
  const heroT = t.hero;
  const valuePropsT = t.valueProps;
  const featuredT = t.featuredProducts;
  const trustT = t.trustIndicators;
  const ctaT = t.cta;
  const commonT = t.common;

  const [featuredProducts, stats] = await Promise.all([
    getFeaturedProducts(),
    getStats(),
  ]);

  const valueProps = [
    {
      icon: CheckCircle,
      title: valuePropsT.quality.title,
      description: valuePropsT.quality.description,
    },
    {
      icon: DollarSign,
      title: valuePropsT.price.title,
      description: valuePropsT.price.description,
    },
    {
      icon: Shield,
      title: valuePropsT.warranty.title,
      description: valuePropsT.warranty.description,
    },
    {
      icon: Truck,
      title: valuePropsT.delivery.title,
      description: valuePropsT.delivery.description,
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 lg:py-32">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 hex-bloom" style={{ fontSize: "0.875rem" }}>
              <Star className="mr-1" />
              {locale === "my"
                ? "20+ နှစ်များ၏ အတွေ့အကြုံ"
                : "20+ Years of Excellence"}
            </Badge>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground mb-6">
              {heroT.title}
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {heroT.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`/${locale}/products`}>
                <Button
                  type="primary"
                  size="large"
                  className="hex-bloom w-full sm:w-auto gap-2"
                >
                  {heroT.cta_primary}
                  <ArrowRight />
                </Button>
              </Link>
              <Link href={`/${locale}/about`}>
                <Button
                  type="default"
                  size="large"
                  className="w-full sm:w-auto"
                >
                  {heroT.cta_secondary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {locale === "my"
                ? "လsiębiorလိုအပ်သော ပစ္စည်းများကို ရွေးချယ်ရန် �ategoriလစ်ထုတ်ပေးရန်"
                : "Why Choose D&W Auto Parts?"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {locale === "my"
                ? "ကျွန်ုပ်တို့သည် သင့်အုပ်စနစ်အတွက်ကိုယ်တိုင်သော ပစ္စည်းများကို ရွေးချယ်ပေးရန် စေတနာ့စรั квартиစိတ်ဖြင့်အကူအညီပေးထားသည်။"
                : "We are committed to helping you find the perfect parts for your vehicle with confidence and ease."}
            </p>
          </div>

          <Row gutter={[24, 16]} className="gap-8">
            {valueProps.map((prop, index) => (
              <Col key={index} xs={24} sm={12} lg={6}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 hex-bloom border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                      <prop.icon className="text-xl" />
                    </div>
                    <div>
                      <h4 className="text-foreground mb-2">{prop.title}</h4>
                      <span className="text-muted-foreground text-sm">
                        {prop.description}
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {featuredT.title}
              </h2>
              <span className="text-muted-foreground">
                {locale === "my"
                  ? "ကျွန်ုပ်တို့ရဲ့ အနည်းဆုံးရောင်းချများနှင့် လူဝယ်များအနေအထားတွင်လည်း အရမ်းထမင့်သော ပစ္စည်းများ"
                  : "Our top-selling and most trusted products"}
              </span>
            </div>
            <Link href={`/${locale}/products`} className="mt-4 lg:mt-0">
              <Button type="text" className="text-accent hover:bg-accent/10">
                {featuredT.view_all}
                <ArrowRight className="ml-1" />
              </Button>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <Row gutter={[24, 16]}>
              {featuredProducts.map((product) => (
                <Col key={product.id} xs={24} sm={12} lg={8}>
                  <Link href={`/${locale}/products/${product.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hex-bloom border-border group">
                      <div className="aspect-video relative bg-muted overflow-hidden">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={
                              locale === "my"
                                ? product.name_my
                                : product.name_en
                            }
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground/50">
                            <Image
                              src="/placeholder-product.svg"
                              alt=""
                              width={64}
                              height={64}
                            />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge
                            status={
                              product.stock_status === "in_stock"
                                ? "success"
                                : product.stock_status === "low_stock"
                                  ? "warning"
                                  : "error"
                            }
                            className="text-xs"
                          >
                            {
                              commonT.stock[
                                product.stock_status as keyof typeof commonT.stock
                              ]
                            }
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                            {locale === "my"
                              ? product.name_my
                              : product.name_en}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="px-2 py-1 bg-muted rounded-full text-xs">
                            {product.category_id}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span
                            // type="secondary"
                            // strong
                            className="text-xl text-accent"
                          >
                            {product.price.toLocaleString()} {commonT.currency}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-16">
              <Image
                src="/placeholder-products.svg"
                alt=""
                width={200}
                height={200}
                className="mx-auto mb-4 opacity-50"
              />
              <h3 className="text-muted-foreground">
                {locale === "my"
                  ? "အချိန်နဲ့ ပစ္စည်းများထည့်သွင်းနေပါသည်"
                  : "Products coming soon"}
              </h3>
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              {
                icon: Star,
                value: stats.customers.toLocaleString(),
                label: trustT.customers,
              },
              {
                icon: CheckCircle,
                value: stats.products.toLocaleString(),
                label: trustT.products,
              },
              {
                icon: Shield,
                value: `${stats.years}+`,
                label: trustT.years,
              },
              {
                icon: Truck,
                value: `${stats.locations}+`,
                label: trustT.locations,
              },
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <stat.icon className="text-2xl" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{ctaT.title}</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {ctaT.subtitle}
          </p>
          <Link href={`/${locale}/contact`}>
            <Button
              type="default"
              size="large"
              className="bg-background text-foreground hex-bloom border-border hover:bg-background/90"
            >
              {ctaT.button}
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { Truck, Tag, PhoneCall, ShieldCheck } from "lucide-react";
import { getMessages } from "next-intl/server";
import ProductCard from "@/components/catalog/product-card";
import Hero from "@/components/marketing/hero";
import FAQ from "@/components/marketing/faq";
import Testimonials from "@/components/marketing/testimonials";
import { searchProducts } from "@/lib/catalog/search-products";
import { toProductCardItem } from "@/lib/catalog/product-card-item";
import { getStockStatus, stockBadgeTone } from "@/lib/catalog/stock";
import { parseLocale } from "@/lib/i18n";
import type { HomePageProps, Product } from "@/types/index.type";

export const revalidate = 60;

const HOME_SECTION_SIZE = 8;

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  const locale = parseLocale(rawLocale);
  const messages = await getMessages({ locale });
  const currency = messages.common.currency;
  const stockLabels = messages.common.stock;

  // TODO: once ERPNext has a `custom_featured` field on Item, filter this
  // query by it (extend CatalogSearchParams/itemFilters with a `featured`
  // param). For now this is just the default-sorted catalog page.
  const [{ products: featuredRaw }, { products: latestRaw }] =
    await Promise.all([
      searchProducts({ pageSize: HOME_SECTION_SIZE }),
      searchProducts({ pageSize: HOME_SECTION_SIZE, sort: "newest" }),
    ]);

  function stockBadgeText(quantity: number): string {
    const status = getStockStatus(quantity);
    if (status === "out_of_stock") return stockLabels.out_of_stock;
    if (status === "low_stock") return stockLabels.low_stock;
    return stockLabels.in_stock;
  }

  function toCard(product: Product) {
    return {
      product: toProductCardItem(product, locale, currency),
      badge: {
        text: stockBadgeText(product.stock_quantity),
        tone: stockBadgeTone(product.stock_quantity),
      },
      detailsHref: `/${locale}/products/${product.id}`,
    };
  }

  const featuredProducts = featuredRaw.map(toCard);
  const latestProducts = latestRaw.map(toCard);

  return (
    <div className="min-h-screen flex flex-col font-manrope">
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Features Bar */}
        <section className="border-b border-border py-6">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="text-accent">
                <Truck size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">
                  Example Feature
                </h4>
                <p className="text-xs text-muted-foreground">Sentence</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-accent">
                <PhoneCall size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">
                  Example Feature
                </h4>
                <p className="text-xs text-muted-foreground">Sentence</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-accent">
                <ShieldCheck size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">
                  Example Feature
                </h4>
                <p className="text-xs text-muted-foreground">Sentence</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-accent">
                <Tag size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">
                  Example Feature
                </h4>
                <p className="text-xs text-muted-foreground">Sentence</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-border pb-4 gap-4">
            <h2 className="text-2xl font-bold text-foreground">
              Featured Products
            </h2>
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <button className="text-foreground bg-card px-4 py-1.5 rounded shadow-default border border-border">
                All
              </button>
              <button className="text-muted-foreground hover:text-foreground">
                Engine
              </button>
              <button className="text-muted-foreground hover:text-foreground">
                Brakes
              </button>
              <button className="text-muted-foreground hover:text-foreground">
                Suspension
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((card) => (
              <ProductCard key={card.product.id} {...card} />
            ))}
          </div>
        </section>

        {/* Latest Products */}
        <section className="py-16 border-t border-border w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-border pb-4 gap-4">
              <h2 className="text-2xl font-bold text-foreground">
                Latest Products
              </h2>
              <div className="flex flex-wrap gap-4 text-sm font-medium">
                <button className="text-foreground bg-background px-4 py-1.5 rounded shadow-default border border-border">
                  New Arrivals
                </button>
                <button className="text-muted-foreground hover:text-foreground">
                  Best Sellers
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((card) => (
                <ProductCard key={card.product.id} {...card} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <FAQ />

      <Testimonials />
    </div>
  );
}

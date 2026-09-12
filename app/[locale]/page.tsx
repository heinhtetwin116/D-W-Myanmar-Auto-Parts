// import { getMessages, setRequestLocale } from "next-intl/server";
import { Truck, Tag, PhoneCall, ShieldCheck } from "lucide-react";
// import { createClient } from "@/lib/supabase/server";
import ProductCard, { Product } from "@/components/product-card";
import Hero from "@/components/hero";
import FAQ from "@/components/faq";
import Testimonials from "@/components/testimonials";

// --- DUMMY DATA ---
const featuredProducts: Product[] = [
  {
    id: 1,
    code: "EXH-1029",
    name: "Performance Muffler",
    desc: "Stainless steel exhaust system",
    stock: 45,
    price: "$120.00",
  },
  {
    id: 2,
    code: "OIL-5510",
    name: "Synthetic Motor Oil 5W-30",
    desc: "High mileage formula, 5L",
    stock: 120,
    price: "$45.00",
  },
  {
    id: 3,
    code: "ENG-8821",
    name: "Cylinder Block Assembly",
    desc: "V6 engine core component",
    stock: 8,
    price: "$850.00",
  },
  {
    id: 4,
    code: "BRK-3044",
    name: "Ceramic Brake Rotors",
    desc: "Drilled and slotted pair",
    stock: 32,
    price: "$210.00",
  },
  {
    id: 5,
    code: "SUS-1120",
    name: "Front Shock Absorber",
    desc: "Heavy duty off-road",
    stock: 15,
    price: "$95.00",
  },
  {
    id: 6,
    code: "FLT-9902",
    name: "Cabin Air Filter",
    desc: "HEPA filtration system",
    stock: 200,
    price: "$25.00",
  },
  {
    id: 7,
    code: "ELC-4432",
    name: "Alternator 150A",
    desc: "High output replacement",
    stock: 12,
    price: "$180.00",
  },
  {
    id: 8,
    code: "TLS-0012",
    name: "Mechanic Tool Set",
    desc: "250-piece professional kit",
    stock: 5,
    price: "$320.00",
  },
];

const latestProducts: Product[] = [
  {
    id: 9,
    code: "TRN-7712",
    name: "Transmission Solenoid",
    desc: "Automatic shift control",
    stock: 22,
    price: "$110.00",
  },
  {
    id: 10,
    code: "CLN-3321",
    name: "Radiator Coolant",
    desc: "50/50 premixed, 1 Gallon",
    stock: 85,
    price: "$18.00",
  },
  {
    id: 11,
    code: "BRK-8890",
    name: "Brake Caliper",
    desc: "Rear left, powder coated",
    stock: 14,
    price: "$135.00",
  },
  {
    id: 12,
    code: "ENG-2211",
    name: "Timing Belt Kit",
    desc: "Includes tensioner & pulleys",
    stock: 40,
    price: "$160.00",
  },
  {
    id: 13,
    code: "ELC-6654",
    name: "Ignition Coil Pack",
    desc: "Set of 4, high performance",
    stock: 60,
    price: "$88.00",
  },
  {
    id: 14,
    code: "SUS-4431",
    name: "Control Arm",
    desc: "Front lower, with ball joint",
    stock: 18,
    price: "$145.00",
  },
  {
    id: 15,
    code: "FLT-1102",
    name: "Oil Filter",
    desc: "Premium anti-drain back",
    stock: 350,
    price: "$12.00",
  },
  {
    id: 16,
    code: "TLS-9987",
    name: "Digital Multimeter",
    desc: "Auto-ranging True RMS",
    stock: 25,
    price: "$75.00",
  },
];

// interface HomePageProps {
//   params: Promise<{ locale: "my" | "en" }>;
// }

// async function getFeaturedProducts() {
//   const supabase = await createClient();
//   const { data } = await supabase
//     .from("products")
//     .select("*")
//     .eq("is_featured", true)
//     .eq("is_active", true)
//     .limit(8);

//   return data || [];
// }

// async function getLatestProducts() {
//   const supabase = await createClient();
//   const { data } = await supabase
//     .from("products")
//     .select("*")
//     .eq("is_active", true)
//     .order("created_at", { ascending: false })
//     .limit(8);

//   return data || [];
// }

// async function getStats() {
//   const supabase = await createClient();
//   const [{ count: productsCount }, { count: customersCount }] =
//     await Promise.all([
//       supabase
//         .from("products")
//         .select("*", { count: "exact", head: true })
//         .eq("is_active", true),
//       supabase.from("profiles").select("*", { count: "exact", head: true }),
//     ]);

//   return {
//     products: productsCount || 500,
//     customers: customersCount || 10000,
//     years: 20,
//     locations: 50,
//   };
// }

// const features = [
//   {
//     icon: Truck,
//     title: "features.fast_delivery",
//     desc: "features.fast_delivery_desc",
//   },
//   {
//     icon: Headphones,
//     title: "features.support",
//     desc: "features.support_desc",
//   },
//   {
//     icon: RotateCcw,
//     title: "features.easy_returns",
//     desc: "features.easy_returns_desc",
//   },
//   { icon: Tag, title: "features.best_price", desc: "features.best_price_desc" },
// ];

// const productCategories = [
//   { id: "all", label: "categories.all" },
//   { id: "engine", label: "categories.engine" },
//   { id: "brakes", label: "categories.brakes" },
//   { id: "suspension", label: "categories.suspension" },
//   { id: "electrical", label: "categories.electrical" },
//   { id: "filters", label: "categories.filters" },
//   { id: "lighting", label: "categories.lighting" },
//   { id: "body", label: "categories.body" },
//   { id: "fluids", label: "categories.fluids" },
// ];

// const latestCategories = [
//   { id: "new_arrivals", label: "categories.new_arrivals" },
//   { id: "best_sellers", label: "categories.best_sellers" },
// ];

// export default async function HomePage({ params }: HomePageProps) {
export default async function HomePage() {
  // const { locale } = await params;
  // setRequestLocale(locale);
  // const messages = await getMessages({ locale });
  // const heroT = messages.hero;
  // const valuePropsT = messages.valueProps;
  // const featuredT = messages.featuredProducts;
  // const trustT = messages.trustIndicators;
  // const ctaT = messages.cta;
  // const commonT = messages.common;
  // const featuresT = messages.features;
  // const categoriesT = messages.categories;
  // const latestProductsT = messages.latest_products;
  // const valuePropsPageT = messages.value_props;

  // const [featuredProducts, latestProducts, stats] = await Promise.all([
  //   getFeaturedProducts(),
  //   getLatestProducts(),
  //   getStats(),
  // ]);

  // const valueProps = [
  //   {
  //     icon: CheckCircle,
  //     title: valuePropsT.quality.title,
  //     description: valuePropsT.quality.description,
  //   },
  //   {
  //     icon: DollarSign,
  //     title: valuePropsT.price.title,
  //     description: valuePropsT.price.description,
  //   },
  //   {
  //     icon: Shield,
  //     title: valuePropsT.warranty.title,
  //     description: valuePropsT.warranty.description,
  //   },
  //   {
  //     icon: Truck,
  //     title: valuePropsT.delivery.title,
  //     description: valuePropsT.delivery.description,
  //   },
  // ];

  // Transform Supabase products to ProductCard format
  // interface SupabaseProduct {
  //   id: string;
  //   slug: string;
  //   name_my: string;
  //   name_en: string;
  //   description_my: string | null;
  //   description_en: string | null;
  //   specs: Record<string, unknown>;
  //   price: number;
  //   stock_status: "in_stock" | "low_stock" | "out_of_stock";
  //   category_id: string;
  // }

  // const transformProduct = (product: SupabaseProduct) => ({
  //   id: product.id,
  //   code: (product.specs?.part_number as string) || product.id,
  //   name: locale === "my" ? product.name_my : product.name_en,
  //   desc:
  //     (locale === "my" ? product.description_my : product.description_en) || "",
  //   stock:
  //     product.stock_status === "in_stock"
  //       ? 100
  //       : product.stock_status === "low_stock"
  //         ? 10
  //         : 0,
  //   price: `${product.price.toLocaleString()} ${commonT.currency}`,
  // });

  // const featuredProductsTransformed = featuredProducts.map(transformProduct);
  // const latestProductsTransformed = latestProducts.map(transformProduct);

  return (
    <div className="min-h-screen flex flex-col font-manrope">
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Features Bar */}
        <section className="border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="text-[#A81C24]">
                <Truck size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm">
                  Example Feature
                </h4>
                <p className="text-xs text-gray-500">Sentence</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[#A81C24]">
                <PhoneCall size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm">
                  Example Feature
                </h4>
                <p className="text-xs text-gray-500">Sentence</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[#A81C24]">
                <ShieldCheck size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm">
                  Example Feature
                </h4>
                <p className="text-xs text-gray-500">Sentence</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[#A81C24]">
                <Tag size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm">
                  Example Feature
                </h4>
                <p className="text-xs text-gray-500">Sentence</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-gray-200 pb-4 gap-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">
              Featured Products
            </h2>
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <button className="text-[#0F172A] bg-white px-4 py-1.5 rounded shadow-sm border border-gray-200">
                All
              </button>
              <button className="text-gray-500 hover:text-[#0F172A]">
                Engine
              </button>
              <button className="text-gray-500 hover:text-[#0F172A]">
                Brakes
              </button>
              <button className="text-gray-500 hover:text-[#0F172A]">
                Suspension
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Latest Products */}
        <section className="py-16 border-t border-gray-200 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-gray-200 pb-4 gap-4">
              <h2 className="text-2xl font-bold text-[#0F172A]">
                Latest Products
              </h2>
              <div className="flex flex-wrap gap-4 text-sm font-medium">
                <button className="text-[#0F172A] bg-[#F4F6F8] px-4 py-1.5 rounded shadow-sm border border-gray-200">
                  New Arrivals
                </button>
                <button className="text-gray-500 hover:text-[#0F172A]">
                  Best Sellers
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
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

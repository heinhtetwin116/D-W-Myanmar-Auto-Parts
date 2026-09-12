"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Breadcrumb, Select } from "antd";

const categories = [
  { id: "all", label: "All Categories" },
  { id: "engine", label: "Engine" },
  { id: "brakes", label: "Brakes" },
  { id: "suspension", label: "Suspension" },
  { id: "electrical", label: "Electrical" },
  { id: "filters", label: "Filters" },
  { id: "lighting", label: "Lighting" },
  { id: "body", label: "Body / Exterior" },
  { id: "oils", label: "Oils & Fluids" },
  { id: "tools", label: "Tools / Accessories" },
];

// --- DUMMY DATA (matching home page data) ---
const allProducts = [
  {
    id: 1,
    code: "EXH-1029",
    name: "Performance Muffler",
    desc: "Stainless steel exhaust system",
    stock: 45,
    price: "$120.00",
    category: "engine",
  },
  {
    id: 2,
    code: "OIL-5510",
    name: "Synthetic Motor Oil 5W-30",
    desc: "High mileage formula, 5L",
    stock: 120,
    price: "$45.00",
    category: "oils",
  },
  {
    id: 3,
    code: "ENG-8821",
    name: "Cylinder Block Assembly",
    desc: "V6 engine core component",
    stock: 8,
    price: "$850.00",
    category: "engine",
  },
  {
    id: 4,
    code: "BRK-3044",
    name: "Ceramic Brake Rotors",
    desc: "Drilled and slotted pair",
    stock: 32,
    price: "$210.00",
    category: "brakes",
  },
  {
    id: 5,
    code: "SUS-1120",
    name: "Front Shock Absorber",
    desc: "Heavy duty off-road",
    stock: 15,
    price: "$95.00",
    category: "suspension",
  },
  {
    id: 6,
    code: "FLT-9902",
    name: "Cabin Air Filter",
    desc: "HEPA filtration system",
    stock: 200,
    price: "$25.00",
    category: "filters",
  },
  {
    id: 7,
    code: "ELC-4432",
    name: "Alternator 150A",
    desc: "High output replacement",
    stock: 12,
    price: "$180.00",
    category: "electrical",
  },
  {
    id: 8,
    code: "TLS-0012",
    name: "Mechanic Tool Set",
    desc: "250-piece professional kit",
    stock: 5,
    price: "$320.00",
    category: "tools",
  },
  {
    id: 9,
    code: "TRN-7712",
    name: "Transmission Solenoid",
    desc: "Automatic shift control",
    stock: 22,
    price: "$110.00",
    category: "engine",
  },
  {
    id: 10,
    code: "CLN-3321",
    name: "Radiator Coolant",
    desc: "50/50 premixed, 1 Gallon",
    stock: 85,
    price: "$18.00",
    category: "oils",
  },
  {
    id: 11,
    code: "BRK-8890",
    name: "Brake Caliper",
    desc: "Rear left, powder coated",
    stock: 14,
    price: "$135.00",
    category: "brakes",
  },
  {
    id: 12,
    code: "ENG-2211",
    name: "Timing Belt Kit",
    desc: "Includes tensioner & pulleys",
    stock: 40,
    price: "$160.00",
    category: "engine",
  },
  {
    id: 13,
    code: "ELC-6654",
    name: "Ignition Coil Pack",
    desc: "Set of 4, high performance",
    stock: 60,
    price: "$88.00",
    category: "electrical",
  },
  {
    id: 14,
    code: "SUS-4431",
    name: "Control Arm",
    desc: "Front lower, with ball joint",
    stock: 18,
    price: "$145.00",
    category: "suspension",
  },
  {
    id: 15,
    code: "FLT-1102",
    name: "Oil Filter",
    desc: "Premium anti-drain back",
    stock: 350,
    price: "$12.00",
    category: "filters",
  },
  {
    id: 16,
    code: "TLS-9987",
    name: "Digital Multimeter",
    desc: "Auto-ranging True RMS",
    stock: 25,
    price: "$75.00",
    category: "tools",
  },
  // Add more products for pagination demo
  {
    id: 17,
    code: "EXH-2001",
    name: "Exhaust Header",
    desc: "4-1 stainless steel header",
    stock: 7,
    price: "$380.00",
    category: "engine",
  },
  {
    id: 18,
    code: "BRK-4001",
    name: "Brake Master Cylinder",
    desc: "OEM replacement",
    stock: 9,
    price: "$155.00",
    category: "brakes",
  },
  {
    id: 19,
    code: "SUS-2001",
    name: "Coilover Kit",
    desc: "Adjustable height",
    stock: 6,
    price: "$890.00",
    category: "suspension",
  },
  {
    id: 20,
    code: "ELC-7001",
    name: "Starter Motor",
    desc: "High torque 12V",
    stock: 11,
    price: "$245.00",
    category: "electrical",
  },
  {
    id: 21,
    code: "FLT-2001",
    name: "Fuel Filter",
    desc: "High flow diesel",
    stock: 42,
    price: "$35.00",
    category: "filters",
  },
  {
    id: 22,
    code: "LIT-1001",
    name: "LED Headlight Kit",
    desc: "6000K 9005/9006",
    stock: 30,
    price: "$185.00",
    category: "lighting",
  },
  {
    id: 23,
    code: "BDY-1001",
    name: "Front Bumper",
    desc: "Reinforced steel",
    stock: 3,
    price: "$450.00",
    category: "body",
  },
  {
    id: 24,
    code: "OIL-6001",
    name: "Gear Oil 75W-90",
    desc: "GL-5 synthetic, 1L",
    stock: 60,
    price: "$28.00",
    category: "oils",
  },
];

export default function ProductsPage() {
  const [searchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter] = useState("all");
  const [sortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, stockFilter, sortBy]);

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.desc.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" || product.category === selectedCategory;

        const matchesStock =
          stockFilter === "all" ||
          (stockFilter === "in_stock" && product.stock > 10) ||
          (stockFilter === "low_stock" &&
            product.stock > 0 &&
            product.stock <= 10) ||
          (stockFilter === "out_of_stock" && product.stock === 0);

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name);
          case "price_asc":
            return (
              parseFloat(a.price.replace("$", "")) -
              parseFloat(b.price.replace("$", ""))
            );
          case "price_desc":
            return (
              parseFloat(b.price.replace("$", "")) -
              parseFloat(a.price.replace("$", ""))
            );
          case "stock":
            return b.stock - a.stock;
          case "newest":
            return b.id - a.id;
          default:
            return 0;
        }
      });
  }, [searchQuery, selectedCategory, stockFilter, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  const handleSort = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <div>
      <div className="pt-8">
        <Breadcrumb
          items={[
            {
              title: "Users",
            },
            {
              title: ":id",
              href: "",
            },
          ]}
          params={{ id: 1 }}
        />
      </div>

      {/* Page Header */}
      <header className="flex justify-between items-end border-b py-8">
        <div>
          {/* <div className="rounded-lg bg-secondary px-6 py-8 sm:px-10"> */}
          {/* <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          D&W Myanmar Auto Parts
        </p> */}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Product Catalog
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse dependable parts for every repair, service, and build.
          </p>
          {/* </div> */}
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-lg text-foreground">
            {filteredProducts.length}
          </span>{" "}
          products found
        </p>
      </header>

      <main className="py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:h-fit lg:w-56">
            <div className="space-y-8">
              <div>
                <h2 className="pb-2 text-lg text-primary border-b">
                  Filter by categories
                </h2>
                <div className="py-2">
                  {categories.slice(1).map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      aria-pressed={selectedCategory === category.id}
                      className={`flex w-full items-center justify-between border-l-2 py-3 pl-3 text-left text-sm transition-colors ${
                        selectedCategory === category.id
                          ? "border-accent bg-accent/10 font-bold text-accent"
                          : "border-transparent text-foreground hover:border-accent/40 hover:bg-secondary hover:text-accent"
                      }`}
                    >
                      {category.label}
                      {/* <ChevronRight size={17} /> */}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <section className="flex-1 min-w-0">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 pb-5 sm:flex-row sm:items-center">
              {/* Popular categories */}
              <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
                {/* <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap pb-1"> */}
                <span className="shrink-0 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Popular:
                </span>
                {categories.slice(1, 6).map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`shrink-0 rounded-full border border-primary px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-card text-foreground hover:border-accent hover:text-accent"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowUpDown size={17} />
                <Select
                  defaultValue="newest"
                  style={{ width: 120 }}
                  onChange={handleSort}
                  options={[
                    { value: "newest", label: "Newest" },
                    { value: "oldest", label: "Oldest" },
                    { value: "name-asc", label: "Name (A-Z)" },
                    { value: "name-desc", label: "Name (Z-A)", disabled: true },
                  ]}
                />
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav
                    className="mt-8 flex items-center justify-center gap-2"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            page === currentPage
                              ? "bg-accent text-accent-foreground"
                              : "border border-border text-foreground hover:bg-secondary"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="py-16 text-center">
                <Search
                  className="mx-auto mb-4 text-muted-foreground"
                  size={42}
                />
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  No products found
                </h2>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/hero";
import ProductCard, { Product } from "@/components/ProductCard";
import Footer from "@/components/Footer";
import Testimonials from "@/components/testimonials";
import { Truck, PhoneCall, ShieldCheck, Tag } from "lucide-react";

// --- DUMMY DATA ---
const featuredProducts: Product[] = [
  { id: 1, code: "EXH-1029", name: "Performance Muffler", desc: "Stainless steel exhaust system", stock: 45, price: "$120.00" },
  { id: 2, code: "OIL-5510", name: "Synthetic Motor Oil 5W-30", desc: "High mileage formula, 5L", stock: 120, price: "$45.00" },
  { id: 3, code: "ENG-8821", name: "Cylinder Block Assembly", desc: "V6 engine core component", stock: 8, price: "$850.00" },
  { id: 4, code: "BRK-3044", name: "Ceramic Brake Rotors", desc: "Drilled and slotted pair", stock: 32, price: "$210.00" },
  { id: 5, code: "SUS-1120", name: "Front Shock Absorber", desc: "Heavy duty off-road", stock: 15, price: "$95.00" },
  { id: 6, code: "FLT-9902", name: "Cabin Air Filter", desc: "HEPA filtration system", stock: 200, price: "$25.00" },
  { id: 7, code: "ELC-4432", name: "Alternator 150A", desc: "High output replacement", stock: 12, price: "$180.00" },
  { id: 8, code: "TLS-0012", name: "Mechanic Tool Set", desc: "250-piece professional kit", stock: 5, price: "$320.00" },
];

const latestProducts: Product[] = [
  { id: 9, code: "TRN-7712", name: "Transmission Solenoid", desc: "Automatic shift control", stock: 22, price: "$110.00" },
  { id: 10, code: "CLN-3321", name: "Radiator Coolant", desc: "50/50 premixed, 1 Gallon", stock: 85, price: "$18.00" },
  { id: 11, code: "BRK-8890", name: "Brake Caliper", desc: "Rear left, powder coated", stock: 14, price: "$135.00" },
  { id: 12, code: "ENG-2211", name: "Timing Belt Kit", desc: "Includes tensioner & pulleys", stock: 40, price: "$160.00" },
  { id: 13, code: "ELC-6654", name: "Ignition Coil Pack", desc: "Set of 4, high performance", stock: 60, price: "$88.00" },
  { id: 14, code: "SUS-4431", name: "Control Arm", desc: "Front lower, with ball joint", stock: 18, price: "$145.00" },
  { id: 15, code: "FLT-1102", name: "Oil Filter", desc: "Premium anti-drain back", stock: 350, price: "$12.00" },
  { id: 16, code: "TLS-9987", name: "Digital Multimeter", desc: "Auto-ranging True RMS", stock: 25, price: "$75.00" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-coolgray flex flex-col font-manrope">
      
      {/* Header */}
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Features Bar */}
        <section className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="text-[#A81C24]"><Truck size={32} strokeWidth={1.5} /></div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm">Fast Delivery</h4>
                <p className="text-xs text-gray-500">Within 1 - 2 Business Days</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[#A81C24]"><PhoneCall size={32} strokeWidth={1.5} /></div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm">Customer Support</h4>
                <p className="text-xs text-gray-500">+ 95 9 765006774 | + 95 9 455096809</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[#A81C24]"><ShieldCheck size={32} strokeWidth={1.5} /></div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm">Trusted Suppliers</h4>
                <p className="text-xs text-gray-500">100% Genuine Auto Parts</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[#A81C24]"><Tag size={32} strokeWidth={1.5} /></div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm">Established</h4>
                <p className="text-xs text-gray-500">Serving Drivers Since 1997</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-gray-200 pb-4 gap-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">Featured Products</h2>
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <button className="text-[#0F172A] bg-white px-4 py-1.5 rounded shadow-sm border border-gray-200">All</button>
              <button className="text-gray-500 hover:text-[#0F172A]">Engine</button>
              <button className="text-gray-500 hover:text-[#0F172A]">Brakes</button>
              <button className="text-gray-500 hover:text-[#0F172A]">Suspension</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Latest Products */}
        <section className="bg-white py-16 border-t border-gray-200 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-gray-200 pb-4 gap-4">
              <h2 className="text-2xl font-bold text-[#0F172A]">New Arrivals</h2>
              <div className="flex flex-wrap gap-4 text-sm font-medium">
                <button className="text-[#0F172A] bg-[#F4F6F8] px-4 py-1.5 rounded shadow-sm border border-gray-200">New Arrivals</button>
                <button className="text-gray-500 hover:text-[#0F172A]">Best Sellers</button>
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

      <Testimonials />

      {/* Footer */}
      <Footer />
      
    </div>
  );
}
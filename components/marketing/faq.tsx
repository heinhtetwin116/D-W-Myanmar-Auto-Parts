"use client";

import React, { useState } from "react";
import { Plus, HelpCircle } from "lucide-react";
import { faqItems } from "@/data/dummy/faq";

const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-card py-20 border-t border-border">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 flex items-center justify-center gap-2">
            <HelpCircle size={14} /> Support
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Find quick answers to common questions about ordering, shipping, and
            finding the right parts for your vehicle.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-background rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-accent/30 shadow-default bg-card"
                    : "border-transparent hover:border-border"
                }`}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer group"
                >
                  <span
                    className={`font-bold text-sm md:text-base pr-4 transition-colors ${
                      isOpen
                        ? "text-accent"
                        : "text-foreground group-hover:text-accent"
                    }`}
                  >
                    {item.question}
                  </span>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-accent text-accent-foreground rotate-45"
                        : "bg-card text-muted-foreground shadow-default border border-border group-hover:border-accent/30 group-hover:text-accent"
                    }`}
                  >
                    <Plus size={18} />
                  </div>
                </button>

                {/* Answer Content (Animated) */}
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Still have questions?{" "}
            <a href="#" className="font-bold text-accent hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

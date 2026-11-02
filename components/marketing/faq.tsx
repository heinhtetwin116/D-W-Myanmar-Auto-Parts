"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Plus, HelpCircle } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);
  const t = useTranslations("faq");
  const locale = useLocale();

  const faqItems = t.raw("items") as FaqItem[];

  return (
    <section className="bg-card py-20 border-t border-border">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 flex items-center justify-center gap-2">
            <HelpCircle size={14} />
            {t("label")}
          </span>

          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tight">
            {t("title")}
          </h2>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openId === index;

            return (
              <div
                key={index}
                className={`bg-background rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-accent/30 shadow-default bg-card"
                    : "border-transparent hover:border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenId(isOpen ? null : index)
                  }
                  aria-expanded={isOpen}
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

                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "max-h-96 pb-6 opacity-100"
                      : "max-h-0 opacity-0"
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

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {t("contactPrompt")}{" "}
            <a
              href={`/${locale}/contact`}
              className="font-bold text-accent hover:underline"
            >
              {t("contactLink")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PhoneCall, ShieldCheck, MapPin } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const Footer = () => {
  const tFooter = useTranslations("footer");
  const tHeader = useTranslations("header");
  const tCommon = useTranslations("common");
  const tCategories = useTranslations("categories");
  const locale = useLocale() as Locale;

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        {/* TOP SECTION: Brand Info + Link Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand Info (Takes up 1 column on large screens) */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-accent">
              {tFooter("company_name")}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              {tFooter("description")}
            </p>
          </div>

          {/* Link Lists (Takes up 2 columns on large screens, split into 3 sub-columns) */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-primary-foreground">
                {tFooter("quick_links")}
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href={`/${locale}/about`}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {tHeader("about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/contact`}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {tHeader("contacts")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {tHeader("addToCart")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {tCommon("view")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Catalog */}
            <div>
              <h4 className="font-bold mb-4 text-primary-foreground">
                {tHeader("catalog")}
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href={`/${locale}/products?sort=newest`}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {tCategories("new_arrivals")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/products`}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {tCategories("best_sellers")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/products`}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {tHeader("viewAll")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold mb-4 text-primary-foreground">
                {tHeader("categories")}
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href={`/${locale}/products`}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {tCategories("engine")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/products`}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {tCategories("brakes")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/products`}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {tCategories("suspension")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/products`}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {tCategories("fluids")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Contact Information */}
        <div className="pt-8 pb-8 border-t border-primary-foreground/10">
          <h4 className="font-bold mb-6 text-primary-foreground">
            {tFooter("contact_info")}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 text-sm">
            {/* Address */}
            <div className="flex items-start gap-3 min-w-0">
              <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-primary-foreground font-medium mb-1">
                  Address
                </p>
                <span className="text-muted-foreground leading-relaxed">
                  {tFooter("address")}
                </span>
              </div>
            </div>

            {/* Phone numbers */}
            <div className="flex items-start gap-3 min-w-0">
              <PhoneCall
                size={18}
                className="text-accent flex-shrink-0 mt-0.5"
              />
              <div className="min-w-0 space-y-3">
                <div>
                  <p className="text-primary-foreground font-medium mb-1">
                    Viber / Phone
                  </p>
                  <a
                    href="tel:+959765006774"
                    className="text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    09765006774
                  </a>
                </div>
                <div>
                  <p className="text-primary-foreground font-medium mb-1">
                    Phone calls only
                  </p>
                  <a
                    href="tel:+959455096809"
                    className="text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    09455096809
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 min-w-0">
              <ShieldCheck
                size={18}
                className="text-accent flex-shrink-0 mt-0.5"
              />
              <div className="min-w-0">
                <p className="text-primary-foreground font-medium mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${tFooter("email")}`}
                  className="text-muted-foreground hover:text-primary-foreground transition-colors break-words"
                >
                  {tFooter("email")}
                </a>
              </div>
            </div>

            {/* Viber contact button */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7360F2]/15 text-[#a599ff] border border-[#7360F2]/40 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.8 14.5c-.5-.3-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.2-.8 1-.9 1.2-.2.2-.4.2-.7.1-1.6-.8-2.7-1.8-3.5-3.3-.2-.3 0-.5.2-.7.2-.2.4-.4.5-.6.2-.2.2-.4.1-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-1 1-1 2.7 0 4.6 1.4 2.6 3.6 4.8 6.3 5.8 1.9.7 3.3.4 4.1-.5.4-.4.4-.8.4-1.1 0-.3-.4-.5-.9-.7zm-7.8-13C5.4 1.5 0 6.6 0 13c0 2.5.8 4.8 2.2 6.7L1 23.5l4.1-1.3c1.8 1.1 3.9 1.8 6.1 1.8 6.6 0 12-5.1 12-11.5S17.8 1.5 12 1.5zm0 20.8c-1.9 0-3.8-.5-5.3-1.5l-.4-.2-2.7.9.8-2.6-.2-.4c-1.3-1.6-2-3.6-2-5.6 0-5.1 4.4-9.2 9.8-9.2 5.4 0 9.8 4.1 9.8 9.2 0 5.1-4.4 9.4-9.8 9.4z" />
                </svg>
              </div>
              <div>
                <p className="text-primary-foreground font-medium mb-1">
                  Chat on Viber
                </p>
                <a
                  href="viber://chat?number=%2B959765006774"
                  aria-label="Chat on Viber"
                  className="text-muted-foreground hover:text-primary-foreground transition-colors"
                >
                  Message us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-primary-foreground/10 pt-8 text-center text-sm text-muted-foreground">
        {tFooter("copyright")}
      </div>
    </footer>
  );
};

export default Footer;

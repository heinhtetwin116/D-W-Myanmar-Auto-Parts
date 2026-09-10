"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";

interface FooterProps {
  locale: "my" | "en";
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations("common");
  const footerT = useTranslations("footer");

  const socialLinks = [
    { icon: FacebookOutlined, href: "#", label: "Facebook" },
    { icon: TwitterOutlined, href: "#", label: "Twitter" },
    { icon: InstagramOutlined, href: "#", label: "Instagram" },
    { icon: LinkedinOutlined, href: "#", label: "LinkedIn" },
  ];

  const quickLinks = [
    { key: "home", label: footerT("quick_links"), href: `/${locale}/` },
    { key: "about", label: t("about"), href: `/${locale}/about` },
    { key: "products", label: t("products"), href: `/${locale}/products` },
    { key: "contact", label: t("contact"), href: `/${locale}/contact` },
  ];

  return (
    <footer className="bg-muted/50 border-t border-border" role="contentinfo">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <Link
              href={`/${locale}/`}
              className="flex items-center space-x-2 mb-4"
              aria-label="D&W Myanmar Auto Parts"
            >
              <Image
                src="/DW_FullLogo.png"
                alt="D&W Myanmar Auto Parts"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {footerT("description")}
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Quick links">
            <h3 className="font-semibold text-foreground mb-4">
              {footerT("quick_links")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Products">
            <h3 className="font-semibold text-foreground mb-4">
              {t("products")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/products`}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {t("products")} - {t("all_categories")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/products?featured=true`}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {t("featuredProducts.title")}
                </Link>
              </li>
            </ul>
          </nav>

          <address>
            <h3 className="font-semibold text-foreground mb-4">
              {footerT("contact_info")}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground not-italic">
              <li>
                <span className="font-medium text-foreground">
                  {footerT("address").split(",")[0]}
                </span>
                <br />
                {footerT("address").split(",").slice(1).join(", ")}
              </li>
              <li>
                <a
                  href={`tel:${footerT("phone")}`}
                  className="hover:text-accent transition-colors"
                >
                  {footerT("phone")}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${footerT("email")}`}
                  className="hover:text-accent transition-colors"
                >
                  {footerT("email")}
                </a>
              </li>
              <li className="pt-2">{footerT("hours")}</li>
            </ul>
          </address>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            {footerT("copyright")}
          </p>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <Link
              href={`/${locale}/privacy`}
              className="hover:text-accent transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="hover:text-accent transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

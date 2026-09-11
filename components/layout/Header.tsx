"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { MenuOutlined, CloseOutlined, GlobalOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space } from "antd";
import { useTranslations } from "next-intl";

interface HeaderProps {
  locale: "my" | "en";
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations("common");
  const navT = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { key: "home", label: navT("home"), href: `/${locale}/` },
    { key: "about", label: navT("about"), href: `/${locale}/about` },
    { key: "products", label: navT("products"), href: `/${locale}/products` },
    { key: "contact", label: navT("contact"), href: `/${locale}/contact` },
  ];

  const localeMenuItems = [
    { key: "my", label: "မြန်မာ 🇲🇲", locale: "my" as const },
    { key: "en", label: "English 🇺🇸", locale: "en" as const },
  ];

  const handleLocaleChange = (newLocale: "my" | "en") => {
    const newPathname = pathname.replace(`/${locale}/`, `/${newLocale}/`);
    router.push(newPathname);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <Link
            href={`/${locale}/`}
            className="flex items-center space-x-2"
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

          <nav
            className="hidden md:flex items-center space-x-8"
            aria-label="Main navigation"
          >
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  pathname === item.href ||
                  (item.key !== "home" && pathname.startsWith(item.href))
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Dropdown
              menu={{
                items: localeMenuItems.map((item) => ({
                  key: item.key,
                  label: item.label,
                  onClick: () => handleLocaleChange(item.locale),
                })),
              }}
              placement="bottomRight"
            >
              <Button
                type="text"
                className="text-sm font-medium text-foreground hover:text-accent flex items-center gap-1"
              >
                <GlobalOutlined className="text-base" />
                {locale === "my" ? "မြန်မာ" : "English"}
              </Button>
            </Dropdown>

            <Space size="small" className="hidden sm:flex">
              <Link href={`/${locale}/auth/login`}>
                <Button type="text" className="text-sm font-medium">
                  {t("login")}
                </Button>
              </Link>
              <Link href={`/${locale}/auth/signup`}>
                <Button type="primary" className="hex-bloom">
                  {t("signup")}
                </Button>
              </Link>
            </Space>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <Button
              type="text"
              size="small"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuOutlined className="text-xl" />
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-custom py-4 space-y-4">
            <div className="flex items-center justify-between">
              <Button
                type="text"
                size="small"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <CloseOutlined className="text-xl" />
              </Button>
            </div>
            <nav
              className="flex flex-col space-y-2"
              aria-label="Mobile navigation"
            >
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`text-base font-medium px-2 py-2 rounded-md ${
                    pathname === item.href ||
                    (item.key !== "home" && pathname.startsWith(item.href))
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              <Dropdown
                menu={{
                  items: localeMenuItems.map((item) => ({
                    key: item.key,
                    label: item.label,
                    onClick: () => handleLocaleChange(item.locale),
                  })),
                }}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  className="w-full justify-start text-sm font-medium text-foreground"
                >
                  <GlobalOutlined className="mr-2" />
                  {t("language")}: {locale === "my" ? "မြန်မာ" : "English"}
                </Button>
              </Dropdown>
              <Link
                href={`/${locale}/auth/login`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  type="text"
                  className="w-full justify-start text-sm font-medium text-foreground"
                >
                  {t("login")}
                </Button>
              </Link>
              <Link
                href={`/${locale}/auth/signup`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  type="primary"
                  className="w-full justify-start hex-bloom"
                >
                  {t("signup")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

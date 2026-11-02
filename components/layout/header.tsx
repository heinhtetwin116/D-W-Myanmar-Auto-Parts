"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Car,
  Globe,
  Check,
  PhoneCall,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";
import { catalogQueryKey, fetchCatalog } from "@/lib/catalog/client";
import { locales, type Locale } from "@/lib/i18n";
import type { CatalogFilters } from "@/types/index.type";
import { Input } from "antd";
import { useCart } from "@/components/cart/cart-provider";

const LANGUAGES: Record<Locale, { short: string; label: string }> = {
  my: { short: "MY", label: "မြန်မာ" },
  en: { short: "EN", label: "English" },
};

const CATEGORY_FILTERS: CatalogFilters = {
  search: "",
  category: "",
  stock: "",
  sort: "",
  page: 1,
  pageSize: 1,
};

const CLOSE_DELAY_MS = 150;

const Header = () => {
  const t = useTranslations("header");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { itemCount } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: catalogQueryKey(CATEGORY_FILTERS),
    queryFn: () => fetchCatalog(CATEGORY_FILTERS),
    staleTime: 5 * 60 * 1000,
  });
  const categories = (data?.categories ?? []).filter(
    (category) => category.enabled,
  );

  const groupedCategories = useMemo(() => {
    const sorted = [...categories].sort((a, b) =>
      (a.name_en || "").localeCompare(b.name_en || ""),
    );

    return sorted.reduce<Record<string, typeof categories>>((acc, category) => {
      const firstChar = (category.name_en || "").charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(firstChar) ? firstChar : "#";
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(category);
      return acc;
    }, {});
  }, [categories]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target))
        setMenuOpen(false);
      if (langRef.current && !langRef.current.contains(target))
        setLangOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMobileMenuOpen(false);
        setMobileCategoriesOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setLangOpen(false);
        setMobileMenuOpen(false);
        setMobileCategoriesOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
    setMobileCategoriesOpen(false);
    setLangOpen(false);
  }, [pathname]);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setLangOpen(false);
    setMenuOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOpen(false), CLOSE_DELAY_MS);
  };

  const switchLocale = (next: Locale) => {
    setLangOpen(false);
    if (next === locale) return;
    const segments = pathname.split("/");
    if ((locales as readonly string[]).includes(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const query = searchParams.toString();
    router.replace(segments.join("/") + (query ? `?${query}` : ""));
  };

  const categoryLabel = (category: (typeof categories)[number]) =>
    locale === "my" ? category.name_my : category.name_en;

  const languageMenu = (
    <div ref={langRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={langOpen}
        aria-label={t("language")}
        onClick={() => setLangOpen((open) => !open)}
        className="flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
      >
        <Globe size={15} />
        {LANGUAGES[locale].short}
        <ChevronDown
          size={13}
          className={`transition-transform ${langOpen ? "rotate-180" : ""}`}
        />
      </button>
      {langOpen && (
        <ul
          role="listbox"
          aria-label={t("language")}
          className="absolute right-0 top-full z-[70] mt-1 min-w-32 rounded-lg border border-border bg-card py-1 shadow-lg"
        >
          {locales.map((code) => (
            <li key={code} role="option" aria-selected={code === locale}>
              <button
                type="button"
                onClick={() => switchLocale(code)}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-muted ${code === locale ? "font-semibold text-accent" : "text-foreground"}`}
              >
                {LANGUAGES[code].label}
                {code === locale && <Check size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-card shadow-sm">
      {/* Desktop information bar */}
      <div className="hidden text-xs font-medium text-muted-foreground md:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between">
          <div className="flex h-full w-96 shrink-0 items-center gap-6 bg-accent px-3 font-semibold text-accent-foreground">
            <Link
              href={`/${locale}/about`}
              className="transition-opacity hover:opacity-80"
            >
              {t("about")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="transition-opacity hover:opacity-80"
            >
              {t("contacts")}
            </Link>
            <Link
              href={`/${locale}/cart`}
              className="transition-opacity hover:opacity-80"
            >
              {t("addToCart")}
            </Link>
          </div>
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-foreground">
            {t("tagline")}
          </div>
          <a
            href="tel:+959765006774"
            className="flex h-full min-w-64 items-center justify-end gap-2 bg-primary px-4 font-semibold tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            title="Call Us"
          >
            <PhoneCall size={13} className="text-accent" />
            +95 9 765006774
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 md:h-14 md:px-2 md:gap-4">
        {/* Mobile menu toggle */}
        <div className="relative md:hidden" ref={mobileMenuRef}>
          <button
            type="button"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted"
          >
            {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
          {mobileMenuOpen && (
            <nav
              id="mobile-navigation"
              aria-label="Mobile primary"
              className="absolute left-0 top-full z-[60] mt-2 max-h-[calc(100dvh-5rem)] w-[min(88vw,22rem)] overflow-y-auto rounded-xl border border-border bg-card p-3 shadow-xl"
            >
              <div className="grid gap-1 text-sm font-semibold">
                <Link
                  href={`/${locale}`}
                  className="rounded-lg px-3 py-3 hover:bg-muted"
                >
                  {t("home")}
                </Link>
                <Link
                  href={`/${locale}/products`}
                  className="rounded-lg px-3 py-3 hover:bg-muted"
                >
                  {t("catalog")}
                </Link>
                <button
                  type="button"
                  aria-expanded={mobileCategoriesOpen}
                  onClick={() => setMobileCategoriesOpen((open) => !open)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left hover:bg-muted"
                >
                  {t("categories")}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${mobileCategoriesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileCategoriesOpen && (
                  <div className="ml-3 max-h-64 space-y-1 overflow-y-auto border-l border-border pl-3">
                    {isLoading ? (
                      <p className="px-3 py-2 text-muted-foreground">
                        Loading categories…
                      </p>
                    ) : isError ? (
                      <p className="px-3 py-2 text-critical">
                        {t("loadError")}
                      </p>
                    ) : categories.length === 0 ? (
                      <p className="px-3 py-2 text-muted-foreground">
                        {t("empty")}
                      </p>
                    ) : (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/${locale}/products?category=${encodeURIComponent(category.id)}`}
                          className="block rounded-md px-3 py-2 font-normal text-muted-foreground hover:bg-muted hover:text-accent"
                        >
                          {categoryLabel(category)}
                        </Link>
                      ))
                    )}
                  </div>
                )}
                <Link
                  href={`/${locale}/about`}
                  className="rounded-lg px-3 py-3 hover:bg-muted"
                >
                  {t("about")}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="rounded-lg px-3 py-3 hover:bg-muted"
                >
                  {t("contacts")}
                </Link>
                <Link
                  href={`/${locale}/cart`}
                  className="rounded-lg px-3 py-3 hover:bg-muted"
                >
                  {t("addToCart")} ({itemCount})
                </Link>
              </div>
              <a
                href="tel:+959765006774"
                className="mt-3 flex items-center gap-2 border-t border-border px-3 pt-3 text-sm font-semibold text-foreground"
              >
                <PhoneCall size={15} /> +95 9 765006774
              </a>
            </nav>
          )}
        </div>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center gap-6 text-sm font-semibold text-foreground md:flex"
        >
          <Link
            href={`/${locale}`}
            className="py-1 transition-colors hover:text-accent"
          >
            {t("home")}
          </Link>
          <Link
            href={`/${locale}/products`}
            className="py-1 transition-colors hover:text-accent"
          >
            {t("catalog")}
          </Link>
          <div
            ref={menuRef}
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
            className="relative"
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-controls="categories-mega-menu"
              onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
              className={`flex items-center gap-1 py-1 transition-colors ${menuOpen ? "text-accent" : "hover:text-accent"}`}
            >
              {t("categories")}
              <ChevronDown
                size={15}
                className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>
            {menuOpen && (
              <div
                id="categories-mega-menu"
                className="absolute left-0 top-full z-40 w-[min(90vw,70rem)] pt-3"
              >
                <div className="rounded-b-xl border border-border bg-card px-6 py-5 shadow-xl">
                  <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("shopByCategory")}
                      {categories.length > 0 && (
                        <span className="ml-2 text-foreground">
                          {categories.length}
                        </span>
                      )}
                    </span>
                    <Link
                      href={`/${locale}/products`}
                      className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                    >
                      {t("viewAll")} <ChevronRight size={14} />
                    </Link>
                  </div>
                  <div className="max-h-[40vh] overflow-y-auto pr-1">
                    {isLoading ? (
                      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                          <div
                            key={index}
                            className="h-12 animate-pulse rounded-lg bg-background"
                          />
                        ))}
                      </div>
                    ) : isError ? (
                      <p className="py-6 text-sm text-critical">
                        {t("loadError")}
                      </p>
                    ) : categories.length === 0 ? (
                      <p className="py-6 text-sm text-muted-foreground">
                        {t("empty")}
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 items-start gap-6 lg:grid-cols-4">
                        {Object.keys(groupedCategories)
                          .sort()
                          .map((letter) => (
                            <div key={letter} className="flex flex-col">
                              <div className="mb-2 border-b border-border/70 pb-1 text-xs font-extrabold text-accent">
                                {letter}
                              </div>
                              <ul className="space-y-1.5">
                                {groupedCategories[letter].map((category) => (
                                  <li key={category.id}>
                                    <Link
                                      href={`/${locale}/products?category=${encodeURIComponent(category.id)}`}
                                      className="block truncate text-sm text-muted-foreground transition-colors hover:text-accent"
                                    >
                                      {categoryLabel(category)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Responsive logo */}
        <div className="relative z-30 flex shrink-0 items-center justify-center">
          <Link
            href={`/${locale}`}
            aria-label={t("homeLabel")}
            className="relative block h-14 w-28 md:-my-6 md:h-28 md:w-36"
          >
            <Image
              src="/DW_FullLogo.png"
              alt={t("logoAlt")}
              fill
              priority
              sizes="(max-width: 768px) 112px, 144px"
              className="object-contain drop-shadow-md"
            />
          </Link>
        </div>

        {/* Cart, search shortcut and language */}
        <div className="flex flex-1 items-center justify-end gap-1 md:gap-3">
          <Link
            href={`/${locale}/cart`}
            aria-label={`${t("addToCart")}, ${itemCount} items`}
            className="relative flex h-10 min-w-10 items-center justify-center gap-1 rounded-md px-2 text-foreground hover:bg-muted"
          >
            <ShoppingCart size={20} />
            <span className="text-xs font-semibold">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          </Link>
          {languageMenu}
        </div>
      </div>

      {/* Desktop search bar */}
      <div className="absolute -bottom-10 left-1/2 z-20 hidden -translate-x-1/2 md:block">
        <div
          className="flex w-[600px] items-center justify-center border-b border-border bg-card px-8 py-1.5 shadow-md"
          style={{ clipPath: "polygon(4% 100%, 96% 100%, 100% 0, 0 0)" }}
        >
          <div className="relative flex w-full max-w-full items-center gap-2">
            <Car className="mr-2 shrink-0 text-muted-foreground" />
            <Input
              type="text"
              aria-label={t("search")}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent py-0.5 pr-6 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
            <Search
              size={14}
              className="absolute right-3 cursor-pointer text-muted-foreground transition-colors hover:text-accent"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

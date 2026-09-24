"use client";

import { useEffect, useRef, useState } from "react";
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
  User,
  Globe,
  Check,
} from "lucide-react";
import { catalogQueryKey, fetchCatalog } from "@/lib/catalog/client";
import { locales, type Locale } from "@/lib/i18n";
import type { CatalogFilters } from "@/types/index.type";
import { Input } from "antd";

const LANGUAGES: Record<Locale, { short: string; label: string }> = {
  my: { short: "MY", label: "မြန်မာ" },
  en: { short: "EN", label: "English" },
};

// Only the `categories` list is used; pageSize 1 keeps the payload small.
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: catalogQueryKey(CATEGORY_FILTERS),
    queryFn: () => fetchCatalog(CATEGORY_FILTERS),
    staleTime: 5 * 60 * 1000,
  });
  const categories = (data?.categories ?? []).filter((c) => c.enabled);

  // Close popovers on outside click / Escape.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target))
        setMenuOpen(false);
      if (langRef.current && !langRef.current.contains(target))
        setLangOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setLangOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Close the mega menu after navigating.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const openMenu = () => {
    clearTimeout(closeTimer.current);
    setLangOpen(false);
    setMenuOpen(true);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOpen(false), CLOSE_DELAY_MS);
  };

  const switchLocale = (next: Locale) => {
    setLangOpen(false);
    if (next === locale) return;
    // Swap only the leading locale segment, keep path + query.
    const segments = pathname.split("/");
    if ((locales as readonly string[]).includes(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const query = searchParams.toString();
    router.replace(segments.join("/") + (query ? `?${query}` : ""));
  };

  return (
    <header className="w-full bg-card sticky top-0 z-50">
      {/* TOP BAR */}
      <div className="text-xs font-medium text-muted-foreground hidden md:block max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-8 relative">
          {/* Left banner */}
          <div className="bg-accent text-accent-foreground flex items-center justify-start px-2 gap-6 w-96 shrink-0 h-full font-semibold relative before:absolute before:right-[-20px] before:top-0 before:border-l-[20px] before:border-l-accent before:border-b-[32px] before:border-b-transparent">
            <Link
              href={`/${locale}/about`}
              className="hover:text-accent-foreground/80 transition-colors"
            >
              {t("about")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="hover:text-accent-foreground/80 transition-colors"
            >
              {t("contacts")}
            </Link>
            <Link
              href="#"
              className="hover:text-accent-foreground/80 transition-colors"
            >
              {t("howToOrder")}
            </Link>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 text-foreground tracking-wider uppercase text-[10px] font-bold whitespace-nowrap">
            {t("tagline")}
          </div>

          {/* Right banner */}
          <div className="bg-primary text-primary-foreground flex items-center justify-end px-2 gap-4 w-96 shrink-0 h-full relative before:absolute before:left-[-20px] before:top-0 before:border-r-[20px] before:border-r-primary before:border-b-[32px] before:border-b-transparent">
            {/* Language switcher */}
            <div ref={langRef} className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label={t("language")}
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1.5 h-full font-semibold text-primary-foreground hover:text-primary-foreground/80 transition-colors cursor-pointer"
              >
                <Globe size={13} />
                {LANGUAGES[locale].short}
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                />
              </button>
              {langOpen && (
                <ul
                  role="listbox"
                  aria-label={t("language")}
                  className="absolute right-0 top-full mt-0 bg-card border border-border rounded-lg shadow-hover py-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                >
                  {locales.map((code) => (
                    <li
                      key={code}
                      role="option"
                      aria-selected={code === locale}
                    >
                      <button
                        type="button"
                        onClick={() => switchLocale(code)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-background ${code === locale ? "text-accent font-semibold" : "text-foreground"}`}
                      >
                        {LANGUAGES[code].label}
                        {code === locale && <Check size={14} />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 md:px-2 h-14 flex items-center justify-between gap-4 font-medium">
        {/* Left navigation */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-6 text-sm font-semibold text-foreground flex-1"
        >
          <Link
            href={`/${locale}`}
            className="relative py-1 hover:text-accent transition-colors"
          >
            {t("home")}
          </Link>
          <Link
            href={`/${locale}/products`}
            className="relative py-1 hover:text-accent transition-colors"
          >
            {t("catalog")}
          </Link>

          {/* Categories mega menu */}
          <div
            ref={menuRef}
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-controls="categories-mega-menu"
              onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
              className={`flex items-center gap-1 py-1 cursor-pointer transition-colors ${menuOpen ? "text-accent" : "hover:text-accent"}`}
            >
              {t("categories")}
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div
                id="categories-mega-menu"
                className="absolute left-0 right-0 top-full animate-in fade-in slide-in-from-top-2 duration-200 z-40"
              >
                <div className="max-w-7xl mx-auto px-6 py-5 bg-card shadow ">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("shopByCategory")}
                      {categories.length > 0 && (
                        <span className="ml-2 font-semibold text-foreground">
                          {categories.length}
                        </span>
                      )}
                    </span>
                    <Link
                      href={`/${locale}/products`}
                      className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                    >
                      {t("viewAll")}
                      <ChevronRight size={14} />
                    </Link>
                  </div>

                  <div className="max-h-[40vh] overflow-y-auto pr-1">
                    {isLoading ? (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-12 rounded-lg bg-background animate-pulse"
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
                      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-1">
                        {categories.map((cat) => {
                          return (
                            <li key={cat.id}>
                              <Link
                                href={`/${locale}/products?category=${encodeURIComponent(cat.id)}`}
                                className="flex items-center gap-3 px-3 text-sm text-muted-foreground hover:text-accent transition-colors"
                              >
                                <span className="font-medium truncate">
                                  {locale === "my" ? cat.name_my : cat.name_en}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="#"
            className="relative py-1 hover:text-accent transition-colors"
          >
            {t("blogs")}
          </Link>
        </nav>

        {/* Logo */}
        <div className="flex-shrink-0 flex items-center justify-center relative z-30">
          <Link
            href={`/${locale}`}
            aria-label={t("homeLabel")}
            className="relative group"
          >
            <div className="relative w-36 h-28 -my-6 flex items-center justify-center">
              <Image
                src="/DW_FullLogo.png"
                alt={t("logoAlt")}
                fill
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center justify-end gap-3 md:gap-5 flex-1">
          <Link
            href={`/${locale}/auth/login`}
            className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors"
          >
            <User size={18} />
            <span className="hidden sm:inline">{t("myAccount")}</span>
          </Link>
        </div>
      </div>

      {/* Angled search tab */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 z-20 hidden md:block">
        <div
          className="bg-card px-8 py-1.5 shadow-default flex items-center justify-center border-b border-border"
          style={{
            clipPath: "polygon(4% 100%, 96% 100%, 100% 0, 0 0)",
            width: "600px",
          }}
        >
          <div className="relative w-full max-w-full flex items-center gap-2">
            <Car className="text-muted-foreground mr-2 flex-shrink-0" />
            <Input
              type="text"
              aria-label={t("search")}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent py-0.5 pr-6 focus:outline-none focus:border-accent transition-colors text-foreground placeholder:text-muted-foreground"
            />
            <Search
              size={14}
              className="absolute right-3 text-muted-foreground cursor-pointer hover:text-accent transition-colors"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

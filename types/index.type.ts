/**
 * Central shared types for D&W Myanmar Auto Parts.
 *
 * Single import path for every reusable custom type:
 * `import type { ... } from "@/types/index.type"`.
 *
 * Type-only module — no runtime exports, so it is safe to import from
 * Server Components, Client Components, and Route Handlers alike.
 * Runtime helpers stay next to the code that uses them
 * (`lib/catalog/*`, `lib/erpnext/*`).
 */

export type { Locale } from "@/lib/i18n";

import type { Locale } from "@/lib/i18n";
import type { ReactNode } from "react";

// ── ERPNext / Supabase domain ─────────────────────────────────────

/**
 * A category from ERPNext Item Group.
 * Stored in Supabase `categories` table.
 */
export interface Category {
  id: string; // Supabase UUID primary key
  erpnext_id: string; // ERPNext Item Group name (unique, immutable)
  name_en: string;
  name_my: string;
  description_en: string | null;
  description_my: string | null;
  enabled: boolean;
  image_url: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  synced_at: string | null; // Last successful sync timestamp
}

/**
 * A product from ERPNext Item.
 * Stored in Supabase `products` table.
 */
export interface Product {
  id: string; // Supabase UUID primary key
  erpnext_id: string; // ERPNext Item name (unique, immutable)
  category_id: string; // Foreign key to categories.id
  sku: string;
  name_en: string;
  name_my: string;
  description_en: string | null;
  description_my: string | null;
  specifications: Record<string, unknown> | null; // JSON specs
  price_mmk: number; // Numeric MMK price (no currency symbol)
  stock_quantity: number; // Actual available stock
  enabled: boolean;
  image_url: string | null; // URL to ERPNext Item.image
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  synced_at: string | null; // Last successful sync timestamp
}

/**
 * A sync run record.
 * Stored in Supabase `sync_runs` table.
 * Tracks each manual sync attempt and its result.
 */
export interface SyncRun {
  id: string; // Supabase UUID primary key
  started_at: string; // ISO timestamp when sync began
  completed_at: string | null; // ISO timestamp when sync ended (null if in progress)
  status: "in_progress" | "success" | "error"; // Final result status
  categories_imported: number; // Count of categories upserted
  products_imported: number; // Count of products upserted
  error_message: string | null; // Error details if status is error
  created_at: string; // ISO timestamp record creation
}

/**
 * Raw ERPNext Item Group DocType (for reference).
 * Not all fields are stored in Supabase; only mapped fields are persisted.
 */
export interface ERPNextItemGroup {
  name: string;
  item_group_name: string;
  parent_item_group?: string;
  description?: string;
  image?: string;
  is_group?: 0 | 1;
  disabled?: 0 | 1; // 1 = disabled (inverse of our `enabled`)
  custom_name_my?: string;
  custom_description_my?: string;
  // ... other ERPNext fields
}

/**
 * Raw ERPNext Item DocType (for reference).
 * Not all fields are stored in Supabase; only mapped fields are persisted.
 */
export interface ERPNextItem {
  name: string; // Item code/ID
  item_name: string; // Item name (English)
  item_group: string; // Link to Item Group (name)
  description?: string;
  image?: string;
  disabled?: 0 | 1; // 1 = disabled
  standard_rate?: number; // Price (if available in this field)
  custom_name_my?: string;
  custom_description_my?: string;
  custom_price_mmk?: number;
  // ... other ERPNext fields
}

export interface ERPNextClientOptions {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
}

export interface ERPNextListParams {
  fields?: string[];
  filters?: Array<[string, string, string | number | boolean]>;
  orderBy?: string;
  limitStart?: number;
  limitPageLength?: number;
}

export interface ERPNextDocType {
  name: string;
  [key: string]: unknown;
}

export interface SyncOptions {
  pageSize?: number; // Number of items to fetch per paginated request
}

export interface SyncResult {
  syncRunId: string;
  status: "success" | "error";
  categoriesImported: number;
  productsImported: number;
  error?: string;
  durationMs: number;
}

// ── Catalog ───────────────────────────────────────────────────────

/**
 * Stock availability buckets used by catalog filters and status badges.
 * Thresholds live in `LOW_STOCK_THRESHOLD` (`lib/constants.ts`).
 */
export type StockFilter = "in_stock" | "low_stock" | "out_of_stock";

export type StockBadgeTone = "success" | "warning" | "critical";

/**
 * Sort orders supported by the catalog.
 */
export type ProductSort = "name" | "price_asc" | "price_desc" | "newest";

export interface DummyQuery {
  categoryId?: string;
  search?: string;
  stock?: StockFilter;
  sort?: ProductSort;
}

export interface CatalogSearchParams {
  categoryId?: string;
  search?: string;
  stock?: StockFilter;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

export interface CatalogResult {
  source: "db" | "dummy";
  products: Product[];
  total: number;
  categories: Category[];
  page: number;
  pageSize: number;
}

export interface ProductDetailResult {
  source: "db" | "dummy";
  product: Product;
  category: Category | null;
  related: Product[];
}

/** Response shape of `GET /api/products`. */
export type CatalogResponse = CatalogResult;

export interface CatalogFilters {
  search: string;
  category: string;
  stock: string;
  sort: string;
  page: number;
  pageSize: number;
}

/**
 * Display DTO for `ProductCard`. Distinct from the Supabase `Product` row
 * above — never alias this as `Product`.
 */
export interface ProductCardItem {
  id: number | string;
  code: string;
  name: string;
  desc: string;
  stock: number;
  price: string;
}

export interface ProductBadge {
  text: string;
  tone: "success" | "warning" | "critical";
}

export interface CatalogLabels {
  searchPlaceholder: string;
  allCategories: string;
  allStatus: string;
  inStock: string;
  lowStock: string;
  outOfStock: string;
  currency: string;
  viewDetails: string;
  addToEnquiry: string;
  noResults: string;
  filterByCategories: string;
  stockStatus: string;
  popular: string;
  productsFound: string;
  sortName: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortNewest: string;
}

export interface DetailLabels {
  enquire: string;
  backToCatalog: string;
  specs: string;
  relatedProducts: string;
  currency: string;
  inStock: string;
  lowStock: string;
  outOfStock: string;
}

// ── Component props ───────────────────────────────────────────────

export interface ProductCardProps {
  product: ProductCardItem;
  badge?: ProductBadge;
  detailsHref?: string;
  detailsLabel?: string;
}

export interface ProductCatalogProps {
  locale: string;
  labels: CatalogLabels;
  pageSize: number;
  title: string;
  subtitle: string;
  homeLabel: string;
  productsLabel: string;
}

export interface ProductDetailProps {
  locale: string;
  product: Product;
  categoryName: string;
  related: Product[];
  labels: DetailLabels;
  homeLabel: string;
  productsLabel: string;
  currentLabel: string;
}

export interface BreadcrumbTrailItem {
  label: string;
  href?: string;
}

export interface ProductsBreadcrumbProps {
  locale: string;
  homeLabel: string;
  trail: BreadcrumbTrailItem[];
}

export interface ProductGridSkeletonProps {
  count?: number;
}

export interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export interface NewEnquiry {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactFormLabels {
  name: string;
  email: string;
  phone: string;
  message: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
}

export interface ContactInfoLabels {
  title: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export interface ContactFormProps {
  labels: ContactFormLabels;
}

export interface ContactInfoProps {
  labels: ContactInfoLabels;
}

export interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export interface SignUpFormProps {
  locale: "my" | "en";
}

export interface LoginFormProps {
  locale: "my" | "en";
}

export interface ForgotPasswordFormProps {
  locale: "my" | "en";
  className?: string;
}

export interface UpdatePasswordFormProps {
  locale: "my" | "en";
  className?: string;
}

// ── Page props ────────────────────────────────────────────────────

export interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export interface SignUpPageProps {
  params: Promise<{ locale: "my" | "en" }>;
}

export interface LoginPageProps {
  params: Promise<{ locale: "my" | "en" }>;
}

export interface ForgotPasswordPageProps {
  params: Promise<{ locale: "my" | "en" }>;
}

export interface UpdatePasswordPageProps {
  params: Promise<{ locale: "my" | "en" }>;
}

export interface AuthErrorPageProps {
  params: Promise<{ locale: "my" | "en" }>;
  searchParams: Promise<{ error?: string }>;
}

export interface ErrorMessages {
  title: string;
  code_error: string;
  unspecified: string;
}

// ── Dummy content ─────────────────────────────────────────────────

/** Bilingual display string keyed by locale. */
export type LocalizedText = Record<Locale, string>;

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  initials: string;
  color: string;
}

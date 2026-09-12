/**
 * Typed queries for the catalog in Supabase.
 * These functions abstract raw Supabase calls and provide type-safe access.
 * Use these instead of scattering .from("...").select(...) through components.
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { Category, Product } from "./types";

/**
 * Get all enabled categories, ordered by name (English).
 */
export async function getCategories(
  supabase: SupabaseClient,
): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("enabled", true)
    .order("name_en", { ascending: true });

  if (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }

  return data || [];
}

/**
 * Get a single category by ID.
 */
export async function getCategoryById(
  supabase: SupabaseClient,
  id: string,
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .eq("enabled", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("Failed to fetch category:", error);
    throw error;
  }

  return data;
}

/**
 * Stock availability buckets used by catalog filters.
 * Thresholds mirror the status badges in `components/product-catalog.tsx`.
 */
export type StockFilter = "in_stock" | "low_stock" | "out_of_stock";

function applyStockFilter<
  T extends {
    eq: (c: string, v: unknown) => T;
    gte: (c: string, v: unknown) => T;
    lte: (c: string, v: unknown) => T;
  },
>(query: T, stock: StockFilter): T {
  if (stock === "in_stock") {
    return query.gte("stock_quantity", 11);
  }
  if (stock === "low_stock") {
    return query.gte("stock_quantity", 1).lte("stock_quantity", 10);
  }
  return query.eq("stock_quantity", 0);
}

/**
 * Get all enabled products with optional filtering and pagination.
 */
export async function getProducts(
  supabase: SupabaseClient,
  options: {
    categoryId?: string;
    search?: string;
    stock?: StockFilter;
    limit?: number;
    offset?: number;
  } = {},
): Promise<Product[]> {
  let query = supabase.from("products").select("*").eq("enabled", true);

  if (options.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }

  if (options.stock) {
    query = applyStockFilter(query, options.stock);
  }

  if (options.search) {
    // Search by name or SKU (case-insensitive)
    query = query.or(
      `name_en.ilike.%${options.search}%,name_my.ilike.%${options.search}%,sku.ilike.%${options.search}%`,
    );
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 20) - 1,
    );
  }

  const { data, error } = await query.order("name_en", { ascending: true });

  if (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }

  return data || [];
}

/**
 * Get a single product by ID.
 */
export async function getProductById(
  supabase: SupabaseClient,
  id: string,
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("enabled", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("Failed to fetch product:", error);
    throw error;
  }

  return data;
}

/**
 * Get products by category ID with pagination.
 */
export async function getProductsByCategory(
  supabase: SupabaseClient,
  categoryId: string,
  options: { limit?: number; offset?: number } = {},
): Promise<Product[]> {
  return getProducts(supabase, { categoryId, ...options });
}

/**
 * Count enabled products (total and by category/search/stock).
 */
export async function getProductCount(
  supabase: SupabaseClient,
  options: {
    categoryId?: string;
    search?: string;
    stock?: StockFilter;
  } = {},
): Promise<number> {
  let query = supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("enabled", true);

  if (options.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }

  if (options.stock) {
    query = applyStockFilter(query, options.stock);
  }

  if (options.search) {
    query = query.or(
      `name_en.ilike.%${options.search}%,name_my.ilike.%${options.search}%,sku.ilike.%${options.search}%`,
    );
  }

  const { count, error } = await query;

  if (error) {
    console.error("Failed to count products:", error);
    throw error;
  }

  return count || 0;
}

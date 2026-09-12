/**
 * Manual ERPNext-to-Supabase catalog sync.
 * Server-only; never expose this to Client Components.
 * This is the first integration milestone: manually triggered sync with idempotent upserts.
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { ERPNextClient } from "./client";
import { Category, Product, ERPNextItemGroup, ERPNextItem } from "./types";

interface SyncOptions {
  pageSize?: number; // Number of items to fetch per paginated request
}

interface SyncResult {
  syncRunId: string;
  status: "success" | "error";
  categoriesImported: number;
  productsImported: number;
  error?: string;
  durationMs: number;
}

/**
 * Manual sync: fetch enabled Item Groups and Items from ERPNext,
 * upsert into Supabase, and record the result.
 * If sync fails, the previous snapshot in Supabase remains available.
 */
export async function syncCatalogFromERPNext(
  erpnext: ERPNextClient,
  supabase: SupabaseClient,
  options: SyncOptions = {},
): Promise<SyncResult> {
  const pageSize = options.pageSize || 50;
  const startTime = Date.now();
  let categoriesImported = 0;
  let productsImported = 0;
  let error: string | null = null;
  let syncRunId: string = "";

  try {
    // 1. Create a new sync run record to track this attempt
    const syncRun = await createSyncRun(supabase);
    syncRunId = syncRun.id;

    // 2. Sync categories (Item Groups)
    try {
      categoriesImported = await syncCategories(erpnext, supabase, pageSize);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Unknown error syncing categories";
      throw new Error(`Failed to sync categories: ${msg}`);
    }

    // 3. Sync products (Items)
    try {
      productsImported = await syncProducts(erpnext, supabase, pageSize);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Unknown error syncing products";
      throw new Error(`Failed to sync products: ${msg}`);
    }

    // 4. Mark sync run as successful
    await updateSyncRun(supabase, syncRunId, {
      status: "success",
      categoriesImported,
      productsImported,
    });

    const durationMs = Date.now() - startTime;
    return {
      syncRunId,
      status: "success",
      categoriesImported,
      productsImported,
      durationMs,
    };
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error during sync";
    console.error("[Sync Error]", error);

    // Record failed sync run; do not update categories/products if sync failed
    if (syncRunId) {
      await updateSyncRun(supabase, syncRunId, {
        status: "error",
        error_message: error,
        categoriesImported,
        productsImported,
      });
    }

    const durationMs = Date.now() - startTime;
    return {
      syncRunId,
      status: "error",
      categoriesImported,
      productsImported,
      error,
      durationMs,
    };
  }
}

/**
 * Create a new in-progress sync run record.
 */
async function createSyncRun(
  supabase: SupabaseClient,
): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from("sync_runs")
    .insert({
      started_at: new Date().toISOString(),
      status: "in_progress",
      categories_imported: 0,
      products_imported: 0,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create sync run: ${error.message}`);
  }

  return data;
}

/**
 * Update a sync run with final status and counts.
 */
async function updateSyncRun(
  supabase: SupabaseClient,
  syncRunId: string,
  updates: {
    status: "success" | "error";
    categoriesImported?: number;
    productsImported?: number;
    error_message?: string;
  },
): Promise<void> {
  const { error } = await supabase
    .from("sync_runs")
    .update({
      status: updates.status,
      completed_at: new Date().toISOString(),
      categories_imported: updates.categoriesImported ?? 0,
      products_imported: updates.productsImported ?? 0,
      error_message: updates.error_message ?? null,
    })
    .eq("id", syncRunId);

  if (error) {
    console.error("Failed to update sync run:", error);
    // Non-fatal; don't throw
  }
}

/**
 * Fetch all enabled Item Groups from ERPNext and upsert into categories table.
 * Returns the count of categories imported.
 * TODO: Confirm the exact ERPNext custom field names (e.g., custom_name_my, custom_description_my).
 */
async function syncCategories(
  erpnext: ERPNextClient,
  supabase: SupabaseClient,
  pageSize: number,
): Promise<number> {
  const allGroups: ERPNextItemGroup[] = [];
  let offset = 0;

  // Fetch all enabled Item Groups with pagination
  // TODO: Verify filters and field names against target ERPNext instance
  while (true) {
    const groups = await erpnext.listDocuments<ERPNextItemGroup>("Item Group", {
      fields: [
        "name",
        "item_group_name",
        "description",
        "image",
        "disabled",
        "custom_name_my",
        "custom_description_my",
      ],
      filters: [["disabled", "=", 0]], // Only enabled groups
      limitStart: offset,
      limitPageLength: pageSize,
    });

    if (groups.length === 0) {
      break;
    }

    allGroups.push(...groups);
    offset += pageSize;
  }

  // Transform and upsert into Supabase
  const categories: Omit<Category, "id" | "created_at" | "updated_at">[] =
    allGroups.map((group) => ({
      erpnext_id: group.name,
      name_en: group.item_group_name || "",
      name_my: (group.custom_name_my as string) || group.item_group_name || "",
      description_en: (group.description as string) || null,
      description_my: (group.custom_description_my as string) || null,
      enabled: group.disabled === 0,
      image_url: (group.image as string) || null,
      synced_at: new Date().toISOString(),
    }));

  if (categories.length === 0) {
    return 0;
  }

  // Upsert by erpnext_id (on conflict, update)
  const { error } = await supabase.from("categories").upsert(categories, {
    onConflict: "erpnext_id",
  });

  if (error) {
    throw new Error(`Failed to upsert categories: ${error.message}`);
  }

  return categories.length;
}

/**
 * Fetch all enabled Items from ERPNext and upsert into products table.
 * Returns the count of products imported.
 * TODO: Confirm the exact ERPNext custom field names and warehouse/stock source.
 */
async function syncProducts(
  erpnext: ERPNextClient,
  supabase: SupabaseClient,
  pageSize: number,
): Promise<number> {
  const allItems: ERPNextItem[] = [];
  let offset = 0;

  // Fetch all enabled Items with pagination
  // TODO: Verify filters, field names, and stock source against target ERPNext instance
  while (true) {
    const items = await erpnext.listDocuments<ERPNextItem>("Item", {
      fields: [
        "name",
        "item_name",
        "item_group",
        "description",
        "image",
        "disabled",
        "custom_name_my",
        "custom_description_my",
        "custom_price_mmk",
        // Stock field depends on ERPNext config; may need adjustment
      ],
      filters: [["disabled", "=", 0]], // Only enabled items
      limitStart: offset,
      limitPageLength: pageSize,
    });

    if (items.length === 0) {
      break;
    }

    allItems.push(...items);
    offset += pageSize;
  }

  // Get category map (erpnext_id -> Supabase id)
  const categoryMap = await getCategoryMap(supabase);

  // Transform and upsert into Supabase
  const products: Omit<Product, "id" | "created_at" | "updated_at">[] = [];

  for (const item of allItems) {
    const categoryId = categoryMap.get(item.item_group as string);
    if (!categoryId) {
      console.warn(
        `Item ${item.name} references unknown category ${item.item_group}, skipping`,
      );
      continue;
    }

    products.push({
      erpnext_id: item.name,
      category_id: categoryId,
      sku: item.name,
      name_en: item.item_name || "",
      name_my: (item.custom_name_my as string) || item.item_name || "",
      description_en: (item.description as string) || null,
      description_my: (item.custom_description_my as string) || null,
      specifications: null, // Extend later if needed
      price_mmk: (item.custom_price_mmk as number) || 0,
      stock_quantity: 0, // TODO: Fetch actual stock from ERPNext warehouse
      enabled: item.disabled === 0,
      image_url: (item.image as string) || null,
      synced_at: new Date().toISOString(),
    });
  }

  if (products.length === 0) {
    return 0;
  }

  // Upsert by erpnext_id
  const { error } = await supabase.from("products").upsert(products, {
    onConflict: "erpnext_id",
  });

  if (error) {
    throw new Error(`Failed to upsert products: ${error.message}`);
  }

  return products.length;
}

/**
 * Build a map of ERPNext Item Group names to Supabase category IDs.
 */
async function getCategoryMap(
  supabase: SupabaseClient,
): Promise<Map<string, string>> {
  const { data, error } = await supabase
    .from("categories")
    .select("erpnext_id, id");

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  const map = new Map<string, string>();
  for (const row of data || []) {
    map.set(row.erpnext_id, row.id);
  }

  return map;
}

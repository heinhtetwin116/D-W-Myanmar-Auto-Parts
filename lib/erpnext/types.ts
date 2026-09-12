/**
 * Type definitions for the D&W catalog (ERPNext-backed).
 */

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

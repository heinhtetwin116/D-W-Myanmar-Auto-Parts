/**
 * ERPNext catalog integration exports.
 */

export { ERPNextClient, createERPNextClient } from "./client";
export type { ERPNextListParams, ERPNextDocType } from "@/types/index.type";

export type {
  Category,
  Product,
  SyncRun,
  ERPNextItemGroup,
  ERPNextItem,
} from "@/types/index.type";

export {
  getCategories,
  getCategoryById,
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductCount,
} from "./queries";

export { syncCatalogFromERPNext } from "./sync";
export type { SyncResult } from "@/types/index.type";

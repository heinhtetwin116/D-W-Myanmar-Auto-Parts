/**
 * ERPNext catalog integration exports.
 */

export { ERPNextClient, createERPNextClient } from "./client";
export type { ERPNextListParams, ERPNextDocType } from "./client";

export type {
  Category,
  Product,
  SyncRun,
  ERPNextItemGroup,
  ERPNextItem,
} from "./types";

export {
  getCategories,
  getCategoryById,
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductCount,
} from "./queries";

export { syncCatalogFromERPNext } from "./sync";
export type { SyncResult } from "./sync";

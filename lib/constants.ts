/**
 * Shared app constants. Import these instead of duplicating magic numbers.
 */

/** Inclusive upper bound for the "low stock" badge and catalog filter. */
export const LOW_STOCK_THRESHOLD = 10;

/** Default catalog page size (products listing). */
export const CATALOG_PAGE_SIZE = 12;

/** Hard cap on `limit` query param for `/api/products`. */
export const CATALOG_PAGE_SIZE_MAX = 48;

/** ISO-style currency code for Myanmar Kyat. UI labels still come from i18n. */
export const CURRENCY_CODE = "MMK";

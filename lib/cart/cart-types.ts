export type CartItem = {
  /** Stable product identifier from the catalog. */
  id: string;
  /** ERPNext Item Code / SKU. */
  code: string;
  /** Display name shown to the customer. */
  name: string;
  /** Displayed unit price in MMK; verify server-side before accepting an order. */
  price: number;
  /** Optional public product image URL. */
  imageUrl?: string;
  /** Requested quantity; this does not reserve or decrement stock. */
  quantity: number;
};

export type CartProductInput = Omit<CartItem, "quantity">;
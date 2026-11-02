"use client";

import { useEffect, useState } from "react";
import { Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useCart } from "@/components/cart/cart-provider";
import type { CartProductInput } from "@/lib/cart/cart-types";

type AddToCartButtonProps = {
  product: CartProductInput;
  label?: string;
  size?: "small" | "middle" | "large";
  block?: boolean;
};

type Notice = { type: "success" | "error"; text: string } | null;

export default function AddToCartButton({
  product,
  label = "Add to cart",
  size = "large",
  block = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const handleAdd = () => {
    setNotice(null);

    if (
      !product.id?.trim() ||
      !product.code?.trim() ||
      !product.name?.trim() ||
      !Number.isFinite(product.price) ||
      product.price < 0
    ) {
      setNotice({ type: "error", text: "This product cannot be added to the cart." });
      return;
    }

    setAdding(true);
    try {
      addItem(product, 1);
      setNotice({ type: "success", text: `${product.name} added to cart.` });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      setNotice({ type: "error", text: "Failed to add product to cart. Please try again." });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={block ? "w-full" : "inline-flex flex-col items-start gap-2"}>
      <Button
        type="primary"
        size={size}
        block={block}
        icon={<ShoppingCartOutlined />}
        loading={adding}
        onClick={handleAdd}
        className="hex-bloom"
      >
        {label}
      </Button>
      {notice && (
        <p
          role={notice.type === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`mt-2 text-sm ${notice.type === "success" ? "text-green-700" : "text-red-600"}`}
        >
          {notice.text}
        </p>
      )}
    </div>
  );
}
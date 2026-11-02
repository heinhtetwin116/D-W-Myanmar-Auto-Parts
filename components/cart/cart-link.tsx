"use client";

import Link from "next/link";
import { Badge, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useCart } from "@/components/cart/cart-provider";

type CartLinkProps = {
  locale: string;
  label?: string;
};

export default function CartLink({ locale, label = "Cart" }: CartLinkProps) {
  const { itemCount } = useCart();

  return (
    <Link href={`/${locale}/cart`} aria-label={`${label}, ${itemCount} items`}>
      <Badge count={itemCount} size="small" overflowCount={99}>
        <Button icon={<ShoppingCartOutlined />}>{label}</Button>
      </Badge>
    </Link>
  );
}

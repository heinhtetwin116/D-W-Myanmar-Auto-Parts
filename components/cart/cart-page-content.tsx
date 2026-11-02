"use client";

import Link from "next/link";
import {
  Button,
  Card,
  Empty,
  InputNumber,
  Space,
  Typography,
  message,
} from "antd";
import { DeleteOutlined, MessageOutlined } from "@ant-design/icons";
import { useCart } from "@/components/cart/cart-provider";

const { Title, Text } = Typography;

type CartPageContentProps = {
  locale: string;
  currencyLabel?: string;
};

function formatPrice(amount: number, currencyLabel: string) {
  return `${Math.round(amount).toLocaleString()} ${currencyLabel}`;
}

function buildOrderMessage(
  items: ReturnType<typeof useCart>["items"],
  total: number,
  currencyLabel: string,
) {
  return [
    "D&W Myanmar Auto Parts — Order Request",
    "",
    ...items.map(
      (item, index) =>
        `${index + 1}. ${item.name}\nItem Code: ${item.code}\nQty: ${item.quantity}\nUnit Price: ${formatPrice(item.price, currencyLabel)}\nSubtotal: ${formatPrice(item.price * item.quantity, currencyLabel)}`,
    ),
    "",
    `Estimated Total: ${formatPrice(total, currencyLabel)}`,
    "",
    "Please confirm stock availability, current selling price, and delivery charges before confirming this order.",
  ].join("\n");
}

export default function CartPageContent({
  locale,
  currencyLabel = "MMK",
}: CartPageContentProps) {
  const { items, ready, setQuantity, removeItem, clearCart } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleOrder = async () => {
    if (items.length === 0) {
      message.warning("Your cart is empty.");
      return;
    }

    const summary = buildOrderMessage(items, total, currencyLabel);

    let copied = false;

    // Method 1: Clipboard API
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
        copied = true;
      }
    } catch {
      // Continue to fallback
    }

    // Method 2: Fallback for unsupported browsers
    if (!copied) {
      const textarea = document.createElement("textarea");

      textarea.value = summary;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      textarea.setAttribute("readonly", "");

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, summary.length);

      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }

      document.body.removeChild(textarea);
    }

    if (!copied) {
      message.error("Unable to copy order details. Please try again.");
      return;
    }

    message.success("Order details copied. Opening Viber...");

    // Open D&W Viber Chat
    window.location.href = "viber://chat?number=%2B959765006774";
  };

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-10">
        <Card className="!rounded-2xl">Loading cart…</Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:pt-8 pb-10">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm">
        <Link
          href={`/${locale}`}
          className="text-gray-500 hover:text-primary transition-colors"
        >
          Home
        </Link>

        <span className="text-gray-400">/</span>

        <span className="text-gray-900">Your Cart</span>
      </div>

      {/* Page Heading */}
      <div className="mb-8 flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Title level={1} className="!mb-1">
            Your Cart
          </Title>

          <Text type="secondary">
            Review your selected items before placing your order.
          </Text>
        </div>

        <Text type="secondary">
          {items.length} {items.length === 1 ? "item" : "items"} in cart
        </Text>
      </div>

      {/* Cart Content */}
      {items.length === 0 ? (
        <Card className="!rounded-2xl">
          <Empty description="Your cart is empty">
            <Link href={`/${locale}/products`}>
              <Button type="primary">Browse products</Button>
            </Link>
          </Empty>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="!rounded-2xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <Text strong className="block">
                      {item.name}
                    </Text>

                    <Text type="secondary">Item Code: {item.code}</Text>

                    <div className="mt-1">
                      {formatPrice(item.price, currencyLabel)} each
                    </div>
                  </div>

                  <Space wrap>
                    <InputNumber
                      aria-label={`Quantity for ${item.name}`}
                      min={1}
                      max={999}
                      precision={0}
                      value={item.quantity}
                      onChange={(value) =>
                        setQuantity(item.id, Number(value ?? 1))
                      }
                    />

                    <Text strong>
                      {formatPrice(item.price * item.quantity, currencyLabel)}
                    </Text>

                    <Button
                      danger
                      aria-label={`Remove ${item.name}`}
                      icon={<DeleteOutlined />}
                      onClick={() => removeItem(item.id)}
                    />
                  </Space>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <Card className="!rounded-2xl">
            <div className="flex items-center justify-between gap-4">
              <Text type="secondary">Estimated total</Text>

              <Title level={3} className="!mb-0">
                {formatPrice(total, currencyLabel)}
              </Title>
            </div>

            <Text type="secondary" className="mt-2 block">
              This is an order request, not a confirmed sale. Our team will
              verify current prices, stock, and delivery charges.
            </Text>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                type="primary"
                size="large"
                block
                icon={<MessageOutlined />}
                onClick={handleOrder}
              >
                Order via Viber
              </Button>

              <Button size="large" block onClick={clearCart}>
                Clear cart
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

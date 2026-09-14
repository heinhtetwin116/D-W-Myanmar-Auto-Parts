import React from "react";
import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";
import type { ProductCardItem } from "@/lib/catalog/product-card-item";

export type { ProductCardItem };

export interface ProductBadge {
  text: string;
  tone: "success" | "warning" | "critical";
}

const badgeTones: Record<ProductBadge["tone"], string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  critical: "bg-critical/10 text-critical",
};

interface ProductCardProps {
  product: ProductCardItem;
  badge?: ProductBadge;
  detailsHref?: string;
  detailsLabel?: string;
}

const ProductCard = ({
  product,
  badge,
  detailsHref,
  detailsLabel = "View Details",
}: ProductCardProps) => {
  const resolvedBadge: ProductBadge = badge ?? {
    text: `In Stock: ${product.stock}`,
    tone: "success",
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-default hover:shadow-hover transition-shadow group flex flex-col h-full">
      <div className="relative h-48 w-full mb-4 bg-muted rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
        {/* Placeholder Icon since we don't have real product images */}
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
          <Wrench size={40} />
        </div>
        <span
          className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${badgeTones[resolvedBadge.tone]}`}
        >
          {resolvedBadge.text}
        </span>
      </div>

      <div className="space-y-1 flex-grow">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {product.code}
        </p>
        <h3 className="font-semibold text-foreground text-lg truncate">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.desc}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
        <span className="font-bold text-accent">{product.price}</span>
        {detailsHref ? (
          <Link
            href={detailsHref}
            className="text-sm font-medium text-foreground hover:text-accent flex items-center gap-1 transition-colors"
          >
            {detailsLabel} <ArrowRight size={14} />
          </Link>
        ) : (
          <button className="text-sm font-medium text-foreground hover:text-accent flex items-center gap-1 transition-colors">
            {detailsLabel} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

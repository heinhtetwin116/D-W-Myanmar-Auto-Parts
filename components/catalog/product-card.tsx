import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";
import type { ProductCardProps } from "@/types/index.type";

const ProductCard = ({
  product,
  detailsHref,
  detailsLabel = "View Details",
}: ProductCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-default hover:shadow-hover transition-shadow group flex flex-col h-full">
      {/* Product Image */}
      <div className="relative h-48 w-full mb-4 bg-muted rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name || "Product image"}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
            <Wrench size={40} />
          </div>
        )}

      </div>

      {/* Product Information */}
      <div className="space-y-1 flex-grow">

        {/* Product Name */}
        <h3 className="font-semibold text-foreground text-lg truncate">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.desc}
        </p>
      </div>

      {/* Price + Details */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
        {/* Price */}
        <span className="font-bold text-accent">
          {product.price}
        </span>

        {/* Details Link */}
        {detailsHref ? (
          <Link
            href={detailsHref}
            className="text-sm font-medium text-foreground hover:text-accent flex items-center gap-1 transition-colors"
          >
            {detailsLabel}
            <ArrowRight size={14} />
          </Link>
        ) : (
          <button
            type="button"
            className="text-sm font-medium text-foreground hover:text-accent flex items-center gap-1 transition-colors"
          >
            {detailsLabel}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
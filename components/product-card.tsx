import React from "react";
import { Wrench, ArrowRight } from "lucide-react";

export interface Product {
  id: number;
  code: string;
  name: string;
  desc: string;
  stock: number;
  price: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-default hover:shadow-hover transition-shadow group flex flex-col h-full">
      <div className="relative h-48 w-full mb-4 bg-muted rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
        {/* Placeholder Icon since we don't have real product images */}
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
          <Wrench size={40} />
        </div>
        <span className="absolute top-2 right-2 text-xs font-semibold bg-success/10 text-success px-2 py-1 rounded-full">
          In Stock: {product.stock}
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
        <button className="text-sm font-medium text-foreground hover:text-accent flex items-center gap-1 transition-colors">
          View Details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

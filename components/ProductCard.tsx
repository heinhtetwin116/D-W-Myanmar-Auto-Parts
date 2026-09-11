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
    <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="relative h-48 w-full mb-4 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
        {/* Placeholder Icon since we don't have real product images */}
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
          <Wrench size={40} />
        </div>
        <span className="absolute top-2 right-2 text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
          In Stock: {product.stock}
        </span>
      </div>

      <div className="space-y-1 flex-grow">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {product.code}
        </p>
        <h3 className="font-semibold text-[#0F172A] text-lg truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.desc}</p>
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
        <span className="font-bold text-[#A81C24]">{product.price}</span>
        <button className="text-sm font-medium text-[#0F172A] hover:text-[#A81C24] flex items-center gap-1 transition-colors">
          View Details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

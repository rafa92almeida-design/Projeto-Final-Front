'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product, ProductColor } from '@/types';
import { Star, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product, size?: number, color?: ProductColor) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
}) => {
  const [imgError, setImgError] = useState(false);
  const imageSrc = !imgError && product.images[0]
    ? product.images[0]
    : '/images/hero_nike_sneakers_banner_1793233640073.jpg';

  const formattedPrice = product.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const formattedOriginalPrice = product.originalPrice
    ? product.originalPrice.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    : null;

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Discount / Offer Badge */}
      {product.discountPercentage && (
        <div className="absolute top-3 left-3 z-10 bg-[#E7FF86] text-[#1F1F1F] text-[11px] font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase shadow-xs">
          {product.discountPercentage}% OFF
        </div>
      )}

      {/* Image Container with Soft Gradient Mesh Fallback */}
      <div className="relative w-full aspect-4/3 bg-[#F5F5F5] overflow-hidden flex items-center justify-center p-4">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          referrerPolicy="no-referrer"
          className="object-contain object-center p-4 group-hover:scale-108 transition-transform duration-500 ease-out"
          onError={() => setImgError(true)}
        />

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="bg-white text-gray-900 text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1.5 shadow-md hover:bg-[#C92071] hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Detalhes</span>
          </button>
          
          {onAddToCart && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="bg-[#C92071] text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1.5 shadow-md hover:bg-[#991956] transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Comprar</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Brand & Category Kicker */}
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            {product.brand} · {product.category}
          </span>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-[#474747] group-hover:text-[#C92071] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 text-xs text-amber-500">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-gray-700">{product.rating}</span>
          <span className="text-gray-400 text-[11px]">({product.reviewsCount})</span>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-gray-50">
          {formattedOriginalPrice && (
            <span className="text-xs text-gray-400 line-through font-medium">
              {formattedOriginalPrice}
            </span>
          )}
          <span className="text-base sm:text-lg font-black text-[#1F1F1F]">
            {formattedPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

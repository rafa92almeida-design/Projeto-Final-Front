'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const activeImage = !imgError
    ? images[selectedImageIndex] || images[0] || '/images/hero_nike_sneakers_banner_1793233640073.jpg'
    : '/images/hero_nike_sneakers_banner_1793233640073.jpg';

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image Stage */}
      <div className="relative w-full aspect-4/3 sm:aspect-square bg-[#F5F5F5] rounded-3xl overflow-hidden p-6 border border-gray-100 flex items-center justify-center group shadow-xs">
        <Image
          src={activeImage}
          alt={productName}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          referrerPolicy="no-referrer"
          className="object-contain object-center p-6 group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => {
            const isSelected = idx === selectedImageIndex;
            return (
              <button
                key={idx}
                onClick={() => {
                  setImgError(false);
                  setSelectedImageIndex(idx);
                }}
                className={`relative w-20 h-20 rounded-2xl bg-[#F5F5F5] overflow-hidden border-2 p-1 transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'border-[#C92071] shadow-md scale-102 bg-white'
                    : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} vista ${idx + 1}`}
                  fill
                  sizes="80px"
                  referrerPolicy="no-referrer"
                  className="object-contain p-1"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

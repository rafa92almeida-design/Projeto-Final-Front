'use client';

import React from 'react';

interface SizeSelectorProps {
  availableSizes: number[];
  selectedSize: number;
  onSelectSize: (size: number) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  availableSizes,
  selectedSize,
  onSelectSize,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-extrabold uppercase tracking-wider text-gray-500">
          Tamanho: <strong className="text-[#1F1F1F] font-black">{selectedSize}</strong>
        </span>
        <a href="#guia-tamanhos" className="text-[#C92071] font-bold hover:underline">
          Guia de Tamanhos
        </a>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {availableSizes.map((size) => {
          const isSelected = size === selectedSize;
          return (
            <button
              key={size}
              onClick={() => onSelectSize(size)}
              className={`w-12 h-12 rounded-xl text-sm font-black transition-all flex items-center justify-center cursor-pointer ${
                isSelected
                  ? 'bg-[#C92071] text-white shadow-md scale-105 border-2 border-[#C92071]'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#C92071] hover:text-[#C92071]'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};

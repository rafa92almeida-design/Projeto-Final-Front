'use client';

import React from 'react';
import { ProductColor } from '@/types';
import { Check } from 'lucide-react';

interface ColorSelectorProps {
  availableColors: ProductColor[];
  selectedColor: ProductColor;
  onSelectColor: (color: ProductColor) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  availableColors,
  selectedColor,
  onSelectColor,
}) => {
  return (
    <div className="space-y-2">
      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 block">
        Cor: <strong className="text-[#1F1F1F] font-black">{selectedColor.name}</strong>
      </span>

      <div className="flex items-center gap-3">
        {availableColors.map((color, idx) => {
          const isSelected = color.hex === selectedColor.hex;
          return (
            <button
              key={idx}
              onClick={() => onSelectColor(color)}
              title={color.name}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer relative ${
                isSelected
                  ? 'ring-3 ring-offset-2 ring-[#C92071] scale-110 shadow-md'
                  : 'hover:scale-105 border border-gray-300'
              }`}
              style={{ backgroundColor: color.hex }}
            >
              {isSelected && (
                <Check
                  className={`w-4 h-4 stroke-[3] ${
                    color.hex === '#FFFFFF' || color.hex === '#F8FAFC'
                      ? 'text-gray-900'
                      : 'text-white'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

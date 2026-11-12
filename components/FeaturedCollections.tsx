'use client';

import React from 'react';
import Image from 'next/image';
import { CollectionCard as CollectionCardType } from '@/types';
import { Shirt, Disc, Headphones, Footprints, Sparkles, ArrowRight } from 'lucide-react';

interface FeaturedCollectionsProps {
  collections: CollectionCardType[];
  onSelectCategory: (category: string) => void;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({
  collections,
  onSelectCategory,
}) => {
  const categoryIcons = [
    { name: 'Camisetas', icon: Shirt, catKey: 'casual' },
    { name: 'Calças', icon: Disc, catKey: 'casual' },
    { name: 'Bonés', icon: Sparkles, catKey: 'casual' },
    { name: 'Headphones', icon: Headphones, catKey: 'utilitario' },
    { name: 'Tênis', icon: Footprints, catKey: 'esporte' },
  ];

  return (
    <section className="py-8 space-y-10">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C92071]">
            Curadoria Especial
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F] tracking-tight">
            Coleções em Destaque
          </h2>
        </div>
      </div>

      {/* Featured Collection Cards Grid (3-column banner cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            onClick={() => onSelectCategory(col.category)}
            className="group relative bg-[#D8DCF8] rounded-2xl overflow-hidden p-6 min-h-[220px] flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer border border-white/60"
          >
            {/* Top Discount Tag */}
            <div className="flex items-center justify-between">
              <span className="bg-[#E7FF86] text-[#1F1F1F] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                {col.discount}
              </span>
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">
                {col.category}
              </span>
            </div>

            {/* Title & Action */}
            <div className="relative z-10 max-w-[65%] space-y-3">
              <h3 className="text-xl font-black text-[#1F1F1F] leading-tight">
                {col.title}
              </h3>
              <button className="bg-white text-[#C92071] hover:bg-[#C92071] hover:text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5">
                <span>Comprar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Background Sneaker Image */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full pointer-events-none overflow-hidden flex items-end justify-end p-2">
              <div className="relative w-full h-full">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  referrerPolicy="no-referrer"
                  className="object-contain object-right-bottom group-hover:scale-110 transition-transform duration-500 transform rotate-[-6deg]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Icon Selector Bar */}
      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-center text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">
          Navegue por Categoria
        </h3>
        <div className="flex items-center justify-center flex-wrap gap-6 sm:gap-10">
          {categoryIcons.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectCategory(item.catKey)}
                className="flex flex-col items-center gap-3 group focus:outline-hidden"
              >
                <div className="w-20 h-20 rounded-full bg-white border-2 border-gray-100 group-hover:border-[#C92071] shadow-xs group-hover:shadow-md flex items-center justify-center text-gray-500 group-hover:text-[#C92071] transition-all group-hover:scale-105">
                  <IconComponent className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-gray-700 group-hover:text-[#C92071] transition-colors">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

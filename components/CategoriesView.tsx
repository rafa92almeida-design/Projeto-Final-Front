'use client';

import React from 'react';
import Image from 'next/image';
import { Shirt, Footprints, Headphones, Disc, Flame, ArrowRight, Layers } from 'lucide-react';
import { CategoryType, BrandType, GenderType } from '@/types';

interface CategoriesViewProps {
  totalProductsCount: number;
  onSelectCategoryFilter: (category: CategoryType) => void;
  onSelectBrandFilter: (brand: BrandType) => void;
  onSelectGenderFilter: (gender: GenderType) => void;
  onViewAllProducts: () => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  totalProductsCount,
  onSelectCategoryFilter,
  onSelectBrandFilter,
  onSelectGenderFilter,
  onViewAllProducts,
}) => {
  const mainCategories = [
    {
      id: 'tenis',
      title: 'Tênis & Sneakers',
      subtitle: 'Performance, basquete, corrida e o melhor do streetwear',
      count: 'Performance & Lifestyle',
      catKey: 'esporte' as CategoryType,
      image: '/images/hero_nike_sneakers_banner_1793233640073.jpg',
      bgGradient: 'from-[#FFEAEF] to-[#FFE4E6]',
      badge: 'Drop em Alta',
    },
    {
      id: 'camisetas',
      title: 'Camisetas & Apparel',
      subtitle: 'Camisetas oversized, regatas e streetwear de alta gramatura',
      count: 'Streetwear & Casual',
      catKey: 'casual' as CategoryType,
      image: '/images/sneaker_nike_dunk_low_pink_1793233641920.jpg',
      bgGradient: 'from-[#E0E7FF] to-[#C7D2FE]',
      badge: 'Streetwear',
    },
    {
      id: 'headphones',
      title: 'Headphones & Áudio',
      subtitle: 'Equipamentos utilitários e acessórios urbanos resistentes',
      count: 'Edições Limitadas',
      catKey: 'utilitario' as CategoryType,
      image: '/images/sneaker_puma_rsx_colorful_1793233641813.jpg',
      bgGradient: 'from-[#FEF08A] to-[#FDE047]',
      badge: 'Utilitário',
    },
  ];

  const categoryQuickList = [
    { name: 'Esporte & Corrida', key: 'esporte' as CategoryType, icon: Footprints, desc: 'Tênis de alta resposta e amortecimento' },
    { name: 'Casual & Urbano', key: 'casual' as CategoryType, icon: Shirt, desc: 'Moda diária, camisetas e sneakers retro' },
    { name: 'Utilitário & Trail', key: 'utilitario' as CategoryType, icon: Headphones, desc: 'Equipamentos resistentes e acessórios' },
    { name: 'Basquete & Quadra', key: 'basquete' as CategoryType, icon: Flame, desc: 'Silhuetas de cano alto e grip superior' },
    { name: 'Corrida de Rua', key: 'corrida' as CategoryType, icon: Disc, desc: 'Leveza e propulsão para médias e longas distâncias' },
  ];

  const brandList: { name: BrandType; logoText: string; color: string }[] = [
    { name: 'Nike', logoText: 'JUST DO IT', color: 'bg-black text-white' },
    { name: 'Jordan', logoText: 'AIR JORDAN', color: 'bg-[#C92071] text-white' },
    { name: 'Adidas', logoText: 'THREE STRIPES', color: 'bg-blue-600 text-white' },
    { name: 'Puma', logoText: 'FOREVER FASTER', color: 'bg-amber-500 text-white' },
    { name: 'New Balance', logoText: 'SINCE 1906', color: 'bg-red-700 text-white' },
  ];

  return (
    <div className="space-y-12 py-4 animate-in fade-in duration-300">
      <div className="bg-[#1F1F1F] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg border border-gray-800">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E7FF86] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#C92071]" />
            <span>Navegação por Categorias</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Explore Nosso Catálogo Completo por Estilo
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Selecione uma das categorias abaixo para filtrar os produtos exatos que você está procurando, desde os tênis mais raros até vestuário e acessórios streetwear.
          </p>
          <button
            type="button"
            onClick={onViewAllProducts}
            className="bg-[#C92071] hover:bg-[#991956] text-white font-extrabold text-xs sm:text-sm py-3 px-6 rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Ver Todos os Produtos ({totalProductsCount})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Decorative Background Mesh */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#C92071]/20 to-transparent pointer-events-none hidden md:block" />
      </div>

      {/* Main Category Banner Cards */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C92071]">
            Coleções Principais
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F]">
            Categorias em Destaque
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mainCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategoryFilter(cat.catKey)}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 cursor-pointer relative"
            >
              {/* Badge */}
              <div className="flex items-center justify-between z-10">
                <span className="bg-[#1F1F1F] text-[#E7FF86] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {cat.badge}
                </span>
                <span className="text-[11px] font-bold text-gray-400 uppercase">
                  {cat.count}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 py-8 z-10 max-w-[80%]">
                <h3 className="text-2xl font-black text-[#1F1F1F] group-hover:text-[#C92071] transition-colors leading-tight">
                  {cat.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {cat.subtitle}
                </p>
              </div>

              {/* Image Banner */}
              <div className="relative w-full aspect-16/9 bg-[#F5F5F5] rounded-2xl overflow-hidden p-2">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  referrerPolicy="no-referrer"
                  className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Action Link */}
              <div className="pt-4 flex items-center justify-between text-xs font-extrabold text-[#C92071] border-t border-gray-100 mt-4">
                <span>Ver Produtos da Categoria</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grid of Styles / Quick Category Buttons */}
      <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C92071]">
            Filtro Direto
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F1F1F]">
            Categorias por Estilo & Uso
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryQuickList.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectCategoryFilter(item.key)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8F8F8] hover:bg-[#FFEAEF] border border-gray-200/80 hover:border-[#C92071] transition-all text-left group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white text-[#C92071] flex items-center justify-center font-bold shadow-2xs shrink-0 group-hover:scale-110 transition-transform">
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-extrabold text-[#1F1F1F] group-hover:text-[#C92071] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 truncate">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#C92071] group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Browse by Brand Section */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C92071]">
            Grandes Marcas
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F1F1F]">
            Navegue pelas Marcas Oficiais
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {brandList.map((b) => (
            <button
              key={b.name}
              onClick={() => onSelectBrandFilter(b.name)}
              className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#C92071] hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
              <div className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${b.color}`}>
                {b.name}
              </div>
              <span className="text-xs font-bold text-gray-700 group-hover:text-[#C92071] transition-colors">
                Ver Sneakers
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Browse by Gender */}
      <section className="bg-[#FFEAEF] rounded-3xl p-8 border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-black text-[#1F1F1F]">
            Procurando por Gênero?
          </h3>
          <p className="text-xs text-gray-600">
            Encontre opções masculinas, femininas ou modelos unissex para presentear.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Masculino', value: 'masculino' as GenderType },
            { label: 'Feminino', value: 'feminino' as GenderType },
            { label: 'Unissex', value: 'unissex' as GenderType },
          ].map((g) => (
            <button
              key={g.value}
              onClick={() => onSelectGenderFilter(g.value)}
              className="bg-white hover:bg-[#C92071] hover:text-white text-gray-800 text-xs font-extrabold py-3 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {g.label}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};

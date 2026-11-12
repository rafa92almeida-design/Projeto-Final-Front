'use client';

import React from 'react';
import { FilterState, CategoryType, GenderType, BrandType, ConditionType } from '@/types';
import { Filter, RotateCcw, Check } from 'lucide-react';

interface FilterGroupProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onResetFilters: () => void;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  filters,
  setFilters,
  onResetFilters,
}) => {
  const categoryOptions: { label: string; value: CategoryType }[] = [
    { label: 'Esporte / Performance', value: 'esporte' },
    { label: 'Casual / Urbana', value: 'casual' },
    { label: 'Utilitário / Trail', value: 'utilitario' },
    { label: 'Corrida', value: 'corrida' },
    { label: 'Basquete', value: 'basquete' },
  ];

  const genderOptions: { label: string; value: GenderType }[] = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Feminino', value: 'feminino' },
    { label: 'Unissex', value: 'unissex' },
  ];

  const brandOptions: { label: string; value: BrandType }[] = [
    { label: 'Nike', value: 'Nike' },
    { label: 'Adidas', value: 'Adidas' },
    { label: 'Puma', value: 'Puma' },
    { label: 'Jordan', value: 'Jordan' },
    { label: 'New Balance', value: 'New Balance' },
  ];

  const conditionOptions: { label: string; value: ConditionType }[] = [
    { label: 'Novo', value: 'novo' },
    { label: 'Seminovo / Vintage', value: 'seminovo' },
  ];

  const toggleFilterItem = <T,>(list: T[], value: T): T[] => {
    return list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
  };

  return (
    <aside className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-[#1F1F1F]">
          <Filter className="w-5 h-5 text-[#C92071]" />
          <h3 className="font-extrabold text-base">Filtrar por</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-bold text-[#C92071] hover:underline flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpar</span>
        </button>
      </div>

      {/* Brand Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
          Marca
        </h4>
        <div className="space-y-2">
          {brandOptions.map((brand) => {
            const isChecked = filters.brands.includes(brand.value);
            return (
              <label
                key={brand.value}
                className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-[#C92071] transition-colors select-none"
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-[#C92071] border-[#C92071] text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      brands: toggleFilterItem(prev.brands, brand.value),
                    }))
                  }
                  className="sr-only"
                />
                <span className="font-medium">{brand.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
          Categoria
        </h4>
        <div className="space-y-2">
          {categoryOptions.map((cat) => {
            const isChecked = filters.categories.includes(cat.value);
            return (
              <label
                key={cat.value}
                className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-[#C92071] transition-colors select-none"
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-[#C92071] border-[#C92071] text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      categories: toggleFilterItem(prev.categories, cat.value),
                    }))
                  }
                  className="sr-only"
                />
                <span className="font-medium">{cat.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
          Gênero
        </h4>
        <div className="space-y-2">
          {genderOptions.map((gender) => {
            const isChecked = filters.genders.includes(gender.value);
            return (
              <label
                key={gender.value}
                className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-[#C92071] transition-colors select-none"
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-[#C92071] border-[#C92071] text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      genders: toggleFilterItem(prev.genders, gender.value),
                    }))
                  }
                  className="sr-only"
                />
                <span className="font-medium">{gender.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Condition / State Filter */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
          Estado
        </h4>
        <div className="space-y-2">
          {conditionOptions.map((cond) => {
            const isChecked = filters.conditions.includes(cond.value);
            return (
              <label
                key={cond.value}
                className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-[#C92071] transition-colors select-none"
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-[#C92071] border-[#C92071] text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      conditions: toggleFilterItem(prev.conditions, cond.value),
                    }))
                  }
                  className="sr-only"
                />
                <span className="font-medium">{cond.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Max Price Slider */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs font-extrabold text-gray-500">
          <span className="uppercase tracking-wider">Preço Máximo</span>
          <span className="text-[#C92071] font-black text-sm">
            R$ {filters.maxPrice}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="1200"
          step="50"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              maxPrice: Number(e.target.value),
            }))
          }
          className="w-full accent-[#C92071] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-400 font-bold">
          <span>R$ 100</span>
          <span>R$ 1200</span>
        </div>
      </div>
    </aside>
  );
};

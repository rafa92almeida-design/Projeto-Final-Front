'use client';

import React from 'react';
import { Instagram, Facebook, Twitter, Youtube, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';
import { getStoreName } from '@/lib/store-helpers';
import { CategoryType } from '@/types';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'produtos' | 'categorias' | 'pedidos') => void;
  onSelectCategory?: (category: CategoryType) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onSelectCategory }) => {
  const storeName = getStoreName();

  const footerCategories: { label: string; category: CategoryType }[] = [
    { label: 'Esporte & Performance', category: 'esporte' },
    { label: 'Casual & Streetwear', category: 'casual' },
    { label: 'Corrida', category: 'corrida' },
    { label: 'Basquete', category: 'basquete' },
    { label: 'Utilitário & Trail', category: 'utilitario' },
  ];

  return (
    <footer className="bg-[#1F1F1F] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#C92071] rounded-xl flex items-center justify-center text-white font-black text-lg">
                <span className="transform -skew-x-12">DS</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-sans">
                {storeName}
              </span>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              A Drip Store é a sua loja online de calçados esportivos, sneakers e moda urbana streetwear com envio para todo o Brasil.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Instagram, href: '#instagram', label: 'Instagram' },
                { icon: Facebook, href: '#facebook', label: 'Facebook' },
                { icon: Twitter, href: '#twitter', label: 'Twitter' },
                { icon: Youtube, href: '#youtube', label: 'YouTube' },
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    aria-label={item.label}
                    className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#C92071] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <IconComp className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navegação</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="hover:text-[#C92071] transition-colors cursor-pointer"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('produtos')}
                  className="hover:text-[#C92071] transition-colors cursor-pointer"
                >
                  Catálogo de Produtos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('categorias')}
                  className="hover:text-[#C92071] transition-colors cursor-pointer"
                >
                  Explorar Categorias
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('pedidos')}
                  className="hover:text-[#C92071] transition-colors cursor-pointer"
                >
                  Meus Pedidos
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Categorias</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              {footerCategories.map((item) => (
                <li key={item.category}>
                  <button
                    type="button"
                    onClick={() =>
                      onSelectCategory ? onSelectCategory(item.category) : setActiveTab('categorias')
                    }
                    className="hover:text-[#C92071] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Atendimento</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C92071] shrink-0 mt-0.5" />
                <span>São Paulo - SP, Brasil</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C92071] shrink-0" />
                <span>Atendimento Online</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C92071] shrink-0" />
                <span>contato@digitalstore.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {storeName} (Drip Store). Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#C92071]" /> Selo de Autenticidade Drip
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

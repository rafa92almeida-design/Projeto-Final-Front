'use client';

import React, { useState } from 'react';
import { Search, ShoppingBag, User as UserIcon, Menu, X, Flame, ShieldCheck, Truck, LogOut, ChevronDown } from 'lucide-react';
import { getFreeShippingThreshold, getStoreName } from '@/lib/store-helpers';
import { UserProfile } from '@/types';

interface HeaderProps {
  activeTab: 'home' | 'produtos' | 'categorias' | 'pedidos';
  setActiveTab: (tab: 'home' | 'produtos' | 'categorias' | 'pedidos') => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user: UserProfile | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  user,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const storeName = getStoreName();
  const freeShippingThreshold = getFreeShippingThreshold();

  const navLinks: { label: string; tab: 'home' | 'produtos' | 'categorias' | 'pedidos' }[] = [
    { label: 'Home', tab: 'home' },
    { label: 'Produtos', tab: 'produtos' },
    { label: 'Categorias', tab: 'categorias' },
    { label: 'Meus Pedidos', tab: 'pedidos' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('produtos');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-gray-100 transition-all">
      <div className="bg-[#1F1F1F] text-white text-xs py-2 px-4 flex items-center justify-between font-medium">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-[#C92071] animate-bounce" />
            <span>
              Ganhe R$ 30,00 de desconto na primeira compra com o cupom{' '}
              <strong className="text-[#E7FF86]">DRIP30</strong>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-gray-300 text-[11px]">
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-[#C92071]" /> Frete grátis para todo Brasil acima de R$ {freeShippingThreshold}
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#C92071]" /> Compra 100% Segura e Garantida
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 md:gap-8">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-[#C92071] focus:outline-hidden cursor-pointer"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 group text-left focus:outline-hidden cursor-pointer"
            >
              <div className="w-10 h-10 bg-[#C92071] rounded-xl flex items-center justify-center text-white font-black text-xl tracking-tighter shadow-md group-hover:scale-105 transition-transform">
                <span className="transform -skew-x-12">DS</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-[#C92071] tracking-tight leading-none font-sans">
                  {storeName}
                </span>
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  Drip Store
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-lg relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Buscar produto, marca ou tênis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className="w-full bg-[#F5F5F5] text-sm text-[#474747] placeholder-gray-400 py-3 pl-4 pr-11 rounded-lg border border-transparent focus:border-[#C92071] focus:bg-white focus:outline-hidden transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#C92071] transition-colors cursor-pointer"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Live Search Quick Popover */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2 block mb-2">
                  Termos mais buscados
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Air Jordan', 'Nike Dunk', 'Ultraboost', 'Puma RS-X', 'Camiseta', 'Boné'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchQuery(tag);
                        setActiveTab('produtos');
                      }}
                      className="text-xs bg-[#F5F5F5] hover:bg-[#C92071] hover:text-white px-3 py-1.5 rounded-full text-gray-600 transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Actions & Cart */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {/* Quick Register / Login buttons or User Avatar Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-[#F8F8F8] hover:bg-[#FFEAEF] p-1.5 pr-3 rounded-full border border-gray-200 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#C92071] text-white font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-gray-800 hidden sm:inline-block max-w-[100px] truncate">
                    Olá, {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2">
                    <button
                      onClick={() => {
                        setActiveTab('pedidos');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-[#FFEAEF] hover:text-[#C92071] rounded-xl transition-colors flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Meus Pedidos</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair da Conta</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="text-xs font-semibold text-gray-600 hover:text-[#C92071] underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Cadastre-se
                </button>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="bg-[#C92071] hover:bg-[#991956] text-white text-xs font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all hover:shadow-md cursor-pointer"
                >
                  Entrar
                </button>
              </div>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-[#F5F5F5] hover:bg-[#FFEAEF] text-gray-700 hover:text-[#C92071] transition-colors group focus:outline-hidden cursor-pointer"
              aria-label="Ver Carrinho de Compras"
            >
              <ShoppingBag className="w-6 h-6 transition-transform group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C92071] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse-subtle">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F5F5] text-sm text-[#474747] placeholder-gray-400 py-2.5 pl-4 pr-10 rounded-lg border border-transparent focus:border-[#C92071] focus:outline-hidden"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C92071]"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Desktop Navigation Category Links Bar */}
        <nav className="hidden md:flex items-center gap-8 py-3 border-t border-gray-100 text-sm font-semibold">
          {navLinks.map((link) => (
            <button
              key={link.tab}
              onClick={() => setActiveTab(link.tab)}
              className={`relative py-1 transition-colors cursor-pointer ${
                activeTab === link.tab
                  ? 'text-[#C92071] font-bold'
                  : 'text-gray-600 hover:text-[#C92071]'
              }`}
            >
              {link.label}
              {activeTab === link.tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C92071] rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.tab}
                onClick={() => {
                  setActiveTab(link.tab);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded-lg text-sm font-bold transition-colors ${
                  activeTab === link.tab
                    ? 'bg-[#FFEAEF] text-[#C92071]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-xs font-bold text-gray-800">Olá, {user.name}</span>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-red-600"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 bg-gray-100 text-gray-800 py-2.5 rounded-lg font-bold text-sm text-center"
                >
                  Cadastre-se
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 bg-[#C92071] text-white py-2.5 rounded-lg font-bold text-sm text-center shadow-xs"
                >
                  Entrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

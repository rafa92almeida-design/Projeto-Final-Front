'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroCarousel } from '@/components/HeroCarousel';
import { FeaturedCollections } from '@/components/FeaturedCollections';
import { ProductCard } from '@/components/ProductCard';
import { FilterGroup } from '@/components/FilterGroup';
import { ProductDetailView } from '@/components/ProductDetailView';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrdersView } from '@/components/OrdersView';
import { AuthModal } from '@/components/AuthModal';
import { CategoriesView } from '@/components/CategoriesView';

import { fetchCollections, fetchProducts } from '@/lib/api';
import { filterAndSortProducts, getStoreName } from '@/lib/store-helpers';
import {
  CartItem,
  CategoryType,
  CollectionCard,
  FilterState,
  Order,
  Product,
  ProductColor,
  UserProfile,
} from '@/types';
import { AlertCircle, ArrowRight, RefreshCw, SlidersHorizontal } from 'lucide-react';

const CART_STORAGE_KEY = 'digital_store_cart';
const ORDERS_STORAGE_KEY = 'digital_store_orders';
const USER_STORAGE_KEY = 'digital_store_user';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'home' | 'produtos' | 'categorias' | 'pedidos' | 'detalhes'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<CollectionCard[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState('');

  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutCouponCode, setCheckoutCouponCode] = useState<string | undefined>(undefined);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    categories: [],
    genders: [],
    brands: [],
    conditions: [],
    maxPrice: 1200,
    sortBy: 'relevantes',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const storeName = getStoreName();

  const loadCatalog = async () => {
    setIsLoadingCatalog(true);
    setCatalogError('');
    try {
      const [productsData, collectionsData] = await Promise.all([
        fetchProducts(),
        fetchCollections(),
      ]);
      setProducts(productsData);
      setCollections(collectionsData);
    } catch (err) {
      console.error('Erro ao carregar dados iniciais da loja:', err);
      setCatalogError('Não foi possível carregar os produtos no momento. Tente novamente.');
    } finally {
      setIsLoadingCatalog(false);
    }
  };

  useEffect(() => {
    let active = true;

    const initializeStore = async () => {
      try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (active) {
          if (storedCart) setCartItems(JSON.parse(storedCart) as CartItem[]);
          if (storedOrders) setOrders(JSON.parse(storedOrders) as Order[]);
          if (storedUser) setUser(JSON.parse(storedUser) as UserProfile);
        }
      } catch (err) {
        console.error('Erro ao restaurar dados salvos no navegador:', err);
      } finally {
        if (active) setIsHydrated(true);
      }

      await loadCatalog();
    };

    void initializeStore();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error('Erro ao salvar carrinho:', err);
    }
  }, [cartItems, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (err) {
      console.error('Erro ao salvar pedidos:', err);
    }
  }, [orders, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Erro ao salvar sessão do usuário:', err);
    }
  }, [user, isHydrated]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAddToCart = (
    product: Product,
    size?: number,
    color?: ProductColor,
    quantity: number = 1
  ) => {
    const chosenSize = size || product.sizes[0] || 40;
    const chosenColor = color || product.colors[0] || { name: 'Padrão', hex: '#C92071' };

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor.hex === chosenColor.hex
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          product,
          selectedSize: chosenSize,
          selectedColor: chosenColor,
          quantity,
        },
      ];
    });

    setCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], quantity: newQty };
      return copy;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      categories: [],
      genders: [],
      brands: [],
      conditions: [],
      maxPrice: 1200,
      sortBy: 'relevantes',
    });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('detalhes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyCategory = (category: CategoryType) => {
    setFilters((prev) => ({
      ...prev,
      categories: [category],
    }));
    setActiveTab('produtos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters]
  );

  const trendingProducts = useMemo(
    () => products.filter((p) => p.isTrending),
    [products]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F8] text-[#474747] font-sans antialiased">
      <Header
        activeTab={activeTab === 'detalhes' ? 'produtos' : activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        searchQuery={filters.searchQuery}
        setSearchQuery={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={() => setUser(null)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {catalogError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-red-700">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{catalogError}</span>
            </div>
            <button
              type="button"
              onClick={() => void loadCatalog()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tentar novamente</span>
            </button>
          </div>
        )}

        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <HeroCarousel onExplore={() => setActiveTab('produtos')} />

            {collections.length > 0 && (
              <FeaturedCollections
                collections={collections}
                onSelectCategory={(catName) => handleApplyCategory(catName.toLowerCase() as CategoryType)}
              />
            )}

            <section className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C92071]">
                    Em Alta Agora
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F] tracking-tight">
                    Produtos em Alta
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('produtos')}
                  className="text-xs sm:text-sm font-extrabold text-[#C92071] hover:text-[#991956] flex items-center gap-1 group transition-colors cursor-pointer"
                >
                  <span>Ver todos os produtos</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {isLoadingCatalog ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((skeleton) => (
                    <div
                      key={skeleton}
                      className="h-80 rounded-2xl bg-white border border-gray-100 animate-pulse p-4 space-y-4"
                    >
                      <div className="w-full h-44 bg-gray-100 rounded-xl" />
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                      <div className="h-5 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {trendingProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelectProduct={handleSelectProduct}
                      onAddToCart={(p) => handleAddToCart(p)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'categorias' && (
          <CategoriesView
            totalProductsCount={products.length}
            onSelectCategoryFilter={handleApplyCategory}
            onSelectBrandFilter={(brand) => {
              setFilters((prev) => ({ ...prev, brands: [brand] }));
              setActiveTab('produtos');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectGenderFilter={(gender) => {
              setFilters((prev) => ({ ...prev, genders: [gender] }));
              setActiveTab('produtos');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewAllProducts={() => {
              handleResetFilters();
              setActiveTab('produtos');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'produtos' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C92071]">
                  Catálogo {storeName}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F]">
                  Resultados para &quot;{filters.searchQuery || 'Todos os Produtos'}&quot;
                </h1>
                <span className="text-xs text-gray-500 font-bold">
                  {filteredProducts.length} produtos encontrados
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden bg-white border border-gray-200 text-gray-700 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#C92071]" />
                  <span>Filtros</span>
                </button>

                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 shadow-2xs">
                  <label htmlFor="sort-products" className="text-gray-400 shrink-0">
                    Ordenar por:
                  </label>
                  <select
                    id="sort-products"
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value as FilterState['sortBy'],
                      }))
                    }
                    className="bg-transparent font-bold text-[#1F1F1F] focus:outline-hidden cursor-pointer"
                  >
                    <option value="relevantes">Mais relevantes</option>
                    <option value="menor_preco">Menor preço</option>
                    <option value="maior_preco">Maior preço</option>
                    <option value="mais_vendidos">Mais vendidos</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="hidden lg:block lg:col-span-3 sticky top-24">
                <FilterGroup
                  filters={filters}
                  setFilters={setFilters}
                  onResetFilters={handleResetFilters}
                />
              </div>

              {mobileFilterOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
                  <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <h3 className="font-extrabold text-base">Filtros de Busca</h3>
                      <button
                        type="button"
                        onClick={() => setMobileFilterOpen(false)}
                        className="text-gray-400 text-sm font-bold cursor-pointer"
                      >
                        Fechar ✕
                      </button>
                    </div>
                    <FilterGroup
                      filters={filters}
                      setFilters={setFilters}
                      onResetFilters={handleResetFilters}
                    />
                  </div>
                </div>
              )}

              <div className="lg:col-span-9 space-y-6">
                {isLoadingCatalog ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((skeleton) => (
                      <div
                        key={skeleton}
                        className="h-80 rounded-2xl bg-white border border-gray-100 animate-pulse p-4 space-y-4"
                      >
                        <div className="w-full h-44 bg-gray-100 rounded-xl" />
                        <div className="h-4 bg-gray-100 rounded w-2/3" />
                        <div className="h-5 bg-gray-100 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4 shadow-xs">
                    <div className="w-16 h-16 bg-[#FFEAEF] text-[#C92071] rounded-full flex items-center justify-center mx-auto">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Nenhum produto encontrado com estes filtros
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Tente desmarcar algumas opções de filtro ou buscar por termos mais genéricos.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="bg-[#C92071] text-white font-bold text-xs py-2.5 px-5 rounded-xl hover:bg-[#991956] transition-colors cursor-pointer"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onSelectProduct={handleSelectProduct}
                        onAddToCart={(p) => handleAddToCart(p)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'detalhes' && selectedProduct && (
          <ProductDetailView
            key={selectedProduct.id}
            product={selectedProduct}
            relatedProducts={products.filter((p) => p.id !== selectedProduct.id).slice(0, 4)}
            onBack={() => setActiveTab('produtos')}
            onAddToCart={(p, s, c, q) => handleAddToCart(p, s, c, q)}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeTab === 'pedidos' && (
          <OrdersView
            orders={orders}
            onExploreProducts={() => setActiveTab('produtos')}
          />
        )}
      </main>

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(u) => {
          setUser(u);
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={(couponCode) => {
          setCheckoutCouponCode(couponCode);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        currentUser={user}
        appliedCouponCode={checkoutCouponCode}
        onOrderSuccess={(newOrder) => {
          setOrders((prev) => [newOrder, ...prev]);
          setCartItems([]);
          setCheckoutCouponCode(undefined);
          setActiveTab('pedidos');
        }}
      />

      <Footer
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={handleApplyCategory}
      />
    </div>
  );
}

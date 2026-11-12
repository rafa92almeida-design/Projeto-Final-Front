'use client';

import React, { useState } from 'react';
import { Product, ProductColor } from '@/types';
import { ProductGallery } from './ProductGallery';
import { SizeSelector } from './SizeSelector';
import { ColorSelector } from './ColorSelector';
import { ProductCard } from './ProductCard';
import { getFreeShippingThreshold } from '@/lib/store-helpers';
import { Star, ShoppingBag, ShieldCheck, Truck, RotateCcw, ArrowLeft, Heart } from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, size: number, color: ProductColor, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  relatedProducts,
  onBack,
  onAddToCart,
  onSelectProduct,
}) => {
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[0] || 40);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Padrão', hex: '#C92071' }
  );
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const freeShippingThreshold = getFreeShippingThreshold();

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

  const handleBuy = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-extrabold text-gray-600 hover:text-[#C92071] transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Voltar para Produtos</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C92071]">
                {product.brand} · {product.category}
              </span>
              <span className="text-[11px] font-mono text-gray-400">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1F1F1F] leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 text-xs pt-1">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span className="text-gray-400">({product.reviewsCount} avaliações)</span>
            </div>
          </div>

          <div className="bg-[#F8F8F8] p-4 rounded-2xl flex items-baseline justify-between border border-gray-100">
            <div>
              <span className="text-xs text-gray-400 block font-medium">Preço à vista no PIX</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#1F1F1F]">{formattedPrice}</span>
                {formattedOriginalPrice && (
                  <span className="text-sm text-gray-400 line-through font-semibold">
                    {formattedOriginalPrice}
                  </span>
                )}
              </div>
            </div>

            {product.discountPercentage && (
              <span className="bg-[#E7FF86] text-[#1F1F1F] text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-2xs">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          <ColorSelector
            availableColors={product.colors}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />

          <SizeSelector
            availableSizes={product.sizes}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
          />

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl bg-[#F8F8F8] p-1">
                <button
                  type="button"
                  aria-label="Diminuir quantidade"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-sm font-bold text-gray-600 hover:text-[#C92071] cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-sm font-black text-gray-800">{quantity}</span>
                <button
                  type="button"
                  aria-label="Aumentar quantidade"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-sm font-bold text-gray-600 hover:text-[#C92071] cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuy}
                className="flex-1 bg-[#C92071] hover:bg-[#991956] text-white font-extrabold text-sm sm:text-base py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Comprar Agora</span>
              </button>

              <button
                type="button"
                aria-label="Salvar nos favoritos"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-gray-200 text-gray-400 hover:text-gray-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {addedToast && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2 border border-emerald-200 animate-in fade-in">
                <span>✓ Produto adicionado ao carrinho com sucesso!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C92071] shrink-0" />
              <span>Frete Grátis acima de R$ {freeShippingThreshold}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#C92071] shrink-0" />
              <span>Troca grátis em até 30 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C92071] shrink-0" />
              <span>Garantia de Autenticidade Drip</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
              Descrição do Produto
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C92071]">
                Você Também Pode Gostar
              </span>
              <h2 className="text-2xl font-extrabold text-[#1F1F1F]">
                Produtos Relacionados
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProd) => (
              <ProductCard
                key={relProd.id}
                product={relProd}
                onSelectProduct={onSelectProduct}
                onAddToCart={(p) => onAddToCart(p, p.sizes[0] || 40, p.colors[0], 1)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

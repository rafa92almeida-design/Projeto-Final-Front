'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CartItem } from '@/types';
import { calculateCartTotals } from '@/lib/store-helpers';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck, Tag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: (couponCode?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const {
    subtotal,
    discount,
    shipping,
    total,
    freeShippingProgress,
    remainingForFreeShipping,
  } = calculateCartTotals(cartItems, appliedCoupon?.code);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'DRIP30') {
      setAppliedCoupon({ code: 'DRIP30', discount: 30.0 });
      setCouponError('');
    } else {
      setCouponError('Cupom inválido. Tente DRIP30');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Meu Carrinho"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#F8F8F8]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C92071]" />
              <h2 className="text-lg font-black text-[#1F1F1F]">Meu Carrinho</h2>
              <span className="text-xs bg-[#C92071] text-white font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar carrinho"
              className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-[#FFEAEF] p-4 text-xs">
            <div className="flex items-center justify-between text-[#C92071] font-bold mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                {remainingForFreeShipping === 0 && subtotal > 0 ? (
                  <span>
                    <strong>Parabéns!</strong> Você ganhou Frete Grátis!
                  </span>
                ) : (
                  <span>
                    Faltam <strong>R$ {remainingForFreeShipping.toFixed(2)}</strong> para Frete Grátis
                  </span>
                )}
              </span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C92071] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-gray-100">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-gray-800">
                    Seu carrinho está vazio
                  </h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Explore nosso catálogo e encontre os melhores sneakers e roupas streetwear!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#C92071] text-white font-bold text-xs py-3 px-6 rounded-xl hover:bg-[#991956] transition-colors cursor-pointer"
                >
                  Ir para Produtos
                </button>
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0 flex gap-4 items-center">
                  <div className="relative w-20 h-20 bg-[#F5F5F5] rounded-xl overflow-hidden p-1 shrink-0 border border-gray-100">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      referrerPolicy="no-referrer"
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400">
                      {item.product.brand}
                    </span>
                    <h4 className="text-xs font-bold text-[#1F1F1F] line-clamp-1">
                      {item.product.name}
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <span>
                        Tam: <strong>{item.selectedSize}</strong>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        Cor:
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-gray-300"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          aria-label={`Diminuir quantidade de ${item.product.name}`}
                          className="p-1 hover:text-[#C92071] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          aria-label={`Aumentar quantidade de ${item.product.name}`}
                          className="p-1 hover:text-[#C92071] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-extrabold text-[#1F1F1F]">
                        R$ {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(idx)}
                    aria-label={`Remover ${item.product.name} do carrinho`}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-gray-100 space-y-4 shadow-lg">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cupom de desconto (DRIP30)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-[#F5F5F5] text-xs font-bold py-2.5 pl-9 pr-3 rounded-lg border border-transparent focus:border-[#C92071] focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1F1F1F] hover:bg-[#C92071] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Aplicar
                </button>
              </form>
              {couponError && <p className="text-[11px] text-red-500 font-bold">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  ✓ Cupom {appliedCoupon.code} aplicado (-R$ {discount.toFixed(2)})
                </p>
              )}

              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">R$ {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Desconto Cupom</span>
                    <span>-R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="font-bold text-emerald-600">
                    {shipping === 0 ? 'GRÁTIS' : `R$ ${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#1F1F1F] pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#C92071]">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout(appliedCoupon?.code);
                }}
                className="w-full bg-[#C92071] hover:bg-[#991956] text-white font-black text-sm py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

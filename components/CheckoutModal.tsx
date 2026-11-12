'use client';

import React, { useState } from 'react';
import { CartItem, Order, UserProfile } from '@/types';
import { createOrder } from '@/lib/api';
import { calculateCartTotals } from '@/lib/store-helpers';
import {
  X,
  CheckCircle2,
  QrCode,
  CreditCard,
  FileText,
  Lock,
  AlertCircle,
  Check,
  Copy,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentUser?: UserProfile | null;
  appliedCouponCode?: string;
  onOrderSuccess: (newOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentUser,
  appliedCouponCode,
  onOrderSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('PIX');
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    cpf: currentUser?.cpf || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);
  const [pixCode, setPixCode] = useState('');
  const [pixCopied, setPixCopied] = useState(false);

  const [prevState, setPrevState] = useState({ isOpen, currentUser });
  if (isOpen !== prevState.isOpen || currentUser !== prevState.currentUser) {
    setPrevState({ isOpen, currentUser });
    if (isOpen) {
      setOrderComplete(null);
      setPixCode('');
      setPixCopied(false);
      setSubmitError('');
      if (currentUser) {
        setFormData((prev) => ({
          name: currentUser.name || prev.name,
          email: currentUser.email || prev.email,
          cpf: currentUser.cpf || prev.cpf,
          phone: currentUser.phone || prev.phone,
          address: currentUser.address || prev.address,
        }));
      }
    }
  }

  if (!isOpen) return null;

  const { subtotal, discount, shipping, total } = calculateCartTotals(cartItems, appliedCouponCode);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCopyPix = async () => {
    if (!pixCode) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(pixCode);
        setPixCopied(true);
        return;
      }
    } catch {
      // Fallback handled below when clipboard permission is unavailable
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = pixCode;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setPixCopied(true);
    } catch (err) {
      console.error('Erro ao copiar código PIX:', err);
    }
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await createOrder({
        customerName: formData.name,
        customerEmail: formData.email,
        customerCpf: formData.cpf,
        customerPhone: formData.phone,
        address: formData.address,
        paymentMethod,
        items: cartItems,
        couponCode: appliedCouponCode,
      });

      setOrderComplete(response.order);
      setPixCode(response.pixCode || '');
      onOrderSuccess(response.order);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Não foi possível concluir o pedido.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Finalizar Pedido"
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 my-8"
      >
        <div className="p-6 bg-[#1F1F1F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#C92071]" />
            <h2 className="text-lg font-black tracking-tight">Finalizar Pedido</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de checkout"
            className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderComplete ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#C92071] uppercase tracking-wider block">
                Pedido Realizado com Sucesso!
              </span>
              <h3 className="text-2xl font-black text-[#1F1F1F]">
                Nº do Pedido: {orderComplete.id}
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Os detalhes da confirmação e o código de rastreio <strong>{orderComplete.trackingCode}</strong> foram vinculados ao e-mail <strong>{formData.email}</strong>.
              </p>
            </div>

            {paymentMethod === 'PIX' && pixCode && (
              <div className="bg-[#F8F8F8] p-4 rounded-2xl max-w-sm mx-auto border border-gray-200 space-y-2">
                <span className="text-xs font-bold text-gray-700 block">
                  Chave PIX Copia e Cola
                </span>
                <div className="bg-white p-2 text-[10px] font-mono break-all text-gray-600 rounded border border-gray-200">
                  {pixCode}
                </div>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="w-full bg-[#1F1F1F] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#C92071] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {pixCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Código PIX Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Código PIX</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-[#C92071] hover:bg-[#991956] text-white font-extrabold text-sm py-3 px-8 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Acompanhar em Meus Pedidos
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirmOrder} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {submitError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-[#1F1F1F] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C92071] text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Dados Pessoais e Entrega
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label htmlFor="chk-name" className="font-bold text-gray-600 block mb-1">
                    Nome Completo *
                  </label>
                  <input
                    id="chk-name"
                    type="text"
                    name="name"
                    required
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="chk-email" className="font-bold text-gray-600 block mb-1">
                    E-mail *
                  </label>
                  <input
                    id="chk-email"
                    type="email"
                    name="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="chk-cpf" className="font-bold text-gray-600 block mb-1">
                    CPF *
                  </label>
                  <input
                    id="chk-cpf"
                    type="text"
                    name="cpf"
                    required
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="chk-phone" className="font-bold text-gray-600 block mb-1">
                    Telefone *
                  </label>
                  <input
                    id="chk-phone"
                    type="text"
                    name="phone"
                    required
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="chk-address" className="font-bold text-gray-600 block mb-1">
                    Endereço de Entrega *
                  </label>
                  <input
                    id="chk-address"
                    type="text"
                    name="address"
                    required
                    placeholder="Rua, número, complemento, bairro, cidade - UF, CEP"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-[#F8F8F8] focus:bg-white focus:border-[#C92071] focus:outline-hidden font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-extrabold text-[#1F1F1F] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C92071] text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Forma de Pagamento
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { id: 'PIX', label: 'PIX', icon: QrCode },
                    { id: 'Cartão de Crédito', label: 'Cartão 10x', icon: CreditCard },
                    { id: 'Boleto', label: 'Boleto', icon: FileText },
                  ] as const
                ).map((pm) => {
                  const IconComp = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      type="button"
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#C92071] bg-[#FFEAEF] text-[#C92071] shadow-xs'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#F8F8F8] p-4 rounded-2xl space-y-2 text-xs border border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Itens ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}):</span>
                <span className="font-bold">R$ {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Desconto Cupom ({appliedCouponCode}):</span>
                  <span>-R$ {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Frete:</span>
                <span className={`font-bold ${shipping === 0 ? 'text-emerald-600' : ''}`}>
                  {shipping === 0 ? 'GRÁTIS' : `R$ ${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#1F1F1F] pt-2 border-t border-gray-300">
                <span>Total a pagar:</span>
                <span className="text-[#C92071]">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full bg-[#C92071] hover:bg-[#991956] text-white font-black text-base py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Processando Pedido...' : `Confirmar Compra (R$ ${total.toFixed(2)})`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

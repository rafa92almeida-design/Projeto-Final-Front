'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Order } from '@/types';
import { Package, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onExploreProducts: () => void;
}

const ORDER_STAGES = [
  { step: 1, label: 'Recebido' },
  { step: 2, label: 'Em Separação' },
  { step: 3, label: 'A caminho' },
  { step: 4, label: 'Entregue' },
];

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onExploreProducts }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C92071]">
            Histórico de Compras
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F]">Meus Pedidos</h1>
        </div>
        <button
          type="button"
          onClick={onExploreProducts}
          className="bg-[#1F1F1F] hover:bg-[#C92071] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors shrink-0 cursor-pointer"
        >
          Continuar Comprando
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-[#FFEAEF] text-[#C92071] rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Você ainda não possui pedidos</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Encontre os tênis e lançamentos mais quentes do mercado no nosso catálogo!
          </p>
          <button
            type="button"
            onClick={onExploreProducts}
            className="bg-[#C92071] text-white font-bold text-xs py-3 px-6 rounded-xl hover:bg-[#991956] transition-colors cursor-pointer"
          >
            Ver Catálogo
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const currentStageLabel =
              ORDER_STAGES.find((stage) => stage.step === order.statusStep)?.label || order.status;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[#1F1F1F]">{order.id}</span>
                      <span className="text-[11px] bg-emerald-100 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full">
                        {order.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 block">
                      Realizado em {order.date} · Pagamento via {order.paymentMethod}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Total do Pedido</span>
                    <span className="text-lg font-black text-[#C92071]">
                      R$ {order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase text-gray-400 block">
                    Status de Rastreamento
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
                    {ORDER_STAGES.map((st) => {
                      const isDone = order.statusStep >= st.step;
                      return (
                        <div key={st.step} className="space-y-1">
                          <div
                            className={`h-2 rounded-full transition-colors ${
                              isDone ? 'bg-[#C92071]' : 'bg-gray-200'
                            }`}
                          />
                          <span className={isDone ? 'text-[#C92071]' : 'text-gray-400'}>
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-extrabold uppercase text-gray-500 block">
                    Itens do Pedido ({order.items.length})
                  </span>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-[#F8F8F8] p-3 rounded-2xl">
                        <div className="relative w-14 h-14 bg-white rounded-xl p-1 overflow-hidden shrink-0 border border-gray-200">
                          <Image
                            src={item.image}
                            alt={item.productName}
                            fill
                            sizes="56px"
                            referrerPolicy="no-referrer"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#1F1F1F] truncate">
                            {item.productName}
                          </h4>
                          <span className="text-[11px] text-gray-500 block">
                            Tamanho: <strong>{item.size}</strong> · Cor: <strong>{item.colorName}</strong> · Qtd: {item.quantity}
                          </span>
                        </div>
                        <span className="text-xs font-black text-gray-800 shrink-0">
                          R$ {item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#C92071] shrink-0" />
                      <span className="line-clamp-1">{order.address}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono bg-gray-100 px-2.5 py-1 rounded text-[11px] font-bold text-gray-700">
                        Rastreio: {order.trackingCode}
                      </span>
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="text-[#C92071] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Ocultar' : 'Rastrear'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-[#F8F8F8] rounded-2xl p-3.5 text-xs text-gray-600 border border-gray-200 space-y-1">
                      <p className="font-bold text-[#1F1F1F]">
                        Etapa atual: {currentStageLabel}
                      </p>
                      <p>
                        Código de postagem: <span className="font-mono font-bold">{order.trackingCode}</span>
                      </p>
                      <p>Destino: {order.address}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

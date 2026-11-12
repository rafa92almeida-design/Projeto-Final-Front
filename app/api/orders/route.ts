import { NextRequest, NextResponse } from 'next/server';
import { calculateCartTotals } from '@/lib/store-helpers';
import { CreateOrderPayload, Order } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<CreateOrderPayload>;
    const externalApiUrl = process.env.STORE_API_URL?.replace(/\/$/, '');

    if (externalApiUrl) {
      const upstream = await fetch(`${externalApiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await upstream.json();
      return NextResponse.json(data, { status: upstream.status });
    }

    const {
      customerName = '',
      customerEmail = '',
      customerCpf = '',
      customerPhone = '',
      address = '',
      paymentMethod,
      items = [],
      couponCode,
    } = body;

    if (
      !customerName.trim() ||
      !customerEmail.trim() ||
      !customerCpf.trim() ||
      !customerPhone.trim() ||
      !address.trim() ||
      !paymentMethod ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: 'Dados incompletos para finalizar o pedido.' },
        { status: 400 }
      );
    }

    const { total } = calculateCartTotals(items, couponCode);
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const currentYear = new Date().getFullYear();
    const orderId = `ORD-${currentYear}-${orderNumber}`;
    const trackingCode = `BR${orderNumber}${String(Date.now()).slice(-4)}SP`;

    const order: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      status: 'Aprovado',
      statusStep: 2,
      totalAmount: Number(total.toFixed(2)),
      paymentMethod,
      trackingCode,
      address: address.trim(),
      items: items.map((ci) => ({
        productName: ci.product.name,
        brand: ci.product.brand,
        size: ci.selectedSize,
        colorName: ci.selectedColor.name,
        price: ci.product.price,
        quantity: ci.quantity,
        image: ci.product.images[0],
      })),
    };

    const pixCode =
      paymentMethod === 'PIX'
        ? `00020126580014BR.GOV.BCB.PIX0136${orderId.toLowerCase()}@digitalstore5204000053039865802BR`
        : undefined;

    return NextResponse.json({ order, pixCode }, { status: 201 });
  } catch (error) {
    console.error('Erro na rota POST /api/orders:', error);
    return NextResponse.json(
      { error: 'Não foi possível processar o pedido no momento.' },
      { status: 500 }
    );
  }
}

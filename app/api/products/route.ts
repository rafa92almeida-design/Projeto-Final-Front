import { NextResponse } from 'next/server';
import { STORE_PRODUCTS } from '@/lib/catalog';

export async function GET() {
  try {
    const externalApiUrl = process.env.STORE_API_URL?.replace(/\/$/, '');

    if (externalApiUrl) {
      const upstream = await fetch(`${externalApiUrl}/products`, { cache: 'no-store' });
      if (!upstream.ok) {
        throw new Error(`Upstream products request failed with ${upstream.status}`);
      }
      const data = await upstream.json();
      return NextResponse.json(data);
    }

    return NextResponse.json(STORE_PRODUCTS);
  } catch (error) {
    console.error('Erro na rota GET /api/products:', error);
    return NextResponse.json(
      { error: 'Não foi possível carregar o catálogo de produtos.' },
      { status: 500 }
    );
  }
}

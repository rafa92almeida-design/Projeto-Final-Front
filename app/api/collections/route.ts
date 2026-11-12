import { NextResponse } from 'next/server';
import { STORE_COLLECTIONS } from '@/lib/catalog';

export async function GET() {
  try {
    const externalApiUrl = process.env.STORE_API_URL?.replace(/\/$/, '');

    if (externalApiUrl) {
      const upstream = await fetch(`${externalApiUrl}/collections`, { cache: 'no-store' });
      if (!upstream.ok) {
        throw new Error(`Upstream collections request failed with ${upstream.status}`);
      }
      const data = await upstream.json();
      return NextResponse.json(data);
    }

    return NextResponse.json(STORE_COLLECTIONS);
  } catch (error) {
    console.error('Erro na rota GET /api/collections:', error);
    return NextResponse.json(
      { error: 'Não foi possível carregar as coleções.' },
      { status: 500 }
    );
  }
}

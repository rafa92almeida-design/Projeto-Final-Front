import { NextRequest, NextResponse } from 'next/server';
import { buildFullAddress } from '@/lib/store-helpers';
import { LoginPayload, RegisterPayload, UserProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<LoginPayload | RegisterPayload>;
    const externalApiUrl = process.env.STORE_API_URL?.replace(/\/$/, '');

    if (externalApiUrl) {
      const upstream = await fetch(`${externalApiUrl}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await upstream.json();
      return NextResponse.json(data, { status: upstream.status });
    }

    if (body.action === 'login') {
      const identifier = body.identifier?.trim() || '';
      const password = body.password || '';

      if (!identifier || password.length < 6) {
        return NextResponse.json(
          { error: 'Informe seu e-mail/CPF e uma senha com pelo menos 6 caracteres.' },
          { status: 400 }
        );
      }

      const displayName = identifier.includes('@')
        ? identifier.split('@')[0]
        : `Cliente ${identifier.slice(-4)}`;

      const user: UserProfile = {
        name: displayName,
        email: identifier.includes('@') ? identifier : '',
      };

      return NextResponse.json({ user }, { status: 200 });
    }

    if (body.action === 'register') {
      const {
        name = '',
        email = '',
        cpf = '',
        phone = '',
        password = '',
        zipCode = '',
        street = '',
        number = '',
        complement = '',
        neighborhood = '',
        city = '',
        state = '',
      } = body as Partial<RegisterPayload>;

      if (
        !name.trim() ||
        !email.trim() ||
        !cpf.trim() ||
        !phone.trim() ||
        password.length < 6 ||
        !zipCode.trim() ||
        !street.trim() ||
        !number.trim() ||
        !neighborhood.trim() ||
        !city.trim() ||
        !state.trim()
      ) {
        return NextResponse.json(
          { error: 'Preencha todos os campos obrigatórios e uma senha de no mínimo 6 caracteres.' },
          { status: 400 }
        );
      }

      const user: UserProfile = {
        name: name.trim(),
        email: email.trim(),
        cpf: cpf.trim(),
        phone: phone.trim(),
        address: buildFullAddress({
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
          zipCode,
        }),
      };

      return NextResponse.json({ user }, { status: 201 });
    }

    return NextResponse.json({ error: 'Ação de autenticação inválida.' }, { status: 400 });
  } catch (error) {
    console.error('Erro na rota POST /api/auth:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar autenticação.' },
      { status: 500 }
    );
  }
}

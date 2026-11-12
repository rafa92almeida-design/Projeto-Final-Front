import {
  CollectionCard,
  CreateOrderPayload,
  CreateOrderResponse,
  LoginPayload,
  Product,
  RegisterPayload,
  UserProfile,
} from '@/types';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
const VIACEP_BASE = (process.env.NEXT_PUBLIC_VIACEP_URL || 'https://viacep.com.br/ws').replace(/\/$/, '');

export interface ViaCepAddress {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE}/api/products`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Erro ao carregar produtos (${response.status})`);
    }
    return (await response.json()) as Product[];
  } catch (error) {
    console.error('Falha ao buscar catálogo de produtos:', error);
    throw error;
  }
}

export async function fetchCollections(): Promise<CollectionCard[]> {
  try {
    const response = await fetch(`${API_BASE}/api/collections`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Erro ao carregar coleções (${response.status})`);
    }
    return (await response.json()) as CollectionCard[];
  } catch (error) {
    console.error('Falha ao buscar coleções em destaque:', error);
    throw error;
  }
}

export async function lookupAddressByCep(cep: string): Promise<ViaCepAddress> {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    throw new Error('Informe um CEP válido com 8 dígitos.');
  }

  try {
    const response = await fetch(`${VIACEP_BASE}/${cleanCep}/json/`);
    if (!response.ok) {
      throw new Error(`Erro ao consultar CEP (${response.status})`);
    }
    const data = (await response.json()) as ViaCepAddress;
    if (data.erro) {
      throw new Error('CEP não encontrado. Preencha os campos abaixo manualmente.');
    }
    return data;
  } catch (error) {
    console.error('Falha na consulta de CEP:', error);
    throw error;
  }
}

export async function authenticateUser(
  payload: LoginPayload | RegisterPayload
): Promise<UserProfile> {
  try {
    const response = await fetch(`${API_BASE}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as { user?: UserProfile; error?: string };
    if (!response.ok || !data.user) {
      throw new Error(data.error || 'Não foi possível concluir a autenticação.');
    }
    return data.user;
  } catch (error) {
    console.error('Falha na autenticação do usuário:', error);
    throw error;
  }
}

export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as Partial<CreateOrderResponse> & { error?: string };
    if (!response.ok || !data.order) {
      throw new Error(data.error || 'Não foi possível registrar o pedido.');
    }
    return data as CreateOrderResponse;
  } catch (error) {
    console.error('Falha ao registrar pedido:', error);
    throw error;
  }
}

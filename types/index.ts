export type CategoryType = 'esporte' | 'casual' | 'utilitario' | 'corrida' | 'basquete';
export type GenderType = 'masculino' | 'feminino' | 'unissex';
export type BrandType = 'Nike' | 'Adidas' | 'Puma' | 'Jordan' | 'New Balance';
export type ConditionType = 'novo' | 'seminovo';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  brand: BrandType;
  category: CategoryType;
  gender: GenderType;
  condition: ConditionType;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  isTrending?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewsCount: number;
  description: string;
  images: string[];
  sizes: number[];
  colors: ProductColor[];
  inStock: boolean;
  sku: string;
}

export interface CartItem {
  product: Product;
  selectedSize: number;
  selectedColor: ProductColor;
  quantity: number;
}

export interface FilterState {
  searchQuery: string;
  categories: CategoryType[];
  genders: GenderType[];
  brands: BrandType[];
  conditions: ConditionType[];
  maxPrice: number;
  sortBy: 'relevantes' | 'menor_preco' | 'maior_preco' | 'mais_vendidos';
}

export interface CollectionCard {
  id: string;
  title: string;
  discount: string;
  category: CategoryType | string;
  image: string;
  bgGradient: string;
}

export interface OrderItem {
  productName: string;
  brand: string;
  size: number;
  colorName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Aprovado' | 'Em Transito' | 'Entregue' | 'Cancelado';
  statusStep: number;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Boleto';
  trackingCode: string;
  address: string;
}

export interface UserProfile {
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  address?: string;
}

export interface LoginPayload {
  action: 'login';
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  action: 'register';
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerCpf: string;
  customerPhone: string;
  address: string;
  paymentMethod: Order['paymentMethod'];
  items: CartItem[];
  couponCode?: string;
}

export interface CreateOrderResponse {
  order: Order;
  pixCode?: string;
}

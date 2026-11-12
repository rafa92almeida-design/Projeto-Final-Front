import { CartItem, FilterState, Product } from '@/types';

export const DEFAULT_SHIPPING_FEE = 19.9;
export const DRIP30_DISCOUNT = 30.0;

export function getFreeShippingThreshold(): number {
  const parsed = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 299;
}

export function getStoreName(): string {
  return process.env.NEXT_PUBLIC_STORE_NAME || 'Digital Store';
}

export function formatCurrencyBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function calculateCartTotals(
  cartItems: CartItem[],
  couponCode?: string,
  threshold: number = getFreeShippingThreshold()
) {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const normalizedCoupon = couponCode?.trim().toUpperCase();
  const discount = normalizedCoupon === 'DRIP30' && subtotal > 0 ? DRIP30_DISCOUNT : 0;
  const remainingForFreeShipping = Math.max(0, threshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / threshold) * 100);
  const shipping = subtotal > 0 && remainingForFreeShipping > 0 ? DEFAULT_SHIPPING_FEE : 0;
  const total = Math.max(0, subtotal - discount) + shipping;

  return {
    subtotal,
    discount,
    shipping,
    total,
    freeShippingThreshold: threshold,
    remainingForFreeShipping,
    freeShippingProgress,
  };
}

export function filterAndSortProducts(products: Product[], filters: FilterState): Product[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return products
    .filter((prod) => {
      if (
        query &&
        !prod.name.toLowerCase().includes(query) &&
        !prod.brand.toLowerCase().includes(query) &&
        !prod.category.toLowerCase().includes(query)
      ) {
        return false;
      }

      if (filters.categories.length > 0 && !filters.categories.includes(prod.category)) {
        return false;
      }

      if (filters.genders.length > 0 && !filters.genders.includes(prod.gender)) {
        return false;
      }

      if (filters.brands.length > 0 && !filters.brands.includes(prod.brand)) {
        return false;
      }

      if (filters.conditions.length > 0 && !filters.conditions.includes(prod.condition)) {
        return false;
      }

      if (prod.price > filters.maxPrice) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'menor_preco') return a.price - b.price;
      if (filters.sortBy === 'maior_preco') return b.price - a.price;
      if (filters.sortBy === 'mais_vendidos') return b.reviewsCount - a.reviewsCount;
      return 0;
    });
}

export function buildFullAddress(fields: {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode?: string;
}): string {
  const complementPart = fields.complement?.trim() ? ` (${fields.complement.trim()})` : '';
  const zipPart = fields.zipCode?.trim() ? ` - CEP ${fields.zipCode.trim()}` : '';
  return `${fields.street.trim()}, ${fields.number.trim()}${complementPart} - ${fields.neighborhood.trim()}, ${fields.city.trim()} - ${fields.state.trim().toUpperCase()}${zipPart}`;
}

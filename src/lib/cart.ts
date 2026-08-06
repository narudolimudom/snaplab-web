import 'server-only';
import { apiFetch } from './api';
import type { Cart } from './cart-types';

export function getCart(accessToken: string) {
  return apiFetch<Cart>('/cart', { accessToken });
}

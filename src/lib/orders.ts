import 'server-only';
import { apiFetch } from './api';
import type { OrderDetail, OrderSummary } from './order-types';

export function getOrders(accessToken: string) {
  return apiFetch<OrderSummary[]>('/orders', { accessToken });
}

export function getOrderById(id: string, accessToken: string) {
  return apiFetch<OrderDetail>(`/orders/${id}`, { accessToken });
}

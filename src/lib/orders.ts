import 'server-only';
import { apiFetch } from './api';
import type { OrderDetail, OrderStatus, OrderSummary } from './order-types';

export function getOrders(accessToken: string) {
  return apiFetch<OrderSummary[]>('/orders', { accessToken });
}

export function getOrderById(id: string, accessToken: string) {
  return apiFetch<OrderDetail>(`/orders/${id}`, { accessToken });
}

export function getAdminOrders(accessToken: string, status?: OrderStatus) {
  const qs = status ? `?status=${status}` : '';
  return apiFetch<OrderSummary[]>(`/admin/orders${qs}`, { accessToken });
}

export function getAdminOrderById(id: string, accessToken: string) {
  return apiFetch<OrderDetail>(`/admin/orders/${id}`, { accessToken });
}

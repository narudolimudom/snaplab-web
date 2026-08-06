import 'server-only';
import { apiFetch } from './api';
import type {
  AdminPaymentSlipDetail,
  AdminPaymentSlipListItem,
} from './payment-slip-types';
import type { PaymentSlipStatus } from './order-types';

export function getAdminPaymentSlips(
  accessToken: string,
  status?: PaymentSlipStatus,
) {
  const qs = status ? `?status=${status}` : '';
  return apiFetch<AdminPaymentSlipListItem[]>(`/admin/payment-slips${qs}`, {
    accessToken,
  });
}

export function getAdminPaymentSlipById(id: string, accessToken: string) {
  return apiFetch<AdminPaymentSlipDetail>(`/admin/payment-slips/${id}`, {
    accessToken,
  });
}

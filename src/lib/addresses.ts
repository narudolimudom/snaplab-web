import 'server-only';
import { apiFetch } from './api';
import type { Address } from './address-types';

export function getAddresses(accessToken: string) {
  return apiFetch<Address[]>('/addresses', { accessToken });
}

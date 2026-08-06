'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api';
import { requireAdminAccessToken, requireUserAccessToken } from '@/lib/dal';
import { getLocale } from '@/lib/get-locale';

export type CreateOrderState = { message?: string } | undefined;

export async function createOrderAction(
  _state: CreateOrderState,
  formData: FormData,
): Promise<CreateOrderState> {
  const accessToken = await requireUserAccessToken();

  const addressId = formData.get('addressId');
  if (!addressId || typeof addressId !== 'string') {
    return { message: 'กรุณาเลือกที่อยู่จัดส่ง' };
  }

  let order: { id: string };
  try {
    order = await apiFetch<{ id: string }>('/orders', {
      method: 'POST',
      accessToken,
      body: JSON.stringify({ addressId }),
    });
  } catch (err) {
    return {
      message: err instanceof ApiError ? err.message : 'สร้างคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
    };
  }

  revalidatePath('/', 'layout');
  const locale = await getLocale();
  redirect(`/${locale}/orders/${order.id}/confirmation`);
}

export async function updateOrderStatusAction(
  orderId: string,
  status: 'shipped' | 'completed',
) {
  const accessToken = await requireAdminAccessToken();
  await apiFetch(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify({ status }),
  });
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
}

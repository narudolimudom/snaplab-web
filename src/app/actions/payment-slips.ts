'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api';
import { requireAdminAccessToken, requireUserAccessToken } from '@/lib/dal';
import { getLocale } from '@/lib/get-locale';

export async function uploadSlipAction(orderId: string, formData: FormData) {
  const accessToken = await requireUserAccessToken();
  const file = formData.get('file');

  if (!(file instanceof File) || file.size === 0) {
    return { error: 'กรุณาเลือกไฟล์รูปสลิป' };
  }

  const uploadBody = new FormData();
  uploadBody.set('file', file);

  try {
    await apiFetch(`/orders/${orderId}/slip`, {
      method: 'POST',
      accessToken,
      body: uploadBody,
    });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : 'อัปโหลดสลิปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
    };
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/orders/${orderId}/confirmation`);
  revalidatePath(`/${locale}/account/orders`);
  return { success: true };
}

export async function approveSlipAction(slipId: string) {
  const accessToken = await requireAdminAccessToken();
  await apiFetch(`/admin/payment-slips/${slipId}/approve`, {
    method: 'PATCH',
    accessToken,
  });
  revalidatePath('/admin/payment-slips');
}

export async function rejectSlipAction(slipId: string, formData: FormData) {
  const accessToken = await requireAdminAccessToken();
  const reason = String(formData.get('reason') ?? '').trim();
  if (!reason) return;

  await apiFetch(`/admin/payment-slips/${slipId}/reject`, {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify({ reason }),
  });
  revalidatePath('/admin/payment-slips');
}

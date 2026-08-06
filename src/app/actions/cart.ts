'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api';
import { requireUserAccessToken } from '@/lib/dal';

export type AddToCartState = { error?: string; success?: boolean } | undefined;

export async function addToCartAction(
  productVariantId: string,
  _state: AddToCartState,
  formData: FormData,
): Promise<AddToCartState> {
  const accessToken = await requireUserAccessToken();
  const quantity = Number(formData.get('quantity') ?? 1) || 1;

  try {
    await apiFetch('/cart/items', {
      method: 'POST',
      accessToken,
      body: JSON.stringify({ productVariantId, quantity }),
    });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
    };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function updateCartItemAction(itemId: string, quantity: number) {
  const accessToken = await requireUserAccessToken();
  await apiFetch(`/cart/items/${itemId}`, {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify({ quantity }),
  });
  revalidatePath('/', 'layout');
}

export async function removeCartItemAction(itemId: string) {
  const accessToken = await requireUserAccessToken();
  await apiFetch(`/cart/items/${itemId}`, {
    method: 'DELETE',
    accessToken,
  });
  revalidatePath('/', 'layout');
}

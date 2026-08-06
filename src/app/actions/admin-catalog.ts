'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { apiFetch, ApiError } from '@/lib/api';
import { requireAdminAccessToken } from '@/lib/dal';

function fieldErrorState(error: z.ZodError) {
  return { errors: z.flattenError(error).fieldErrors };
}

// --- Categories ---

const CategorySchema = z.object({
  name: z.string().min(1, { error: 'กรุณากรอกชื่อหมวดหมู่' }),
  slug: z.string().min(1, { error: 'กรุณากรอก slug' }),
  description: z.string().optional(),
});

export type CategoryFormState =
  | { errors?: { name?: string[]; slug?: string[] }; message?: string }
  | undefined;

export async function createCategoryAction(
  _state: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const accessToken = await requireAdminAccessToken();

  const validated = CategorySchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || undefined,
  });
  if (!validated.success) {
    return fieldErrorState(validated.error);
  }

  try {
    await apiFetch('/admin/categories', {
      method: 'POST',
      accessToken,
      body: JSON.stringify(validated.data),
    });
  } catch (err) {
    return { message: err instanceof ApiError ? err.message : 'เกิดข้อผิดพลาด' };
  }

  revalidatePath('/admin/categories');
  return undefined;
}

export async function deleteCategoryAction(id: string) {
  const accessToken = await requireAdminAccessToken();
  await apiFetch(`/admin/categories/${id}`, {
    method: 'DELETE',
    accessToken,
  });
  revalidatePath('/admin/categories');
}

// --- Products ---

const ProductSchema = z.object({
  categoryId: z.string().min(1, { error: 'กรุณาเลือกหมวดหมู่' }),
  name: z.string().min(1, { error: 'กรุณากรอกชื่อสินค้า' }),
  slug: z.string().min(1, { error: 'กรุณากรอก slug' }),
  description: z.string().optional(),
  basePrice: z.coerce.number().positive({ error: 'กรุณากรอกราคาให้ถูกต้อง' }),
  status: z.enum(['draft', 'published', 'archived']),
});

export type ProductFormState =
  | {
      errors?: {
        categoryId?: string[];
        name?: string[];
        slug?: string[];
        basePrice?: string[];
      };
      message?: string;
    }
  | undefined;

export async function createProductAction(
  _state: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const accessToken = await requireAdminAccessToken();

  const validated = ProductSchema.safeParse({
    categoryId: formData.get('categoryId'),
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || undefined,
    basePrice: formData.get('basePrice'),
    status: formData.get('status') || 'draft',
  });
  if (!validated.success) {
    return fieldErrorState(validated.error);
  }

  let product: { id: string };
  try {
    product = await apiFetch<{ id: string }>('/admin/products', {
      method: 'POST',
      accessToken,
      body: JSON.stringify(validated.data),
    });
  } catch (err) {
    return { message: err instanceof ApiError ? err.message : 'เกิดข้อผิดพลาด' };
  }

  revalidatePath('/admin/products');
  redirect(`/admin/products/${product.id}/edit`);
}

export async function updateProductAction(
  productId: string,
  _state: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const accessToken = await requireAdminAccessToken();

  const validated = ProductSchema.safeParse({
    categoryId: formData.get('categoryId'),
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description') || undefined,
    basePrice: formData.get('basePrice'),
    status: formData.get('status') || 'draft',
  });
  if (!validated.success) {
    return fieldErrorState(validated.error);
  }

  try {
    await apiFetch(`/admin/products/${productId}`, {
      method: 'PATCH',
      accessToken,
      body: JSON.stringify(validated.data),
    });
  } catch (err) {
    return { message: err instanceof ApiError ? err.message : 'เกิดข้อผิดพลาด' };
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${productId}/edit`);
  return undefined;
}

export async function deleteProductAction(productId: string) {
  const accessToken = await requireAdminAccessToken();
  await apiFetch(`/admin/products/${productId}`, {
    method: 'DELETE',
    accessToken,
  });
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

// --- Variants ---

const VariantSchema = z.object({
  sku: z.string().min(1, { error: 'กรุณากรอก SKU' }),
  size: z.string().optional(),
  color: z.string().optional(),
  priceOverride: z.coerce.number().positive().optional().or(z.literal(NaN)),
  stockQuantity: z.coerce.number().int().min(0),
});

export type VariantFormState =
  | { errors?: { sku?: string[]; stockQuantity?: string[] }; message?: string }
  | undefined;

export async function addVariantAction(
  productId: string,
  _state: VariantFormState,
  formData: FormData,
): Promise<VariantFormState> {
  const accessToken = await requireAdminAccessToken();

  const rawPriceOverride = formData.get('priceOverride');
  const validated = VariantSchema.safeParse({
    sku: formData.get('sku'),
    size: formData.get('size') || undefined,
    color: formData.get('color') || undefined,
    priceOverride: rawPriceOverride || undefined,
    stockQuantity: formData.get('stockQuantity'),
  });
  if (!validated.success) {
    return fieldErrorState(validated.error);
  }

  const { priceOverride, ...rest } = validated.data;
  try {
    await apiFetch(`/admin/products/${productId}/variants`, {
      method: 'POST',
      accessToken,
      body: JSON.stringify({
        ...rest,
        ...(priceOverride && !Number.isNaN(priceOverride)
          ? { priceOverride }
          : {}),
      }),
    });
  } catch (err) {
    return { message: err instanceof ApiError ? err.message : 'เกิดข้อผิดพลาด' };
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  return undefined;
}

export async function deleteVariantAction(
  productId: string,
  variantId: string,
) {
  const accessToken = await requireAdminAccessToken();
  await apiFetch(`/admin/products/${productId}/variants/${variantId}`, {
    method: 'DELETE',
    accessToken,
  });
  revalidatePath(`/admin/products/${productId}/edit`);
}

// --- Images ---

export async function uploadImageAction(
  productId: string,
  formData: FormData,
) {
  const accessToken = await requireAdminAccessToken();
  const file = formData.get('file');
  const isPrimary = formData.get('isPrimary') === 'on';

  if (!(file instanceof File) || file.size === 0) {
    return;
  }

  const uploadBody = new FormData();
  uploadBody.set('file', file);

  await apiFetch(
    `/admin/products/${productId}/images?isPrimary=${isPrimary}`,
    {
      method: 'POST',
      accessToken,
      body: uploadBody,
    },
  );

  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function deleteImageAction(productId: string, imageId: string) {
  const accessToken = await requireAdminAccessToken();
  await apiFetch(`/admin/products/${productId}/images/${imageId}`, {
    method: 'DELETE',
    accessToken,
  });
  revalidatePath(`/admin/products/${productId}/edit`);
}

'use server';

import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { apiFetch, ApiError } from '@/lib/api';
import { requireUserAccessToken } from '@/lib/dal';
import { getLocale } from '@/lib/get-locale';

const AddressSchema = z.object({
  recipientName: z.string().min(1, { error: 'กรุณากรอกชื่อผู้รับ' }),
  phone: z.string().min(1, { error: 'กรุณากรอกเบอร์โทร' }),
  addressLine1: z.string().min(1, { error: 'กรุณากรอกที่อยู่' }),
  addressLine2: z.string().optional(),
  subdistrict: z.string().min(1, { error: 'กรุณากรอกตำบล/แขวง' }),
  district: z.string().min(1, { error: 'กรุณากรอกอำเภอ/เขต' }),
  province: z.string().min(1, { error: 'กรุณากรอกจังหวัด' }),
  postalCode: z.string().min(1, { error: 'กรุณากรอกรหัสไปรษณีย์' }),
});

export type AddressFormState =
  | {
      errors?: {
        recipientName?: string[];
        phone?: string[];
        addressLine1?: string[];
        subdistrict?: string[];
        district?: string[];
        province?: string[];
        postalCode?: string[];
      };
      message?: string;
    }
  | undefined;

export async function createAddressAction(
  _state: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const accessToken = await requireUserAccessToken();

  const validated = AddressSchema.safeParse({
    recipientName: formData.get('recipientName'),
    phone: formData.get('phone'),
    addressLine1: formData.get('addressLine1'),
    addressLine2: formData.get('addressLine2') || undefined,
    subdistrict: formData.get('subdistrict'),
    district: formData.get('district'),
    province: formData.get('province'),
    postalCode: formData.get('postalCode'),
  });
  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors };
  }

  const isDefault = formData.get('isDefault') === 'on';

  try {
    await apiFetch('/addresses', {
      method: 'POST',
      accessToken,
      body: JSON.stringify({ ...validated.data, isDefault }),
    });
  } catch (err) {
    return {
      message: err instanceof ApiError ? err.message : 'บันทึกที่อยู่ไม่สำเร็จ',
    };
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/checkout`);
  revalidatePath(`/${locale}/account/addresses`);
  return undefined;
}

export async function deleteAddressAction(id: string) {
  const accessToken = await requireUserAccessToken();
  await apiFetch(`/addresses/${id}`, { method: 'DELETE', accessToken });
  const locale = await getLocale();
  revalidatePath(`/${locale}/checkout`);
  revalidatePath(`/${locale}/account/addresses`);
}

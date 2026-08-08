'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { apiFetch, ApiError } from '@/lib/api';
import { setSessionCookies, clearSessionCookies, getSessionCookies } from '@/lib/session';
import { requireUserAccessToken } from '@/lib/dal';
import { getLocale } from '@/lib/get-locale';
import type { AuthTokens } from '@/lib/types';

const LoginSchema = z.object({
  email: z.email({ error: 'กรุณากรอกอีเมลให้ถูกต้อง' }),
  password: z.string().min(1, { error: 'กรุณากรอกรหัสผ่าน' }),
});

export type LoginState =
  | { errors?: { email?: string[]; password?: string[] }; message?: string }
  | undefined;

export async function loginAction(
  redirectTo: string,
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const validated = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors };
  }

  try {
    const tokens = await apiFetch<AuthTokens>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(validated.data),
    });
    await setSessionCookies(tokens);
  } catch (err) {
    if (err instanceof ApiError) {
      return { message: err.message };
    }
    return { message: 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' };
  }

  redirect(redirectTo);
}

const RegisterSchema = z.object({
  email: z.email({ error: 'กรุณากรอกอีเมลให้ถูกต้อง' }),
  password: z.string().min(8, { error: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' }),
  fullName: z.string().min(2, { error: 'กรุณากรอกชื่อ-นามสกุล' }),
  phone: z.string().optional(),
});

export type RegisterState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
        fullName?: string[];
      };
      message?: string;
    }
  | undefined;

export async function registerAction(
  _state: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const validated = RegisterSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
    phone: formData.get('phone') || undefined,
  });

  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors };
  }

  try {
    const tokens = await apiFetch<AuthTokens>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(validated.data),
    });
    await setSessionCookies(tokens);
  } catch (err) {
    if (err instanceof ApiError) {
      return { message: err.message };
    }
    return { message: 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' };
  }

  const locale = await getLocale();
  redirect(`/${locale}/account`);
}

const UpdateProfileSchema = z.object({
  fullName: z.string().min(2, { error: 'กรุณากรอกชื่อ-นามสกุล' }),
  phone: z.string().optional(),
});

export type UpdateProfileState =
  | {
      errors?: { fullName?: string[] };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function updateProfileAction(
  _state: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const accessToken = await requireUserAccessToken();

  const validated = UpdateProfileSchema.safeParse({
    fullName: formData.get('fullName'),
    phone: formData.get('phone') || undefined,
  });
  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors };
  }

  try {
    await apiFetch('/auth/me', {
      method: 'PATCH',
      accessToken,
      body: JSON.stringify(validated.data),
    });
  } catch (err) {
    return {
      message: err instanceof ApiError ? err.message : 'บันทึกข้อมูลไม่สำเร็จ',
    };
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/account`);
  return { success: true };
}

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: 'กรุณากรอกรหัสผ่านเดิม' }),
    newPassword: z
      .string()
      .min(8, { error: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร' }),
    confirmPassword: z.string().min(1, { error: 'กรุณายืนยันรหัสผ่านใหม่' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: 'รหัสผ่านใหม่ไม่ตรงกัน',
    path: ['confirmPassword'],
  });

export type ChangePasswordState =
  | {
      errors?: {
        currentPassword?: string[];
        newPassword?: string[];
        confirmPassword?: string[];
      };
      message?: string;
    }
  | undefined;

export async function changePasswordAction(
  _state: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const accessToken = await requireUserAccessToken();

  const validated = ChangePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });
  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors };
  }

  try {
    await apiFetch('/auth/change-password', {
      method: 'PATCH',
      accessToken,
      body: JSON.stringify({
        currentPassword: validated.data.currentPassword,
        newPassword: validated.data.newPassword,
      }),
    });
  } catch (err) {
    return {
      message: err instanceof ApiError ? err.message : 'เปลี่ยนรหัสผ่านไม่สำเร็จ',
    };
  }

  await clearSessionCookies();
  const locale = await getLocale();
  redirect(`/${locale}/login`);
}

async function revokeSession() {
  const { refreshToken } = await getSessionCookies();
  if (refreshToken) {
    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // best-effort revoke; clear local cookies regardless
    }
  }
  await clearSessionCookies();
}

export async function logoutAction() {
  await revokeSession();
  const locale = await getLocale();
  redirect(`/${locale}/login`);
}

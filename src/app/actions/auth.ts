'use server';

import { redirect } from 'next/navigation';
import * as z from 'zod';
import { apiFetch, ApiError } from '@/lib/api';
import { setSessionCookies, clearSessionCookies, getSessionCookies } from '@/lib/session';
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

export async function adminLogoutAction() {
  await revokeSession();
  redirect('/admin/login');
}

import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { apiFetch, ApiError } from './api';
import {
  getSessionCookies,
  setSessionCookies,
  clearSessionCookies,
} from './session';
import { getLocale } from './get-locale';
import type { AuthTokens, AuthUser } from './types';

async function tryRefresh(refreshToken: string): Promise<AuthTokens | null> {
  let tokens: AuthTokens;
  try {
    tokens = await apiFetch<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    return null;
  }

  try {
    // Persists the refreshed cookies. Only allowed inside a Server Action or
    // Route Handler — verifySession() also runs during plain page renders
    // (e.g. SiteHeader), where Next.js forbids mutating cookies. When that
    // happens, the refreshed tokens are still used for this render; the
    // cookie itself catches up on the next Server Action or middleware pass.
    await setSessionCookies(tokens);
  } catch {
    // ignore — not in a writable context
  }
  return tokens;
}

/**
 * Secure session check: verifies the access token against the API (/auth/me),
 * transparently refreshing once if the access token has expired.
 */
export const verifySession = cache(async (): Promise<AuthUser | null> => {
  const { accessToken, refreshToken } = await getSessionCookies();

  if (!accessToken) {
    return null;
  }

  try {
    return await apiFetch<AuthUser>('/auth/me', { accessToken });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401 && refreshToken) {
      const refreshed = await tryRefresh(refreshToken);
      if (refreshed) {
        return refreshed.user;
      }
    }
    try {
      await clearSessionCookies();
    } catch {
      // ignore — not in a writable context (see tryRefresh)
    }
    return null;
  }
});

export async function requireUser(): Promise<AuthUser> {
  const user = await verifySession();
  if (!user) {
    const locale = await getLocale();
    redirect(`/${locale}/login`);
  }
  return user;
}

/**
 * Re-verifies the session and returns the raw access token, for calling
 * customer-scoped API endpoints (cart/orders/addresses) directly from
 * Server Actions. Redirects to /login if not authenticated.
 */
export async function requireUserAccessToken(): Promise<string> {
  await requireUser();
  const { accessToken } = await getSessionCookies();
  if (!accessToken) {
    const locale = await getLocale();
    redirect(`/${locale}/login`);
  }
  return accessToken;
}

/**
 * Like requireUserAccessToken, but never redirects — returns undefined for
 * guests. Used by the site header, which must render for logged-out
 * visitors too.
 */
export async function getOptionalAccessToken(): Promise<string | undefined> {
  const user = await verifySession();
  if (!user) {
    return undefined;
  }
  const { accessToken } = await getSessionCookies();
  return accessToken;
}

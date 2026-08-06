import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, type Locale } from '@/lib/i18n-config';

const ACCESS_TOKEN_COOKIE = 'access_token';
const LOCALE_COOKIE = 'NEXT_LOCALE';

function getPreferredLocale(request: NextRequest): Locale {
  const header = request.headers.get('accept-language');
  if (header) {
    const preferred = header.split(',')[0]?.split('-')[0]?.trim();
    if (preferred && (locales as readonly string[]).includes(preferred)) {
      return preferred as Locale;
    }
  }
  return defaultLocale;
}

// Optimistic check only (cookie presence). Real verification happens in the
// DAL (src/lib/dal.ts) via requireUser()/requireAdmin() close to the data.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(ACCESS_TOKEN_COOKIE);

  // /admin is not localized and keeps its original auth-gate behavior untouched.
  if (pathname.startsWith('/admin')) {
    if (pathname !== '/admin/login' && !hasSession) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const pathnameLocale = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (!pathnameLocale) {
    const locale = getPreferredLocale(request);
    const url = new URL(`/${locale}${pathname}`, request.url);
    url.search = request.nextUrl.search;
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, locale, { path: '/' });
    return response;
  }

  const pathWithoutLocale = pathname.slice(`/${pathnameLocale}`.length) || '/';
  const isAccountRoute = pathWithoutLocale.startsWith('/account');

  if (isAccountRoute && !hasSession) {
    const url = new URL(`/${pathnameLocale}/login`, request.url);
    url.searchParams.set('redirectTo', pathname);
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, pathnameLocale, { path: '/' });
    return response;
  }

  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, pathnameLocale, { path: '/' });
  return response;
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};

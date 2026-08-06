import 'server-only';
import { cookies } from 'next/headers';
import { defaultLocale, isLocale, type Locale } from './i18n-config';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value && isLocale(value) ? value : defaultLocale;
}

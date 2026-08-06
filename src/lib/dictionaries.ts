import 'server-only';
import type { Locale } from './i18n-config';

const dictionaries = {
  th: () => import('../dictionaries/th.json').then((m) => m.default),
  en: () => import('../dictionaries/en.json').then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

import Link from 'next/link';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';

export function AuthTabs({
  active,
  lang,
  dict,
}: {
  active: 'login' | 'register';
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <div className="flex gap-1 bg-background rounded-lg p-1">
      <Link
        href={`/${lang}/login`}
        className={`flex-1 text-center text-sm font-bold py-3 px-2 rounded-lg transition-colors ${
          active === 'login' ? 'bg-white text-brand-red' : 'text-text-faint'
        }`}
      >
        {dict.auth.loginTab}
      </Link>
      <Link
        href={`/${lang}/register`}
        className={`flex-1 text-center text-sm font-bold py-3 px-2 rounded-lg transition-colors ${
          active === 'register' ? 'bg-white text-brand-red' : 'text-text-faint'
        }`}
      >
        {dict.auth.registerTab}
      </Link>
    </div>
  );
}

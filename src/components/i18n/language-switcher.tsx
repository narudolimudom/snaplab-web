'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n-config';

const LABELS: Record<Locale, string> = { th: 'ไทย', en: 'EN' };

export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(th|en)(?=\/|$)/, '') || '/';

  return (
    <div className="flex items-center gap-1 text-[12.8px] font-bold">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="opacity-40">|</span>}
          <Link
            href={`/${l}${rest}`}
            className={l === lang ? 'text-brand-red' : 'text-text-faint hover:text-foreground'}
          >
            {LABELS[l]}
          </Link>
        </span>
      ))}
    </div>
  );
}

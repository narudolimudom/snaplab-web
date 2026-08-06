import { AuthTabs } from './auth-tabs';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';

export function AuthLayout({
  active,
  lang,
  dict,
  children,
}: {
  active: 'login' | 'register';
  lang: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-[1280px] mx-auto p-4">
      <div className="flex flex-wrap gap-4 items-stretch">
        <section className="flex-[2_1_420px] min-w-[min(100%,360px)] relative rounded-lg overflow-hidden bg-navy flex items-end min-h-[420px]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#141414_0_14px,#1c1c1c_14px_28px)]" />
          <div className="relative p-6 md:p-12 flex flex-col gap-4">
            <span className="self-start bg-brand-red text-white text-[12.8px] font-bold px-2 py-1 rounded">
              {dict.auth.memberBadge}
            </span>
            <h2 className="text-2xl md:text-[34px] font-extrabold text-white leading-[1.25] text-balance">
              {dict.auth.heroTitle}
            </h2>
            <div className="flex flex-col gap-2 text-sm font-semibold text-white/80 leading-relaxed">
              <span>{dict.auth.benefit1}</span>
              <span>{dict.auth.benefit2}</span>
              <span>{dict.auth.benefit3}</span>
            </div>
          </div>
        </section>

        <section className="flex-[1_1_380px] min-w-[min(100%,320px)] bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-4">
          <AuthTabs active={active} lang={lang} dict={dict} />
          {children}
        </section>
      </div>
    </main>
  );
}

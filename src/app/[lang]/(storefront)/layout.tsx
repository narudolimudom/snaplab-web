import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { HtmlLangSetter } from '@/components/i18n/html-lang-setter';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n-config';

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col min-h-screen">
      <HtmlLangSetter lang={lang} />
      <SiteHeader lang={lang} dict={dict} />
      <div className="flex-1">{children}</div>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}

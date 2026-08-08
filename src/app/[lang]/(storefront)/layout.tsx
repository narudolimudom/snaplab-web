import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { JsonLd } from '@/components/seo/json-ld';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n-config';
import { SITE_URL } from '@/lib/site-config';

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

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: dict.seo.siteName,
    url: `${SITE_URL}/${lang}`,
    telephone: '+66-2-114-7788',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={organizationSchema} />
      <SiteHeader lang={lang} dict={dict} />
      <div className="flex-1">{children}</div>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}

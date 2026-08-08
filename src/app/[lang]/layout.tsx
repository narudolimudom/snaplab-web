import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n-config';
import { SITE_URL } from '@/lib/site-config';
import '../globals.css';

const notoSansThai = Noto_Sans_Thai({
  variable: '--font-noto-sans-thai',
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: dict.seo.homeTitle,
    description: dict.seo.homeDescription,
  };
}

export default async function LangRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${notoSansThai.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n-config';

export default async function TradeInPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <main className="max-w-[720px] mx-auto p-4 flex flex-col gap-4">
      <h1 className="text-xl font-extrabold mt-2">{dict.common.tradeIn}</h1>
      <section className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-4">
        <p className="text-sm text-text-muted leading-relaxed">{dict.tradeIn.intro}</p>
        <ul className="text-sm text-text-muted leading-relaxed list-disc pl-5 flex flex-col gap-1">
          <li>{dict.tradeIn.bullet1}</li>
          <li>{dict.tradeIn.bullet2}</li>
          <li>{dict.tradeIn.bullet3}</li>
        </ul>
        <p className="text-sm text-text-muted">{dict.tradeIn.note}</p>
        <Link
          href={`/${lang}/products`}
          className="w-fit bg-brand-red text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-brand-red-dark"
        >
          {dict.tradeIn.shopNewButton}
        </Link>
      </section>
    </main>
  );
}

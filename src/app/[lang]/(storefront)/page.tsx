import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategories, getProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/storefront/product-card';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale, locales } from '@/lib/i18n-config';
import { SITE_URL } from '@/lib/site-config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    title: dict.seo.homeTitle,
    description: dict.seo.homeDescription,
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}`])),
    },
    openGraph: {
      title: dict.seo.homeTitle,
      description: dict.seo.homeDescription,
      url: `${SITE_URL}/${lang}`,
      siteName: dict.seo.siteName,
      locale: lang === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const [dict, categories, newArrivals] = await Promise.all([
    getDictionary(lang),
    getCategories(),
    getProducts({ sort: 'newest', limit: 8 }),
  ]);

  return (
    <main className="max-w-[1280px] mx-auto p-4 flex flex-col gap-4">
      <section className="flex flex-wrap gap-4 items-stretch">
        <aside className="flex-[1_1_240px] min-w-[240px] max-w-[320px] bg-white border border-border-subtle rounded-lg p-2">
          <div className="text-[12.8px] font-bold text-text-faint px-2 py-2">
            {dict.home.categoriesTitle}
          </div>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${lang}/products?category=${cat.slug}`}
              className="flex items-center justify-between gap-2 px-2 py-2 rounded-lg text-sm font-semibold hover:bg-background"
            >
              <span>{cat.name}</span>
            </Link>
          ))}
        </aside>

        <div className="flex-[4_1_520px] min-w-[min(100%,480px)] relative rounded-lg overflow-hidden bg-navy min-h-[300px] md:min-h-[360px] flex items-center">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#141414_0_14px,#1c1c1c_14px_28px)]" />
          <div className="relative p-6 md:p-12 max-w-[560px] flex flex-col gap-4">
            <span className="self-start bg-brand-red text-white text-[12.8px] font-bold px-2 py-1 rounded">
              {dict.home.heroBadge}
            </span>
            <h1 className="text-3xl md:text-[44px] leading-[1.15] font-extrabold text-white text-balance">
              {dict.home.heroTitle}
            </h1>
            <p className="text-lg font-semibold leading-relaxed text-white/80">
              {dict.home.heroSubtitle}
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={`/${lang}/products`}
                className="bg-brand-red text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-brand-red-dark"
              >
                {dict.home.shopAll}
              </Link>
              <Link
                href={`/${lang}/trade-in`}
                className="text-white text-sm font-bold px-2 py-3 border-b border-white/35"
              >
                {dict.common.tradeIn}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-extrabold">{dict.home.newArrivals}</h2>
          <Link
            href={`/${lang}/products?sort=newest`}
            className="text-sm font-semibold text-brand-red"
          >
            {dict.home.viewAll}
          </Link>
        </div>
        {newArrivals.items.length === 0 ? (
          <p className="text-sm text-text-faint">{dict.common.noProducts}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                lang={lang}
                noImageLabel={dict.common.noImage}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {dict.home.services.map((s) => (
          <div
            key={s.title}
            className="bg-white border border-border-subtle rounded-lg p-4 flex flex-col gap-1"
          >
            <span className="text-lg font-extrabold">{s.title}</span>
            <span className="text-sm font-semibold leading-relaxed text-text-muted">
              {s.desc}
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}

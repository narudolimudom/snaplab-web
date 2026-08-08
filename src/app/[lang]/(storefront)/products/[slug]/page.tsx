import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getPublicUploadUrl } from '@/lib/catalog';
import { getPrimaryImage } from '@/lib/upload-url';
import { ApiError } from '@/lib/api';
import { ProductGallery } from '@/components/storefront/product-gallery';
import { PurchaseBox } from '@/components/storefront/purchase-box';
import { ProductReviews } from '@/components/storefront/product-reviews';
import { JsonLd } from '@/components/seo/json-ld';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale, locales } from '@/lib/i18n-config';
import { SITE_URL } from '@/lib/site-config';
import type { ProductDetail } from '@/lib/catalog-types';

function buildProductSchema(product: ProductDetail, lang: string) {
  const prices = product.variants.length
    ? product.variants.map((v) => Number(v.priceOverride ?? product.basePrice))
    : [Number(product.basePrice)];
  const totalStock = product.variants.length
    ? product.variants.reduce((sum, v) => sum + v.stockQuantity, 0)
    : 1;
  const url = `${SITE_URL}/${lang}/products/${product.slug}`;
  const primaryImage = getPrimaryImage(product.images);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? undefined,
    image: primaryImage ? [getPublicUploadUrl(primaryImage.path)] : undefined,
    sku: product.variants[0]?.sku,
    category: product.category.name,
    url,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'THB',
      lowPrice: Math.min(...prices).toFixed(2),
      highPrice: Math.max(...prices).toFixed(2),
      offerCount: prices.length,
      availability:
        totalStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url,
    },
  };
}

function buildBreadcrumbSchema(
  product: ProductDetail,
  lang: string,
  dict: Awaited<ReturnType<typeof getDictionary>>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.common.home, item: `${SITE_URL}/${lang}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.category.name,
        item: `${SITE_URL}/${lang}/products?category=${product.category.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${SITE_URL}/${lang}/products/${product.slug}`,
      },
    ],
  };
}

function parseSpecs(description: string | null): [string, string][] | null {
  if (!description) return null;
  const lines = description.split('\n').filter(Boolean);
  const specs: [string, string][] = [];
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx === -1) return null;
    specs.push([line.slice(0, idx).trim(), line.slice(idx + 1).trim()]);
  }
  return specs.length > 0 ? specs : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch {
    return {};
  }

  const title = `${product.name} | ${dict.seo.siteName}`;
  // A description formatted as "label: value" lines is a spec sheet, not
  // prose — the fallback marketing blurb reads better as a meta description.
  const isSpecSheet = parseSpecs(product.description) !== null;
  const description =
    (!isSpecSheet && product.description?.split('\n')[0]) ||
    dict.seo.productDescriptionFallback.replace('{name}', product.name);
  const canonicalPath = `/${lang}/products/${slug}`;
  const primaryImage = getPrimaryImage(product.images);

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${canonicalPath}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}/products/${slug}`]),
      ),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      siteName: dict.seo.siteName,
      locale: lang === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: primaryImage ? [{ url: getPublicUploadUrl(primaryImage.path) }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  const specs = parseSpecs(product.description);

  return (
    <main className="max-w-[1280px] mx-auto p-4 flex flex-col gap-4">
      <JsonLd data={buildProductSchema(product, lang)} />
      <JsonLd data={buildBreadcrumbSchema(product, lang, dict)} />
      <div className="flex items-center gap-2 text-[12.8px] font-semibold text-text-faint py-2">
        <Link href={`/${lang}`}>{dict.common.home}</Link>
        <span>/</span>
        <Link href={`/${lang}/products?category=${product.category.slug}`}>
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="flex flex-wrap gap-4 items-start">
        <div className="flex-[3_1_480px] min-w-[min(100%,380px)]">
          <ProductGallery
            images={product.images}
            alt={product.name}
            noImageLabel={dict.common.noImage}
          />
        </div>

        <div className="flex-[2_1_380px] min-w-[min(100%,320px)] bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[12.8px] font-bold text-text-faint tracking-wide">
              {product.category.name}
            </span>
            <h1 className="text-xl font-extrabold leading-relaxed">{product.name}</h1>
          </div>

          <PurchaseBox variants={product.variants} basePrice={product.basePrice} dict={dict} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-start mt-2">
        {specs ? (
          <section className="flex-[3_1_480px] min-w-[min(100%,380px)] bg-white border border-border-subtle rounded-lg p-6">
            <h2 className="text-lg font-extrabold mb-4">{dict.product.specsTitle}</h2>
            <div className="flex flex-col">
              {specs.map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-wrap gap-2 py-3 border-b border-[#f0f4f8] text-sm font-semibold last:border-b-0"
                >
                  <span className="flex-none w-[160px] text-text-faint">{label}</span>
                  <span className="flex-1 leading-relaxed">{value}</span>
                </div>
              ))}
            </div>
          </section>
        ) : product.description ? (
          <section className="flex-[3_1_480px] min-w-[min(100%,380px)] bg-white border border-border-subtle rounded-lg p-6">
            <h2 className="text-lg font-extrabold mb-4">{dict.product.descriptionTitle}</h2>
            <p className="text-sm font-semibold leading-relaxed text-text-muted whitespace-pre-line">
              {product.description}
            </p>
          </section>
        ) : null}

        <div className="flex-[2_1_380px] min-w-[min(100%,320px)]">
          <ProductReviews dict={dict} />
        </div>
      </div>
    </main>
  );
}

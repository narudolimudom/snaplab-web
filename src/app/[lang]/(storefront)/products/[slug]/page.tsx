import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/catalog';
import { ApiError } from '@/lib/api';
import { ProductGallery } from '@/components/storefront/product-gallery';
import { PurchaseBox } from '@/components/storefront/purchase-box';
import { ProductReviews } from '@/components/storefront/product-reviews';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n-config';

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

import Link from 'next/link';
import { ProductImagePlaceholder } from './product-image-placeholder';
import type { Product } from '@/lib/catalog-types';
import type { Locale } from '@/lib/i18n-config';

export function ProductCard({
  product,
  lang,
  noImageLabel,
}: {
  product: Product;
  lang: Locale;
  noImageLabel: string;
}) {
  return (
    <Link
      href={`/${lang}/products/${product.slug}`}
      className="bg-white border border-border-subtle rounded-lg p-4 flex flex-col gap-2 transition-shadow hover:border-brand-red hover:shadow-[0_8px_24px_rgba(43,52,69,0.10)]"
    >
      <ProductImagePlaceholder className="aspect-square rounded-lg" label={noImageLabel} />
      <span className="text-sm font-semibold leading-relaxed">{product.name}</span>
      <span className="text-xl font-extrabold text-brand-red">
        ฿{Number(product.basePrice).toLocaleString()}
      </span>
    </Link>
  );
}

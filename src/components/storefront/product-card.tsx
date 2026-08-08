import Link from 'next/link';
import Image from 'next/image';
import { ProductImagePlaceholder } from './product-image-placeholder';
import { getPrimaryImage, getPublicUploadUrl } from '@/lib/upload-url';
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
  const primaryImage = getPrimaryImage(product.images);

  return (
    <Link
      href={`/${lang}/products/${product.slug}`}
      className="bg-white border border-border-subtle rounded-lg p-4 flex flex-col gap-2 transition-shadow hover:border-brand-red hover:shadow-[0_8px_24px_rgba(43,52,69,0.10)]"
    >
      {primaryImage ? (
        <div className="relative aspect-square rounded-lg overflow-hidden bg-background">
          <Image
            src={getPublicUploadUrl(primaryImage.path)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        </div>
      ) : (
        <ProductImagePlaceholder className="aspect-square rounded-lg" label={noImageLabel} />
      )}
      <span className="text-sm font-semibold leading-relaxed">{product.name}</span>
      <span className="text-xl font-extrabold text-brand-red">
        ฿{Number(product.basePrice).toLocaleString()}
      </span>
    </Link>
  );
}

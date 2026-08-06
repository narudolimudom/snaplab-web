'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getPublicUploadUrl } from '@/lib/upload-url';
import { ProductImagePlaceholder } from './product-image-placeholder';
import type { ProductImage } from '@/lib/catalog-types';

export function ProductGallery({
  images,
  alt,
  noImageLabel,
}: {
  images: ProductImage[];
  alt: string;
  noImageLabel: string;
}) {
  const sorted = [...images].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex];

  if (sorted.length === 0) {
    return (
      <ProductImagePlaceholder
        className="aspect-4/3 rounded-lg border border-border-subtle"
        label={noImageLabel}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-4/3 rounded-lg border border-border-subtle overflow-hidden bg-white">
        <Image
          src={getPublicUploadUrl(active.path)}
          alt={alt}
          fill
          className="object-cover"
          priority
        />
      </div>
      {sorted.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                i === activeIndex ? 'border-brand-red' : 'border-border-subtle'
              }`}
            >
              <Image src={getPublicUploadUrl(img.path)} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

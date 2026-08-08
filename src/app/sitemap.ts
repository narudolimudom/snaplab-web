import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/catalog';
import { locales } from '@/lib/i18n-config';
import { SITE_URL } from '@/lib/site-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { items: products } = await getProducts({ limit: 1000 });

  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    entries.push({
      url: `${SITE_URL}/${lang}`,
      changeFrequency: 'daily',
      priority: 1,
    });
    entries.push({
      url: `${SITE_URL}/${lang}/products`,
      changeFrequency: 'daily',
      priority: 0.9,
    });
    for (const product of products) {
      entries.push({
        url: `${SITE_URL}/${lang}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return entries;
}

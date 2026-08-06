import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories, getProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/storefront/product-card';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n-config';

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const sortLabels: Record<string, string> = {
    newest: dict.products.sortNewest,
    price_asc: dict.products.sortPriceAsc,
    price_desc: dict.products.sortPriceDesc,
  };
  const SORT_OPTIONS: { value: string; label: string }[] = [
    { value: 'newest', label: sortLabels.newest },
    { value: 'price_asc', label: sortLabels.price_asc },
    { value: 'price_desc', label: sortLabels.price_desc },
  ];

  const searchParamsValue = await searchParams;
  const page = searchParamsValue.page ? Number(searchParamsValue.page) : 1;
  const sort =
    searchParamsValue.sort === 'price_asc' ||
    searchParamsValue.sort === 'price_desc' ||
    searchParamsValue.sort === 'newest'
      ? searchParamsValue.sort
      : undefined;

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({
      category: searchParamsValue.category,
      search: searchParamsValue.search,
      page,
      minPrice: searchParamsValue.minPrice ? Number(searchParamsValue.minPrice) : undefined,
      maxPrice: searchParamsValue.maxPrice ? Number(searchParamsValue.maxPrice) : undefined,
      sort,
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === searchParamsValue.category);

  function buildQuery(overrides: Record<string, string | undefined>) {
    const merged = { ...searchParamsValue, ...overrides };
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      if (value) qs.set(key, value);
    }
    return `/${lang}/products?${qs.toString()}`;
  }

  return (
    <main className="max-w-[1280px] mx-auto p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 text-[12.8px] font-semibold text-text-faint py-2">
        <Link href={`/${lang}`}>{dict.common.home}</Link>
        <span>/</span>
        <span className="text-foreground">
          {activeCategory?.name ?? dict.products.allProducts}
        </span>
      </div>

      <div className="flex items-end justify-between gap-4 flex-wrap mb-2">
        <h1 className="text-xl font-extrabold">
          {activeCategory?.name ?? dict.products.allProducts}
        </h1>
        <span className="text-sm font-semibold text-text-muted">
          {dict.products.resultCount.replace('{count}', String(result.total))}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 items-start">
        <aside className="flex-[1_1_240px] min-w-[240px] max-w-[300px] flex flex-col gap-4">
          <div className="bg-white border border-border-subtle rounded-lg p-4 flex flex-col gap-2">
            <span className="text-sm font-bold">{dict.products.categoryLabel}</span>
            <Link
              href={buildQuery({ category: undefined, page: undefined })}
              className={`text-sm font-semibold px-2 py-1.5 rounded-lg ${!searchParamsValue.category ? 'bg-brand-red text-white' : 'hover:bg-background'}`}
            >
              {dict.products.allCategoryOption}
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={buildQuery({ category: c.slug, page: undefined })}
                className={`text-sm font-semibold px-2 py-1.5 rounded-lg ${searchParamsValue.category === c.slug ? 'bg-brand-red text-white' : 'hover:bg-background'}`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <form
            action={`/${lang}/products`}
            method="GET"
            className="bg-white border border-border-subtle rounded-lg p-4 flex flex-col gap-2"
          >
            {searchParamsValue.category && (
              <input type="hidden" name="category" value={searchParamsValue.category} />
            )}
            {searchParamsValue.search && (
              <input type="hidden" name="search" value={searchParamsValue.search} />
            )}
            <span className="text-sm font-bold">{dict.products.priceRange}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="minPrice"
                defaultValue={searchParamsValue.minPrice}
                placeholder={dict.products.minPricePlaceholder}
                className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm"
              />
              <span className="text-text-faint">-</span>
              <input
                type="number"
                name="maxPrice"
                defaultValue={searchParamsValue.maxPrice}
                placeholder={dict.products.maxPricePlaceholder}
                className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="mt-1 border border-navy bg-white text-navy text-sm font-bold py-2 rounded-lg"
            >
              {dict.products.filterButton}
            </button>
          </form>
        </aside>

        <div className="flex-[4_1_620px] min-w-[min(100%,460px)] flex flex-col gap-4">
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[12.8px] font-semibold text-text-faint">
              {dict.products.sortBy}
            </span>
            <div className="flex items-center gap-1">
              {SORT_OPTIONS.map((opt) => (
                <Link
                  key={opt.value}
                  href={buildQuery({ sort: opt.value, page: undefined })}
                  className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${
                    (searchParamsValue.sort ?? 'newest') === opt.value
                      ? 'bg-brand-red text-white border-brand-red'
                      : 'border-border-subtle hover:border-brand-red'
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          {result.items.length === 0 ? (
            <p className="text-sm text-text-faint">{dict.products.noResults}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {result.items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  noImageLabel={dict.common.noImage}
                />
              ))}
            </div>
          )}

          <div className="flex gap-4 text-sm font-semibold justify-center py-4">
            {page > 1 && (
              <Link href={buildQuery({ page: String(page - 1) })} className="underline">
                {dict.common.previousPage}
              </Link>
            )}
            {result.items.length === result.limit && (
              <Link href={buildQuery({ page: String(page + 1) })} className="underline">
                {dict.common.nextPage}
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

import Link from 'next/link';
import { getCategories } from '@/lib/catalog';
import { getCart } from '@/lib/cart';
import { verifySession, getOptionalAccessToken } from '@/lib/dal';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';

export async function SiteHeader({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [categories, user, accessToken] = await Promise.all([
    getCategories(),
    verifySession(),
    getOptionalAccessToken(),
  ]);

  let cartCount = 0;
  if (accessToken) {
    try {
      const cart = await getCart(accessToken);
      cartCount = cart.itemCount;
    } catch {
      cartCount = 0;
    }
  }

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-border-subtle">
      <div className="bg-navy text-white text-[12.8px] font-semibold">
        <div className="max-w-[1280px] mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span>{dict.common.freeShippingBanner}</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href={`/${lang}/trade-in`} className="text-white hover:text-white/80">
              {dict.common.tradeIn}
            </Link>
            <span className="opacity-50">|</span>
            <span>{dict.nav.contactPhone}</span>
            <span className="opacity-50">|</span>
            <LanguageSwitcher lang={lang} />
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-4 flex items-center gap-4 flex-wrap">
        <Link href={`/${lang}`} className="flex items-center gap-2 flex-none">
          <span className="w-8 h-8 rounded-lg bg-brand-red grid place-items-center">
            <span className="w-3 h-3 rounded-full border-2 border-white block" />
          </span>
          <span className="text-[22px] font-extrabold tracking-tight">
            Snap<span className="text-brand-red">Lab</span>
          </span>
        </Link>

        <form
          action={`/${lang}/products`}
          method="GET"
          className="flex-1 flex items-center bg-background border border-border-subtle rounded-lg overflow-hidden max-w-xl order-4 md:order-none basis-full md:basis-auto"
        >
          <input
            type="search"
            name="search"
            placeholder={dict.nav.searchPlaceholder}
            aria-label={dict.nav.searchAriaLabel}
            className="flex-1 border-0 bg-transparent px-4 py-3 text-sm font-semibold outline-none"
          />
          <button
            type="submit"
            className="border-0 bg-brand-red text-white text-sm font-bold px-6 py-3 cursor-pointer hover:bg-brand-red-dark transition-colors"
          >
            {dict.nav.searchButton}
          </button>
        </form>

        <div className="flex items-center gap-2 ml-auto">
          <Link
            href={user ? `/${lang}/account` : `/${lang}/login`}
            className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-background"
          >
            {user ? user.fullName : dict.nav.login}
          </Link>
          <Link
            href={`/${lang}/cart`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold border border-border-subtle rounded-lg bg-white hover:border-brand-red transition-colors"
          >
            <span>{dict.nav.cart}</span>
            <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-brand-red text-white text-[12.8px] grid place-items-center">
              {cartCount}
            </span>
          </Link>
        </div>

        <div className="md:hidden">
          <LanguageSwitcher lang={lang} />
        </div>
      </div>

      <nav className="border-t border-[#f0f4f8]">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center gap-1 overflow-x-auto">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${lang}/products?category=${cat.slug}`}
              className="px-4 py-3 text-sm font-semibold whitespace-nowrap hover:text-brand-red transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

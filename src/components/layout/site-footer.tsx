import Link from 'next/link';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n-config';

export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const footerColumns = [
    {
      title: dict.footer.shoppingTitle,
      links: [
        { label: dict.footer.linkMirrorless, href: `/${lang}/products?category=mirrorless-cameras` },
        { label: dict.footer.linkLenses, href: `/${lang}/products?category=lenses` },
        { label: dict.footer.linkUsed, href: `/${lang}/products?category=certified-used` },
        { label: dict.footer.linkAllProducts, href: `/${lang}/products` },
      ],
    },
    {
      title: dict.footer.customerServiceTitle,
      links: [
        { label: dict.footer.linkTrackOrder, href: `/${lang}/account/orders` },
        { label: dict.common.tradeIn, href: `/${lang}/trade-in` },
        { label: dict.footer.linkContact, href: '#' },
        { label: dict.footer.linkRepairCenter, href: '#' },
      ],
    },
    {
      title: dict.footer.aboutTitle,
      links: [
        { label: dict.footer.linkOurStory, href: '#' },
        { label: dict.footer.linkBranches, href: '#' },
        { label: dict.footer.linkCareers, href: '#' },
        { label: dict.footer.linkPrivacy, href: '#' },
      ],
    },
  ];

  return (
    <footer className="mt-8 bg-navy text-white">
      <div className="max-w-[1280px] mx-auto px-4 py-12 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <div className="flex flex-col gap-2 pr-12">
          <span className="text-[22px] font-extrabold">
            Snap<span className="text-brand-red">Lab</span>
          </span>
          <span className="text-sm font-semibold leading-relaxed opacity-70">
            {dict.footer.description}
          </span>
          <span className="text-[12.8px] font-semibold opacity-55 mt-2">
            {dict.footer.registrationNumber}
          </span>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title} className="flex flex-col gap-2">
            <span className="text-sm font-bold">{col.title}</span>
            {col.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white text-sm font-semibold opacity-70 hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4 text-[12.8px] font-semibold opacity-60">
          <span>{dict.footer.copyright.replace('{year}', String(year))}</span>
          <span>{dict.footer.paymentNote}</span>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/dal';
import { logoutAction } from '@/app/actions/auth';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n-config';
import { ProfileCard } from '@/components/storefront/profile-card';
import { ChangePasswordForm } from '@/components/storefront/change-password-form';

export default async function AccountPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const user = await requireUser();

  return (
    <main className="max-w-[720px] mx-auto p-4 flex flex-col gap-6">
      <h1 className="text-xl font-extrabold mt-2">{dict.account.title}</h1>

      <ProfileCard user={user} dict={dict} />

      <ChangePasswordForm dict={dict} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={`/${lang}/account/orders`}
          className="bg-white border border-border-subtle rounded-lg p-5 flex items-center gap-4 hover:border-brand-red transition-colors"
        >
          <span className="w-10 h-10 rounded-lg bg-background grid place-items-center flex-none text-brand-red">
            <OrdersIcon />
          </span>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-navy">{dict.account.orderHistory}</span>
            <span className="text-[12.8px] text-text-faint truncate">
              {dict.account.orderHistorySubtitle}
            </span>
          </div>
        </Link>

        <Link
          href={`/${lang}/account/addresses`}
          className="bg-white border border-border-subtle rounded-lg p-5 flex items-center gap-4 hover:border-brand-red transition-colors"
        >
          <span className="w-10 h-10 rounded-lg bg-background grid place-items-center flex-none text-brand-red">
            <AddressIcon />
          </span>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-navy">{dict.account.myAddresses}</span>
            <span className="text-[12.8px] text-text-faint truncate">
              {dict.account.addressesSubtitle}
            </span>
          </div>
        </Link>
      </div>

      <form action={logoutAction}>
        <button
          type="submit"
          className="w-full sm:w-auto text-sm font-bold px-6 py-3 rounded-lg border border-border-subtle text-red-600 hover:border-red-600 hover:bg-red-50 transition-colors"
        >
          {dict.account.logout}
        </button>
      </form>
    </main>
  );
}

function iconProps() {
  return {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
}

function OrdersIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function AddressIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

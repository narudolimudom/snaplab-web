import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUserAccessToken } from '@/lib/dal';
import { getAddresses } from '@/lib/addresses';
import { AddressForm } from '@/components/storefront/address-form';
import { AddressListItem } from '@/components/storefront/address-list-item';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n-config';

export default async function AccountAddressesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const accessToken = await requireUserAccessToken();
  const addresses = await getAddresses(accessToken);

  return (
    <main className="max-w-[720px] mx-auto p-4 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 mt-2">
        <h1 className="text-xl font-extrabold">{dict.account.addressesTitle}</h1>
        <Link href={`/${lang}/account`} className="text-sm font-semibold underline">
          {dict.account.backToAccount}
        </Link>
      </div>

      {addresses.length === 0 ? (
        <p className="text-sm text-text-faint">{dict.account.noAddresses}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {addresses.map((addr) => (
            <AddressListItem key={addr.id} addr={addr} dict={dict} />
          ))}
        </div>
      )}

      <section className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-4">
        <h2 className="font-bold">{dict.common.addNewAddress}</h2>
        <AddressForm dict={dict} />
      </section>
    </main>
  );
}

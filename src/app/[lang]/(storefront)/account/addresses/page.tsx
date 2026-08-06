import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUserAccessToken } from '@/lib/dal';
import { getAddresses } from '@/lib/addresses';
import { deleteAddressAction } from '@/app/actions/addresses';
import { AddressForm } from '@/components/storefront/address-form';
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
            <div
              key={addr.id}
              className="bg-white border border-border-subtle rounded-lg p-4 flex items-start justify-between gap-4"
            >
              <div className="text-sm">
                <p className="font-semibold">
                  {addr.recipientName} · {addr.phone}
                  {addr.isDefault && (
                    <span className="ml-2 text-[12.8px] font-bold text-brand-red">
                      {dict.common.defaultAddress}
                    </span>
                  )}
                </p>
                <p className="text-text-muted">
                  {addr.addressLine1}
                  {addr.addressLine2 ? ` ${addr.addressLine2}` : ''} ต.{addr.subdistrict}{' '}
                  อ.{addr.district} จ.{addr.province} {addr.postalCode}
                </p>
              </div>
              <form action={deleteAddressAction.bind(null, addr.id)}>
                <button
                  type="submit"
                  className="text-[12.8px] font-semibold text-text-faint hover:text-brand-red"
                >
                  {dict.common.delete}
                </button>
              </form>
            </div>
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

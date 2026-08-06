import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/dal';
import { logoutAction } from '@/app/actions/auth';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n-config';

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
    <main className="flex flex-col items-center justify-center gap-4 p-16">
      <h1 className="text-xl font-semibold">{dict.account.title}</h1>
      <div className="text-sm text-center">
        <p>{dict.account.nameLabel.replace('{name}', user.fullName)}</p>
        <p>{dict.account.emailLabelValue.replace('{email}', user.email)}</p>
        <p>
          {dict.account.roleLabel.replace(
            '{role}',
            user.role === 'admin' ? dict.account.roleAdmin : dict.account.roleCustomer,
          )}
        </p>
      </div>
      <div className="flex gap-4">
        <Link href={`/${lang}/account/orders`} className="underline">
          {dict.account.orderHistory}
        </Link>
        <Link href={`/${lang}/account/addresses`} className="underline">
          {dict.checkout.shippingAddress}
        </Link>
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="bg-brand-red text-white rounded-lg px-4 py-2"
        >
          {dict.account.logout}
        </button>
      </form>
    </main>
  );
}

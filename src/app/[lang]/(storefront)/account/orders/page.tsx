import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUserAccessToken } from '@/lib/dal';
import { getOrders } from '@/lib/orders';
import { OrderStatusBadge } from '@/components/storefront/order-status-badge';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n-config';

export default async function AccountOrdersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const accessToken = await requireUserAccessToken();
  const orders = await getOrders(accessToken);

  return (
    <main className="max-w-[720px] mx-auto p-4 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 mt-2">
        <h1 className="text-xl font-extrabold">{dict.account.orderHistoryTitle}</h1>
        <Link href={`/${lang}/account`} className="text-sm font-semibold underline">
          {dict.account.backToAccount}
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-text-faint">{dict.account.noOrders}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/${lang}/orders/${order.id}/confirmation`}
              className="bg-white border border-border-subtle rounded-lg p-4 flex items-center justify-between gap-4 hover:border-brand-red transition-colors"
            >
              <div className="text-sm">
                <p className="font-bold">{order.orderNumber}</p>
                <p className="text-text-muted">
                  {new Date(order.createdAt).toLocaleDateString(
                    lang === 'th' ? 'th-TH' : 'en-US',
                    { dateStyle: 'medium' },
                  )}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-brand-red">
                  ฿{Number(order.total).toLocaleString()}
                </span>
                <OrderStatusBadge status={order.status} dict={dict} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUserAccessToken } from '@/lib/dal';
import { getOrderById } from '@/lib/orders';
import { ApiError } from '@/lib/api';
import { BANK_ACCOUNT } from '@/lib/site-config';
import { OrderStatusBadge } from '@/components/storefront/order-status-badge';
import { SlipUploadForm } from '@/components/storefront/slip-upload-form';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n-config';

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const accessToken = await requireUserAccessToken();

  let order;
  try {
    order = await getOrderById(id, accessToken);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  return (
    <main className="max-w-[720px] mx-auto p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 mt-2">
        <h1 className="text-xl font-extrabold">
          {dict.confirmation.orderTitle.replace('{orderNumber}', order.orderNumber)}
        </h1>
        <OrderStatusBadge status={order.status} dict={dict} />
      </div>

      {order.status === 'pending_payment' && (
        <section className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-4">
          <h2 className="font-bold">{dict.confirmation.pleasePayTitle}</h2>
          {order.paymentSlips[0]?.status === 'rejected' && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
              {dict.confirmation.slipRejected.replace(
                '{reason}',
                order.paymentSlips[0].rejectionReason ?? '',
              )}
            </p>
          )}
          <p className="text-sm text-text-muted">{dict.confirmation.transferInstructions}</p>
          <div className="bg-background rounded-lg p-4 flex flex-col gap-1 text-sm font-semibold">
            <span>{BANK_ACCOUNT.bankName}</span>
            <span className="text-lg font-extrabold text-brand-red">
              {BANK_ACCOUNT.accountNumber}
            </span>
            <span className="text-text-muted">{BANK_ACCOUNT.accountName}</span>
          </div>
          <SlipUploadForm orderId={order.id} dict={dict} />
        </section>
      )}

      {order.status === 'pending_verification' && (
        <section className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-2">
          <h2 className="font-bold">{dict.confirmation.pendingVerificationTitle}</h2>
          <p className="text-sm text-text-muted">
            {dict.confirmation.pendingVerificationDesc}
          </p>
        </section>
      )}

      {order.status === 'confirmed' && (
        <section className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-2">
          <h2 className="font-bold">{dict.confirmation.confirmedTitle}</h2>
          <p className="text-sm text-text-muted">{dict.confirmation.confirmedDesc}</p>
        </section>
      )}

      {order.status === 'shipped' && (
        <section className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-2">
          <h2 className="font-bold">{dict.confirmation.shippedTitle}</h2>
          <p className="text-sm text-text-muted">{dict.confirmation.shippedDesc}</p>
        </section>
      )}

      {order.status === 'completed' && (
        <section className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-2">
          <h2 className="font-bold">{dict.confirmation.completedTitle}</h2>
          <p className="text-sm text-text-muted">{dict.confirmation.completedDesc}</p>
        </section>
      )}

      {order.status === 'cancelled' && (
        <section className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-2">
          <h2 className="font-bold">{dict.confirmation.cancelledTitle}</h2>
          <p className="text-sm text-text-muted">{dict.confirmation.cancelledDesc}</p>
        </section>
      )}

      <section className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-3">
        <h2 className="font-bold">{dict.confirmation.itemsTitle}</h2>
        <div className="flex flex-col gap-2 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-2">
              <span className="text-text-muted">
                {item.productNameSnapshot}
                {item.variantLabelSnapshot ? ` (${item.variantLabelSnapshot})` : ''} ×{' '}
                {item.quantity}
              </span>
              <span className="font-semibold whitespace-nowrap">
                ฿{Number(item.lineTotal).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-sm font-semibold border-t border-[#f0f4f8] pt-4">
          <div className="flex justify-between">
            <span className="text-text-muted">{dict.common.subtotal}</span>
            <span>฿{Number(order.subtotal).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">{dict.common.shippingFee}</span>
            <span>
              {Number(order.shippingFee) === 0
                ? dict.common.free
                : `฿${Number(order.shippingFee).toLocaleString()}`}
            </span>
          </div>
        </div>
        <div className="flex items-baseline justify-between border-t border-[#f0f4f8] pt-4">
          <span className="text-sm font-bold">{dict.common.total}</span>
          <span className="text-xl font-extrabold text-brand-red">
            ฿{Number(order.total).toLocaleString()}
          </span>
        </div>
      </section>

      <section className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-1 text-sm">
        <h2 className="font-bold mb-2">{dict.checkout.shippingAddress}</h2>
        <span className="font-semibold">
          {order.shippingAddress.recipientName} · {order.shippingAddress.phone}
        </span>
        <span className="text-text-muted">
          {order.shippingAddress.addressLine1}
          {order.shippingAddress.addressLine2
            ? ` ${order.shippingAddress.addressLine2}`
            : ''}{' '}
          ต.{order.shippingAddress.subdistrict} อ.{order.shippingAddress.district} จ.
          {order.shippingAddress.province} {order.shippingAddress.postalCode}
        </span>
      </section>

      <div className="flex gap-4">
        <Link
          href={`/${lang}/account/orders`}
          className="border border-border-subtle bg-white text-sm font-bold px-6 py-3 rounded-lg hover:border-brand-red"
        >
          {dict.confirmation.viewOrderHistory}
        </Link>
        <Link
          href={`/${lang}/products`}
          className="bg-brand-red text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-brand-red-dark"
        >
          {dict.common.continueShopping}
        </Link>
      </div>
    </main>
  );
}

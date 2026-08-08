import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { requireUserAccessToken } from '@/lib/dal';
import { getCart } from '@/lib/cart';
import { getAddresses } from '@/lib/addresses';
import { calculateShippingFee } from '@/lib/site-config';
import { AddressForm } from '@/components/storefront/address-form';
import { OrderForm } from '@/components/storefront/order-form';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n-config';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const accessToken = await requireUserAccessToken();
  const [cart, addresses] = await Promise.all([
    getCart(accessToken),
    getAddresses(accessToken),
  ]);

  if (cart.items.length === 0) {
    redirect(`/${lang}/cart`);
  }

  const subtotal = Number(cart.subtotal);
  const shippingFee = calculateShippingFee(subtotal);
  const total = subtotal + shippingFee;

  return (
    <main className="max-w-[1280px] mx-auto p-4 flex flex-col gap-4">
      <h1 className="text-xl font-extrabold mt-2">{dict.checkout.title}</h1>

      <div className="flex flex-wrap gap-4 items-start">
        <div className="flex-[3_1_480px] min-w-[min(100%,380px)] flex flex-col gap-6">
          <section className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-4">
            <h2 className="font-bold">{dict.checkout.shippingAddress}</h2>

            {addresses.length === 0 ? (
              <p className="text-sm text-text-faint">{dict.checkout.noAddress}</p>
            ) : (
              <OrderForm addresses={addresses} dict={dict} />
            )}
          </section>

          <section className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-4">
            <h2 className="font-bold">{dict.common.addNewAddress}</h2>
            <AddressForm dict={dict} />
          </section>
        </div>

        <aside className="flex-[1_1_300px] min-w-[280px] max-w-[380px] bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-4">
          <span className="text-lg font-extrabold">{dict.common.orderSummary}</span>

          <div className="flex flex-col gap-2 text-sm">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-2">
                <span className="text-text-muted">
                  {item.product.name} × {item.quantity}
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
              <span>฿{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">{dict.common.shippingFee}</span>
              <span className={shippingFee === 0 ? 'text-green-700' : ''}>
                {shippingFee === 0 ? dict.common.free : `฿${shippingFee.toLocaleString()}`}
              </span>
            </div>
          </div>

          <div className="flex items-baseline justify-between border-t border-[#f0f4f8] pt-4">
            <span className="text-sm font-bold">{dict.common.total}</span>
            <span className="text-xl font-extrabold text-brand-red">
              ฿{total.toLocaleString()}
            </span>
          </div>

          <Link
            href={`/${lang}/cart`}
            className="text-sm font-semibold text-text-muted underline"
          >
            {dict.checkout.editCart}
          </Link>
        </aside>
      </div>
    </main>
  );
}

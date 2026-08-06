import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUserAccessToken } from '@/lib/dal';
import { getCart } from '@/lib/cart';
import { getPublicUploadUrl } from '@/lib/catalog';
import { calculateShippingFee } from '@/lib/site-config';
import { updateCartItemAction, removeCartItemAction } from '@/app/actions/cart';
import { DiscountCodeField } from '@/components/storefront/discount-code-field';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n-config';

export default async function CartPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const accessToken = await requireUserAccessToken();
  const cart = await getCart(accessToken);

  const subtotal = Number(cart.subtotal);
  const shippingFee = calculateShippingFee(subtotal);
  const total = subtotal + shippingFee;

  return (
    <main className="max-w-[1280px] mx-auto p-4 flex flex-col gap-4">
      <h1 className="text-xl font-extrabold mt-2">{dict.cart.title}</h1>

      <div className="flex flex-wrap gap-4 items-start">
        <div className="flex-[3_1_520px] min-w-[min(100%,420px)] flex flex-col gap-2">
          {cart.items.length === 0 ? (
            <div className="bg-white border border-dashed border-border-subtle rounded-lg p-12 flex flex-col items-center gap-2">
              <span className="text-lg font-extrabold">{dict.cart.emptyTitle}</span>
              <span className="text-sm text-text-faint">{dict.cart.emptyDesc}</span>
              <Link
                href={`/${lang}/products`}
                className="mt-2 bg-brand-red text-white text-sm font-bold px-6 py-3 rounded-lg"
              >
                {dict.cart.browseProducts}
              </Link>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-border-subtle rounded-lg p-4 flex gap-4 items-center flex-wrap"
              >
                <div className="w-24 h-24 flex-none rounded-lg bg-background overflow-hidden relative">
                  {item.product.imagePath && (
                    <Image
                      src={getPublicUploadUrl(item.product.imagePath)}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                  <Link
                    href={`/${lang}/products/${item.product.slug}`}
                    className="text-sm font-semibold hover:text-brand-red"
                  >
                    {item.product.name}
                  </Link>
                  <span className="text-[12.8px] font-semibold text-text-faint">
                    {[item.variant.size, item.variant.color].filter(Boolean).join(' / ') ||
                      item.variant.sku}
                  </span>
                  <span className="text-[12.8px] font-semibold text-text-faint">
                    {dict.cart.unitPrice.replace(
                      '{price}',
                      Number(item.unitPrice).toLocaleString(),
                    )}
                  </span>
                </div>

                <div className="flex items-center border border-border-subtle rounded-lg overflow-hidden">
                  <form
                    action={updateCartItemAction.bind(null, item.id, item.quantity - 1)}
                  >
                    <button
                      type="submit"
                      disabled={item.quantity <= 1}
                      aria-label={dict.common.decrease}
                      className="border-0 bg-white cursor-pointer px-4 py-2 text-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                  </form>
                  <span className="min-w-[44px] text-center text-sm font-bold">
                    {item.quantity}
                  </span>
                  <form
                    action={updateCartItemAction.bind(null, item.id, item.quantity + 1)}
                  >
                    <button
                      type="submit"
                      disabled={item.quantity >= item.variant.stockQuantity}
                      aria-label={dict.common.increase}
                      className="border-0 bg-white cursor-pointer px-4 py-2 text-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </form>
                </div>

                <div className="ml-auto flex flex-col items-end gap-1 min-w-[110px]">
                  <span className="text-xl font-extrabold text-brand-red">
                    ฿{Number(item.lineTotal).toLocaleString()}
                  </span>
                  <form action={removeCartItemAction.bind(null, item.id)}>
                    <button
                      type="submit"
                      className="border-0 bg-transparent cursor-pointer text-[12.8px] font-semibold text-text-faint hover:text-brand-red"
                    >
                      {dict.common.remove}
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}

          <Link
            href={`/${lang}/products`}
            className="self-start mt-2 border border-border-subtle bg-white text-sm font-bold px-6 py-3 rounded-lg hover:border-brand-red"
          >
            ← {dict.common.continueShopping}
          </Link>
        </div>

        {cart.items.length > 0 && (
          <aside className="flex-[1_1_300px] min-w-[280px] max-w-[380px] bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-4">
            <span className="text-lg font-extrabold">{dict.common.orderSummary}</span>

            <DiscountCodeField dict={dict} />

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
              href={`/${lang}/checkout`}
              className="w-full text-center bg-brand-red text-white text-lg font-bold py-4 rounded-lg hover:bg-brand-red-dark transition-colors"
            >
              {dict.cart.checkoutButton}
            </Link>
            <span className="text-[12.8px] font-semibold text-text-faint leading-relaxed">
              {dict.common.paymentNote}
            </span>
          </aside>
        )}
      </div>
    </main>
  );
}

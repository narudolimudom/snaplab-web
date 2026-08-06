import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdminAccessToken } from '@/lib/dal';
import { getAdminOrderById } from '@/lib/orders';
import { ApiError } from '@/lib/api';
import { updateOrderStatusAction } from '@/app/actions/orders';
import { OrderStatusBadge } from '@/components/storefront/order-status-badge';
import thDict from '@/dictionaries/th.json';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accessToken = await requireAdminAccessToken();

  let order;
  try {
    order = await getAdminOrderById(id, accessToken);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  const nextStatus =
    order.status === 'confirmed'
      ? 'shipped'
      : order.status === 'shipped'
        ? 'completed'
        : null;
  const nextStatusLabel =
    nextStatus === 'shipped' ? 'ทำเครื่องหมายว่าจัดส่งแล้ว' : 'ทำเครื่องหมายว่าสำเร็จ';

  return (
    <main className="max-w-2xl mx-auto p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">คำสั่งซื้อ {order.orderNumber}</h1>
        <Link href="/admin/orders" className="text-sm underline">
          กลับรายการคำสั่งซื้อ
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <OrderStatusBadge status={order.status} dict={thDict} />
        {nextStatus && (
          <form action={updateOrderStatusAction.bind(null, order.id, nextStatus)}>
            <button
              type="submit"
              className="bg-black text-white text-sm font-bold px-4 py-2 rounded-lg"
            >
              {nextStatusLabel}
            </button>
          </form>
        )}
      </div>

      <section className="border rounded-lg p-4 flex flex-col gap-2">
        <h2 className="font-bold text-sm">รายการสินค้า</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between gap-2 text-sm">
            <span className="text-zinc-600">
              {item.productNameSnapshot}
              {item.variantLabelSnapshot ? ` (${item.variantLabelSnapshot})` : ''} ×{' '}
              {item.quantity}
            </span>
            <span className="font-semibold whitespace-nowrap">
              ฿{Number(item.lineTotal).toLocaleString()}
            </span>
          </div>
        ))}
        <div className="flex justify-between text-sm font-bold border-t pt-2 mt-2">
          <span>ยอดรวมทั้งหมด</span>
          <span>฿{Number(order.total).toLocaleString()}</span>
        </div>
      </section>

      <section className="border rounded-lg p-4 flex flex-col gap-1 text-sm">
        <h2 className="font-bold mb-1">ที่อยู่จัดส่ง</h2>
        <span className="font-semibold">
          {order.shippingAddress.recipientName} · {order.shippingAddress.phone}
        </span>
        <span className="text-zinc-600">
          {order.shippingAddress.addressLine1}
          {order.shippingAddress.addressLine2
            ? ` ${order.shippingAddress.addressLine2}`
            : ''}{' '}
          ต.{order.shippingAddress.subdistrict} อ.{order.shippingAddress.district} จ.
          {order.shippingAddress.province} {order.shippingAddress.postalCode}
        </span>
      </section>

      {order.paymentSlips.length > 0 && (
        <section className="border rounded-lg p-4 flex flex-col gap-2 text-sm">
          <h2 className="font-bold mb-1">ประวัติสลิปการชำระเงิน</h2>
          {order.paymentSlips.map((slip) => (
            <div
              key={slip.id}
              className="flex justify-between gap-2 border-b pb-2 last:border-b-0 last:pb-0"
            >
              <span className="text-zinc-600">
                {new Date(slip.uploadedAt).toLocaleString('th-TH', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
                {slip.status === 'rejected' && slip.rejectionReason
                  ? ` — ${slip.rejectionReason}`
                  : ''}
              </span>
              <span
                className={`text-[12.8px] font-bold px-2 py-1 rounded-full ${
                  slip.status === 'pending'
                    ? 'bg-amber-100 text-amber-800'
                    : slip.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {slip.status === 'pending'
                  ? 'รอตรวจสอบ'
                  : slip.status === 'approved'
                    ? 'อนุมัติแล้ว'
                    : 'ปฏิเสธแล้ว'}
              </span>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

import Link from 'next/link';
import { requireAdminAccessToken } from '@/lib/dal';
import { getAdminOrders } from '@/lib/orders';
import { OrderStatusBadge } from '@/components/storefront/order-status-badge';
import thDict from '@/dictionaries/th.json';
import type { OrderStatus } from '@/lib/order-types';

const STATUS_TABS: { value?: OrderStatus; label: string }[] = [
  { value: undefined, label: 'ทั้งหมด' },
  { value: 'pending_payment', label: 'รอชำระเงิน' },
  { value: 'pending_verification', label: 'รอตรวจสอบสลิป' },
  { value: 'confirmed', label: 'ยืนยันแล้ว' },
  { value: 'shipped', label: 'จัดส่งแล้ว' },
  { value: 'completed', label: 'สำเร็จ' },
  { value: 'cancelled', label: 'ยกเลิก' },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const accessToken = await requireAdminAccessToken();
  const params = await searchParams;
  const status = params.status as OrderStatus | undefined;

  const orders = await getAdminOrders(accessToken, status);

  return (
    <main className="max-w-4xl w-full min-w-0 mx-auto p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">จัดการคำสั่งซื้อ</h1>
        <Link href="/admin/dashboard" className="text-sm underline">
          กลับแดชบอร์ด
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.label}
            href={tab.value ? `/admin/orders?status=${tab.value}` : '/admin/orders'}
            className={`text-sm font-semibold px-3 py-1.5 rounded-lg border ${
              status === tab.value
                ? 'bg-brand-red text-white border-brand-red'
                : 'border-border-subtle'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-zinc-500">ไม่มีคำสั่งซื้อในหมวดนี้</p>
      ) : (
        <div className="overflow-x-auto min-w-0">
          <table className="text-sm border">
            <thead>
              <tr className="border-b bg-zinc-50">
                <th className="text-left p-2">เลขคำสั่งซื้อ</th>
                <th className="text-left p-2">ยอดรวม</th>
                <th className="text-left p-2">วันที่สั่งซื้อ</th>
                <th className="text-left p-2">สถานะ</th>
                <th className="text-left p-2"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-2 whitespace-nowrap">{order.orderNumber}</td>
                  <td className="p-2 whitespace-nowrap">
                    ฿{Number(order.total).toLocaleString()}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('th-TH', {
                      dateStyle: 'medium',
                    })}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} dict={thDict} />
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <Link href={`/admin/orders/${order.id}`} className="underline">
                      ดูรายละเอียด
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

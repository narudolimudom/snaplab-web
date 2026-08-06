import Link from 'next/link';
import Image from 'next/image';
import { requireAdminAccessToken } from '@/lib/dal';
import { getAdminPaymentSlips } from '@/lib/payment-slips';
import { approveSlipAction, rejectSlipAction } from '@/app/actions/payment-slips';
import type { PaymentSlipStatus } from '@/lib/order-types';

const STATUS_TABS: { value: PaymentSlipStatus; label: string }[] = [
  { value: 'pending', label: 'รอตรวจสอบ' },
  { value: 'approved', label: 'อนุมัติแล้ว' },
  { value: 'rejected', label: 'ปฏิเสธแล้ว' },
];

export default async function AdminPaymentSlipsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const accessToken = await requireAdminAccessToken();
  const params = await searchParams;
  const status: PaymentSlipStatus =
    params.status === 'approved' || params.status === 'rejected'
      ? params.status
      : 'pending';

  const slips = await getAdminPaymentSlips(accessToken, status);

  return (
    <main className="max-w-3xl mx-auto p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">ตรวจสอบสลิปการชำระเงิน</h1>
        <Link href="/admin/dashboard" className="text-sm underline">
          กลับแดชบอร์ด
        </Link>
      </div>

      <div className="flex gap-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/payment-slips?status=${tab.value}`}
            className={`text-sm font-semibold px-4 py-2 rounded-lg border ${
              status === tab.value
                ? 'bg-brand-red text-white border-brand-red'
                : 'border-border-subtle'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {slips.length === 0 ? (
        <p className="text-sm text-zinc-500">ไม่มีรายการในหมวดนี้</p>
      ) : (
        <div className="flex flex-col gap-4">
          {slips.map((slip) => (
            <div
              key={slip.id}
              className="border border-border-subtle rounded-lg p-4 flex gap-4 flex-wrap"
            >
              <div className="relative w-32 h-32 flex-none border border-border-subtle rounded-lg overflow-hidden bg-background">
                <Image
                  src={slip.imageUrl}
                  alt="สลิปการโอนเงิน"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex-1 min-w-[200px] flex flex-col gap-1 text-sm">
                <span className="font-bold">{slip.order.orderNumber}</span>
                <span className="text-text-muted">
                  ยอดชำระ ฿{Number(slip.order.total).toLocaleString()}
                </span>
                <span className="text-text-faint text-[12.8px]">
                  อัปโหลดเมื่อ{' '}
                  {new Date(slip.uploadedAt).toLocaleString('th-TH', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
                {slip.status === 'rejected' && slip.rejectionReason && (
                  <span className="text-red-600 text-[12.8px]">
                    เหตุผลที่ปฏิเสธ: {slip.rejectionReason}
                  </span>
                )}
              </div>

              {slip.status === 'pending' && (
                <div className="flex flex-col gap-2 flex-none w-full sm:w-auto">
                  <form action={approveSlipAction.bind(null, slip.id)}>
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-lg"
                    >
                      อนุมัติ
                    </button>
                  </form>
                  <form
                    action={rejectSlipAction.bind(null, slip.id)}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      name="reason"
                      required
                      placeholder="เหตุผลที่ปฏิเสธ"
                      className="border border-border-subtle rounded-lg px-3 py-2 text-sm flex-1"
                    />
                    <button
                      type="submit"
                      className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg whitespace-nowrap"
                    >
                      ปฏิเสธ
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

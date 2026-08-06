import Link from 'next/link';
import { requireAdmin } from '@/lib/dal';
import { adminLogoutAction } from '@/app/actions/auth';

export default async function AdminDashboardPage() {
  const user = await requireAdmin();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
      <h1 className="text-xl font-semibold">แดชบอร์ดแอดมิน</h1>
      <p className="text-sm">ยินดีต้อนรับ, {user.fullName}</p>
      <div className="flex gap-4">
        <Link href="/admin/products" className="underline">
          จัดการสินค้า
        </Link>
        <Link href="/admin/categories" className="underline">
          จัดการหมวดหมู่
        </Link>
        <Link href="/admin/payment-slips" className="underline">
          ตรวจสอบสลิป
        </Link>
        <Link href="/admin/orders" className="underline">
          จัดการคำสั่งซื้อ
        </Link>
      </div>
      <form action={adminLogoutAction}>
        <button
          type="submit"
          className="bg-black text-white rounded px-4 py-2"
        >
          ออกจากระบบ
        </button>
      </form>
    </main>
  );
}

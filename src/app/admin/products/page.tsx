import Link from 'next/link';
import { requireAdminAccessToken } from '@/lib/dal';
import { getAdminProducts } from '@/lib/catalog';
import { deleteProductAction } from '@/app/actions/admin-catalog';

const STATUS_LABEL: Record<string, string> = {
  draft: 'ฉบับร่าง',
  published: 'เผยแพร่',
  archived: 'เก็บถาวร',
};

export default async function AdminProductsPage() {
  const accessToken = await requireAdminAccessToken();
  const result = await getAdminProducts({}, accessToken);

  return (
    <main className="max-w-4xl w-full min-w-0 mx-auto p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">จัดการสินค้า</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/admin/categories" className="underline">
            หมวดหมู่
          </Link>
          <Link href="/admin/dashboard" className="underline">
            กลับแดชบอร์ด
          </Link>
          <Link
            href="/admin/products/new"
            className="bg-black text-white rounded px-3 py-1"
          >
            + เพิ่มสินค้า
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto min-w-0">
        <table className="text-sm border">
          <thead>
            <tr className="border-b bg-zinc-50">
              <th className="text-left p-2">ชื่อสินค้า</th>
              <th className="text-left p-2">ราคา</th>
              <th className="text-left p-2">สถานะ</th>
              <th className="text-left p-2"></th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2 whitespace-nowrap">{p.name}</td>
                <td className="p-2 whitespace-nowrap">
                  ฿{Number(p.basePrice).toLocaleString()}
                </td>
                <td className="p-2 whitespace-nowrap">{STATUS_LABEL[p.status]}</td>
                <td className="p-2 flex gap-3 whitespace-nowrap">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="underline"
                  >
                    แก้ไข
                  </Link>
                  <form
                    action={async () => {
                      'use server';
                      await deleteProductAction(p.id);
                    }}
                  >
                    <button type="submit" className="text-red-600 underline">
                      ลบ
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {result.items.length === 0 && (
        <p className="text-sm text-zinc-500">ยังไม่มีสินค้า</p>
      )}
    </main>
  );
}

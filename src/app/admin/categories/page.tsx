import Link from 'next/link';
import { requireAdmin } from '@/lib/dal';
import { getCategories } from '@/lib/catalog';
import { deleteCategoryAction } from '@/app/actions/admin-catalog';
import { CategoryForm } from '@/components/admin/category-form';

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await getCategories();

  return (
    <main className="max-w-3xl w-full min-w-0 mx-auto p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">จัดการหมวดหมู่</h1>
        <Link href="/admin/dashboard" className="text-sm underline">
          กลับแดชบอร์ด
        </Link>
      </div>

      <div className="overflow-x-auto min-w-0">
        <table className="text-sm border">
          <thead>
            <tr className="border-b bg-zinc-50">
              <th className="text-left p-2">ชื่อ</th>
              <th className="text-left p-2">Slug</th>
              <th className="text-left p-2"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-2 whitespace-nowrap">{c.name}</td>
                <td className="p-2 whitespace-nowrap">{c.slug}</td>
                <td className="p-2 whitespace-nowrap">
                  <form
                    action={async () => {
                      'use server';
                      await deleteCategoryAction(c.id);
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

      <CategoryForm />
    </main>
  );
}

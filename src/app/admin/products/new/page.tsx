import Link from 'next/link';
import { requireAdmin } from '@/lib/dal';
import { getCategories } from '@/lib/catalog';
import { createProductAction } from '@/app/actions/admin-catalog';
import { ProductForm } from '@/components/admin/product-form';

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getCategories();

  return (
    <main className="max-w-lg mx-auto p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">เพิ่มสินค้าใหม่</h1>
        <Link href="/admin/products" className="text-sm underline">
          กลับรายการสินค้า
        </Link>
      </div>
      <ProductForm action={createProductAction} categories={categories} />
    </main>
  );
}

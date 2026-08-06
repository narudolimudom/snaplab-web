import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { requireAdminAccessToken } from '@/lib/dal';
import { getAdminProductById, getCategories, getPublicUploadUrl } from '@/lib/catalog';
import { ApiError } from '@/lib/api';
import {
  updateProductAction,
  deleteVariantAction,
  deleteImageAction,
} from '@/app/actions/admin-catalog';
import { ProductForm } from '@/components/admin/product-form';
import { VariantForm } from '@/components/admin/variant-form';
import { ImageUploadForm } from '@/components/admin/image-upload-form';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accessToken = await requireAdminAccessToken();

  let product;
  try {
    [product] = await Promise.all([getAdminProductById(id, accessToken)]);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }
  const categories = await getCategories();

  const updateAction = updateProductAction.bind(null, id);

  return (
    <main className="max-w-2xl w-full min-w-0 mx-auto p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">แก้ไขสินค้า: {product.name}</h1>
        <Link href="/admin/products" className="text-sm underline">
          กลับรายการสินค้า
        </Link>
      </div>

      <ProductForm action={updateAction} categories={categories} product={product} />

      <section className="flex flex-col gap-3">
        <h2 className="font-medium">รูปภาพสินค้า</h2>
        <div className="flex flex-wrap gap-3">
          {product.images.map((img) => (
            <div key={img.id} className="flex flex-col gap-1 items-center">
              <div className="relative w-24 h-24 border rounded overflow-hidden">
                <Image
                  src={getPublicUploadUrl(img.path)}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              {img.isPrimary && (
                <span className="text-xs text-green-700">รูปหลัก</span>
              )}
              <form
                action={async () => {
                  'use server';
                  await deleteImageAction(id, img.id);
                }}
              >
                <button type="submit" className="text-xs text-red-600 underline">
                  ลบ
                </button>
              </form>
            </div>
          ))}
        </div>
        <ImageUploadForm productId={id} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium">ตัวเลือกสินค้า (Variants)</h2>
        <div className="overflow-x-auto min-w-0">
          <table className="text-sm border">
            <thead>
              <tr className="border-b bg-zinc-50">
                <th className="text-left p-2">SKU</th>
                <th className="text-left p-2">ไซส์</th>
                <th className="text-left p-2">สี</th>
                <th className="text-left p-2">ราคาเฉพาะ</th>
                <th className="text-left p-2">สต๊อก</th>
                <th className="text-left p-2"></th>
              </tr>
            </thead>
            <tbody>
              {product.variants.map((v) => (
                <tr key={v.id} className="border-b">
                  <td className="p-2 whitespace-nowrap">{v.sku}</td>
                  <td className="p-2 whitespace-nowrap">{v.size ?? '-'}</td>
                  <td className="p-2 whitespace-nowrap">{v.color ?? '-'}</td>
                  <td className="p-2 whitespace-nowrap">
                    {v.priceOverride ? `฿${Number(v.priceOverride).toLocaleString()}` : '-'}
                  </td>
                  <td className="p-2 whitespace-nowrap">{v.stockQuantity}</td>
                  <td className="p-2 whitespace-nowrap">
                    <form
                      action={async () => {
                        'use server';
                        await deleteVariantAction(id, v.id);
                      }}
                    >
                      <button type="submit" className="text-red-600 underline text-xs">
                        ลบ
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {product.variants.length === 0 && (
          <p className="text-sm text-zinc-500">ยังไม่มีตัวเลือกสินค้า</p>
        )}
        <VariantForm productId={id} />
      </section>
    </main>
  );
}

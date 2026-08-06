'use client';

import { useActionState } from 'react';
import type { ProductFormState } from '@/app/actions/admin-catalog';
import type { Category, Product } from '@/lib/catalog-types';

export function ProductForm({
  action,
  categories,
  product,
}: {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: Category[];
  product?: Product;
}) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    action,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-lg">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm">
          ชื่อสินค้า
        </label>
        <input
          id="name"
          name="name"
          defaultValue={product?.name}
          className="border rounded px-3 py-2"
        />
        {state?.errors?.name && (
          <p className="text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="slug" className="text-sm">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={product?.slug}
          className="border rounded px-3 py-2"
        />
        {state?.errors?.slug && (
          <p className="text-sm text-red-600">{state.errors.slug[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="categoryId" className="text-sm">
          หมวดหมู่
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={product?.categoryId}
          className="border rounded px-3 py-2"
        >
          <option value="">-- เลือกหมวดหมู่ --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {state?.errors?.categoryId && (
          <p className="text-sm text-red-600">{state.errors.categoryId[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="basePrice" className="text-sm">
          ราคา (บาท)
        </label>
        <input
          id="basePrice"
          name="basePrice"
          type="number"
          step="0.01"
          defaultValue={product?.basePrice}
          className="border rounded px-3 py-2"
        />
        {state?.errors?.basePrice && (
          <p className="text-sm text-red-600">{state.errors.basePrice[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm">
          รายละเอียด
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={product?.description ?? ''}
          className="border rounded px-3 py-2"
          rows={4}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="text-sm">
          สถานะ
        </label>
        <select
          id="status"
          name="status"
          defaultValue={product?.status ?? 'draft'}
          className="border rounded px-3 py-2"
        >
          <option value="draft">ฉบับร่าง</option>
          <option value="published">เผยแพร่</option>
          <option value="archived">เก็บถาวร</option>
        </select>
      </div>

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-black text-white rounded px-4 py-2 disabled:opacity-50 w-fit"
      >
        {pending ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </form>
  );
}

'use client';

import { useActionState } from 'react';
import {
  createCategoryAction,
  type CategoryFormState,
} from '@/app/actions/admin-catalog';

export function CategoryForm() {
  const [state, action, pending] = useActionState<CategoryFormState, FormData>(
    createCategoryAction,
    undefined,
  );

  return (
    <form
      action={action}
      className="flex flex-col gap-3 max-w-sm border rounded p-4"
    >
      <h2 className="font-medium">เพิ่มหมวดหมู่ใหม่</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm">
          ชื่อหมวดหมู่
        </label>
        <input id="name" name="name" className="border rounded px-3 py-2" />
        {state?.errors?.name && (
          <p className="text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="slug" className="text-sm">
          Slug
        </label>
        <input id="slug" name="slug" className="border rounded px-3 py-2" />
        {state?.errors?.slug && (
          <p className="text-sm text-red-600">{state.errors.slug[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm">
          รายละเอียด (ไม่บังคับ)
        </label>
        <input
          id="description"
          name="description"
          className="border rounded px-3 py-2"
        />
      </div>

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {pending ? 'กำลังบันทึก...' : 'เพิ่มหมวดหมู่'}
      </button>
    </form>
  );
}

'use client';

import { useActionState } from 'react';
import { addVariantAction, type VariantFormState } from '@/app/actions/admin-catalog';

export function VariantForm({ productId }: { productId: string }) {
  const boundAction = addVariantAction.bind(null, productId);
  const [state, action, pending] = useActionState<VariantFormState, FormData>(
    boundAction,
    undefined,
  );

  return (
    <form action={action} className="flex flex-wrap gap-2 items-end border rounded p-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="sku" className="text-xs">
          SKU
        </label>
        <input id="sku" name="sku" className="border rounded px-2 py-1 text-sm w-32" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="size" className="text-xs">
          ไซส์
        </label>
        <input id="size" name="size" className="border rounded px-2 py-1 text-sm w-20" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="color" className="text-xs">
          สี
        </label>
        <input id="color" name="color" className="border rounded px-2 py-1 text-sm w-20" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="priceOverride" className="text-xs">
          ราคาเฉพาะ (ไม่บังคับ)
        </label>
        <input
          id="priceOverride"
          name="priceOverride"
          type="number"
          step="0.01"
          className="border rounded px-2 py-1 text-sm w-28"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="stockQuantity" className="text-xs">
          สต๊อก
        </label>
        <input
          id="stockQuantity"
          name="stockQuantity"
          type="number"
          defaultValue={0}
          className="border rounded px-2 py-1 text-sm w-20"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-black text-white rounded px-3 py-1 text-sm disabled:opacity-50"
      >
        {pending ? '...' : 'เพิ่ม'}
      </button>
      {state?.message && (
        <p className="text-sm text-red-600 basis-full">{state.message}</p>
      )}
      {state?.errors?.sku && (
        <p className="text-sm text-red-600 basis-full">{state.errors.sku[0]}</p>
      )}
    </form>
  );
}

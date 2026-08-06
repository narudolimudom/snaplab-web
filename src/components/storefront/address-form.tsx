'use client';

import { useActionState } from 'react';
import { createAddressAction, type AddressFormState } from '@/app/actions/addresses';
import type { Dictionary } from '@/lib/dictionaries';

export function AddressForm({ dict }: { dict: Dictionary }) {
  const [state, action, pending] = useActionState<AddressFormState, FormData>(
    createAddressAction,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-3 max-w-md">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 col-span-2">
          <label htmlFor="recipientName" className="text-[12.8px] font-bold text-text-muted">
            {dict.address.recipientName}
          </label>
          <input
            id="recipientName"
            name="recipientName"
            className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
          />
          {state?.errors?.recipientName && (
            <p className="text-sm text-red-600">{state.errors.recipientName[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 col-span-2">
          <label htmlFor="phone" className="text-[12.8px] font-bold text-text-muted">
            {dict.address.phone}
          </label>
          <input
            id="phone"
            name="phone"
            className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
          />
          {state?.errors?.phone && (
            <p className="text-sm text-red-600">{state.errors.phone[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 col-span-2">
          <label htmlFor="addressLine1" className="text-[12.8px] font-bold text-text-muted">
            {dict.address.addressLine1}
          </label>
          <input
            id="addressLine1"
            name="addressLine1"
            className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
          />
          {state?.errors?.addressLine1 && (
            <p className="text-sm text-red-600">{state.errors.addressLine1[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 col-span-2">
          <label htmlFor="addressLine2" className="text-[12.8px] font-bold text-text-muted">
            {dict.address.addressLine2}
          </label>
          <input
            id="addressLine2"
            name="addressLine2"
            className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="subdistrict" className="text-[12.8px] font-bold text-text-muted">
            {dict.address.subdistrict}
          </label>
          <input
            id="subdistrict"
            name="subdistrict"
            className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
          />
          {state?.errors?.subdistrict && (
            <p className="text-sm text-red-600">{state.errors.subdistrict[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="district" className="text-[12.8px] font-bold text-text-muted">
            {dict.address.district}
          </label>
          <input
            id="district"
            name="district"
            className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
          />
          {state?.errors?.district && (
            <p className="text-sm text-red-600">{state.errors.district[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="province" className="text-[12.8px] font-bold text-text-muted">
            {dict.address.province}
          </label>
          <input
            id="province"
            name="province"
            className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
          />
          {state?.errors?.province && (
            <p className="text-sm text-red-600">{state.errors.province[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="postalCode" className="text-[12.8px] font-bold text-text-muted">
            {dict.address.postalCode}
          </label>
          <input
            id="postalCode"
            name="postalCode"
            className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
          />
          {state?.errors?.postalCode && (
            <p className="text-sm text-red-600">{state.errors.postalCode[0]}</p>
          )}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-text-muted cursor-pointer">
        <input type="checkbox" name="isDefault" className="w-4 h-4 accent-brand-red" />
        <span>{dict.address.setDefault}</span>
      </label>

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit bg-brand-red text-white text-sm font-bold px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {pending ? dict.common.saving : dict.address.save}
      </button>
    </form>
  );
}

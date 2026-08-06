'use client';

import { useActionState } from 'react';
import { createOrderAction, type CreateOrderState } from '@/app/actions/orders';
import type { Address } from '@/lib/address-types';
import type { Dictionary } from '@/lib/dictionaries';

export function OrderForm({ addresses, dict }: { addresses: Address[]; dict: Dictionary }) {
  const [state, action, pending] = useActionState<CreateOrderState, FormData>(
    createOrderAction,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      {addresses.map((addr) => (
        <label
          key={addr.id}
          className="flex items-start gap-3 border border-border-subtle rounded-lg p-4 text-sm font-semibold cursor-pointer has-[:checked]:border-brand-red"
        >
          <input
            type="radio"
            name="addressId"
            value={addr.id}
            defaultChecked={addr.isDefault}
            className="mt-1 accent-brand-red"
          />
          <span className="flex flex-col gap-0.5">
            <span>
              {addr.recipientName} · {addr.phone}
              {addr.isDefault && (
                <span className="ml-2 text-[12.8px] font-bold text-brand-red">
                  {dict.common.defaultAddress}
                </span>
              )}
            </span>
            <span className="text-text-muted font-normal">
              {addr.addressLine1}
              {addr.addressLine2 ? ` ${addr.addressLine2}` : ''} ต.{addr.subdistrict} อ.
              {addr.district} จ.{addr.province} {addr.postalCode}
            </span>
          </span>
        </label>
      ))}

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-brand-red text-white text-lg font-bold py-4 rounded-lg disabled:opacity-50"
      >
        {pending ? dict.checkout.creatingOrder : dict.checkout.confirmOrder}
      </button>
    </form>
  );
}

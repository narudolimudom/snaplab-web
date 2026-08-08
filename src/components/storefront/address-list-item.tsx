'use client';

import { useState } from 'react';
import { deleteAddressAction, setDefaultAddressAction } from '@/app/actions/addresses';
import { AddressForm } from './address-form';
import type { Dictionary } from '@/lib/dictionaries';
import type { Address } from '@/lib/address-types';

export function AddressListItem({
  addr,
  dict,
}: {
  addr: Address;
  dict: Dictionary;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="bg-white border border-border-subtle rounded-lg p-4">
        <AddressForm
          dict={dict}
          address={addr}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white border border-border-subtle rounded-lg p-4 flex items-start justify-between gap-4">
      <div className="text-sm">
        <p className="font-semibold">
          {addr.recipientName} · {addr.phone}
          {addr.isDefault && (
            <span className="ml-2 text-[12.8px] font-bold text-brand-red">
              {dict.common.defaultAddress}
            </span>
          )}
        </p>
        <p className="text-text-muted">
          {addr.addressLine1}
          {addr.addressLine2 ? ` ${addr.addressLine2}` : ''} ต.{addr.subdistrict} อ.
          {addr.district} จ.{addr.province} {addr.postalCode}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2 flex-none">
        {!addr.isDefault && (
          <form action={setDefaultAddressAction.bind(null, addr.id)}>
            <button
              type="submit"
              className="text-[12.8px] font-semibold text-brand-red hover:underline whitespace-nowrap"
            >
              {dict.address.setDefault}
            </button>
          </form>
        )}
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-[12.8px] font-semibold text-text-faint hover:text-navy whitespace-nowrap"
        >
          {dict.common.edit}
        </button>
        <form action={deleteAddressAction.bind(null, addr.id)}>
          <button
            type="submit"
            className="text-[12.8px] font-semibold text-text-faint hover:text-brand-red whitespace-nowrap"
          >
            {dict.common.delete}
          </button>
        </form>
      </div>
    </div>
  );
}

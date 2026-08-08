'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import {
  createAddressAction,
  updateAddressAction,
  type AddressFormState,
} from '@/app/actions/addresses';
import type { Dictionary } from '@/lib/dictionaries';
import type { Address } from '@/lib/address-types';

type RequiredField =
  | 'recipientName'
  | 'phone'
  | 'addressLine1'
  | 'subdistrict'
  | 'district'
  | 'province'
  | 'postalCode';

const REQUIRED_FIELDS: RequiredField[] = [
  'recipientName',
  'phone',
  'addressLine1',
  'subdistrict',
  'district',
  'province',
  'postalCode',
];

const inputClass =
  'border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none';

export function AddressForm({
  dict,
  address,
  onCancel,
  onSuccess,
}: {
  dict: Dictionary;
  address?: Address;
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const boundAction = address
    ? updateAddressAction.bind(null, address.id)
    : createAddressAction;
  const [state, action, pending] = useActionState<AddressFormState, FormData>(
    boundAction,
    undefined,
  );

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !pending && !state) {
      onSuccess?.();
    }
    wasPending.current = pending;
  }, [pending, state, onSuccess]);

  const [values, setValues] = useState<Record<RequiredField, string>>({
    recipientName: address?.recipientName ?? '',
    phone: address?.phone ?? '',
    addressLine1: address?.addressLine1 ?? '',
    subdistrict: address?.subdistrict ?? '',
    district: address?.district ?? '',
    province: address?.province ?? '',
    postalCode: address?.postalCode ?? '',
  });
  const [touched, setTouched] = useState<Partial<Record<RequiredField, boolean>>>({});

  function fieldError(field: RequiredField): string | undefined {
    if (!touched[field]) return undefined;
    const value = values[field].trim();
    if (value.length === 0) return dict.validation.requiredField;
    if (field === 'postalCode' && !/^[0-9]{5}$/.test(value)) {
      return dict.validation.invalidPostalCode;
    }
    return undefined;
  }

  function handleChange(field: RequiredField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  const isValid = REQUIRED_FIELDS.every((field) => {
    const value = values[field].trim();
    if (value.length === 0) return false;
    if (field === 'postalCode' && !/^[0-9]{5}$/.test(value)) return false;
    return true;
  });

  return (
    <form action={action} className="flex flex-col gap-3 max-w-md" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 col-span-2">
          <label htmlFor="recipientName" className="text-[12.8px] font-bold text-text-muted">
            {dict.address.recipientName}
          </label>
          <input
            id="recipientName"
            name="recipientName"
            value={values.recipientName}
            onChange={(e) => handleChange('recipientName', e.target.value)}
            className={inputClass}
          />
          {fieldError('recipientName') && (
            <p className="text-sm text-red-600">{fieldError('recipientName')}</p>
          )}
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
            type="tel"
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={inputClass}
          />
          {fieldError('phone') && (
            <p className="text-sm text-red-600">{fieldError('phone')}</p>
          )}
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
            value={values.addressLine1}
            onChange={(e) => handleChange('addressLine1', e.target.value)}
            className={inputClass}
          />
          {fieldError('addressLine1') && (
            <p className="text-sm text-red-600">{fieldError('addressLine1')}</p>
          )}
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
            defaultValue={address?.addressLine2 ?? undefined}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="subdistrict" className="text-[12.8px] font-bold text-text-muted">
            {dict.address.subdistrict}
          </label>
          <input
            id="subdistrict"
            name="subdistrict"
            value={values.subdistrict}
            onChange={(e) => handleChange('subdistrict', e.target.value)}
            className={inputClass}
          />
          {fieldError('subdistrict') && (
            <p className="text-sm text-red-600">{fieldError('subdistrict')}</p>
          )}
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
            value={values.district}
            onChange={(e) => handleChange('district', e.target.value)}
            className={inputClass}
          />
          {fieldError('district') && (
            <p className="text-sm text-red-600">{fieldError('district')}</p>
          )}
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
            value={values.province}
            onChange={(e) => handleChange('province', e.target.value)}
            className={inputClass}
          />
          {fieldError('province') && (
            <p className="text-sm text-red-600">{fieldError('province')}</p>
          )}
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
            inputMode="numeric"
            maxLength={5}
            value={values.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className={inputClass}
          />
          {fieldError('postalCode') && (
            <p className="text-sm text-red-600">{fieldError('postalCode')}</p>
          )}
          {state?.errors?.postalCode && (
            <p className="text-sm text-red-600">{state.errors.postalCode[0]}</p>
          )}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-text-muted cursor-pointer">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={address?.isDefault}
          className="w-4 h-4 accent-brand-red"
        />
        <span>{dict.address.setDefault}</span>
      </label>

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || !isValid}
          className="w-fit bg-brand-red text-white text-sm font-bold px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {pending ? dict.common.saving : dict.address.save}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-semibold text-text-faint hover:text-navy"
          >
            {dict.common.cancel}
          </button>
        )}
      </div>
    </form>
  );
}

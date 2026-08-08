'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { updateProfileAction, type UpdateProfileState } from '@/app/actions/auth';
import type { Dictionary } from '@/lib/dictionaries';
import type { AuthUser } from '@/lib/types';

const inputClass =
  'border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none';

export function ProfileCard({ user, dict }: { user: AuthUser; dict: Dictionary }) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const initial = user.fullName.trim().charAt(0).toUpperCase() || '?';

  const [state, action, pending] = useActionState<UpdateProfileState, FormData>(
    updateProfileAction,
    undefined,
  );

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !pending && state?.success) {
      setIsEditing(false);
    }
    wasPending.current = pending;
  }, [pending, state]);

  const fullNameTooShort = fullName.trim().length > 0 && fullName.trim().length < 2;
  const fullNameEmpty = fullName.trim().length === 0;

  if (isEditing) {
    return (
      <section className="bg-white border border-border-subtle rounded-lg p-6">
        <form action={action} className="flex flex-col gap-3 max-w-md" noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="text-[12.8px] font-bold text-text-muted">
              {dict.account.fullNameLabel}
            </label>
            <input
              id="fullName"
              name="fullName"
              required
              minLength={2}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
            />
            {fullNameTooShort && (
              <p className="text-sm text-red-600">{dict.validation.fullNameTooShort}</p>
            )}
            {state?.errors?.fullName && (
              <p className="text-sm text-red-600">{state.errors.fullName[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-[12.8px] font-bold text-text-muted">
              {dict.account.phoneLabel}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={user.phone ?? undefined}
              className={inputClass}
            />
          </div>

          {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending || fullNameEmpty || fullNameTooShort}
              className="w-fit bg-brand-red text-white text-sm font-bold px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {pending ? dict.common.saving : dict.common.save}
            </button>
            <button
              type="button"
              onClick={() => {
                setFullName(user.fullName);
                setIsEditing(false);
              }}
              className="text-sm font-semibold text-text-faint hover:text-navy"
            >
              {dict.common.cancel}
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="bg-white border border-border-subtle rounded-lg p-6 flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-navy text-white grid place-items-center text-2xl font-extrabold flex-none">
        {initial}
      </div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-extrabold text-navy truncate">
            {user.fullName}
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-background text-text-muted border border-border-subtle whitespace-nowrap">
            {user.role === 'admin' ? dict.account.roleAdmin : dict.account.roleCustomer}
          </span>
        </div>
        <span className="text-sm text-text-muted truncate">{user.email}</span>
        {user.phone && (
          <span className="text-[12.8px] text-text-faint truncate">
            {dict.account.phoneLabelValue.replace('{phone}', user.phone)}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="text-[12.8px] font-semibold text-text-faint hover:text-navy whitespace-nowrap flex-none"
      >
        {dict.common.edit}
      </button>
    </section>
  );
}

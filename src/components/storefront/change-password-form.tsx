'use client';

import { useActionState, useState } from 'react';
import { changePasswordAction, type ChangePasswordState } from '@/app/actions/auth';
import type { Dictionary } from '@/lib/dictionaries';

const inputClass =
  'border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none';

export function ChangePasswordForm({ dict }: { dict: Dictionary }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, action, pending] = useActionState<ChangePasswordState, FormData>(
    changePasswordAction,
    undefined,
  );

  const mismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const tooShort = newPassword.length > 0 && newPassword.length < 8;

  if (!isOpen) {
    return (
      <section className="bg-white border border-border-subtle rounded-lg p-6 flex items-center justify-between gap-4">
        <span className="font-bold text-navy">{dict.account.changePassword}</span>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-sm font-semibold text-brand-red hover:underline whitespace-nowrap"
        >
          {dict.common.edit}
        </button>
      </section>
    );
  }

  return (
    <section className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col gap-4">
      <h2 className="font-bold text-navy">{dict.account.changePassword}</h2>
      <form action={action} className="flex flex-col gap-3 max-w-md" noValidate>
        <div className="flex flex-col gap-1">
          <label htmlFor="currentPassword" className="text-[12.8px] font-bold text-text-muted">
            {dict.account.currentPasswordLabel}
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            className={inputClass}
          />
          {state?.errors?.currentPassword && (
            <p className="text-sm text-red-600">{state.errors.currentPassword[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="newPassword" className="text-[12.8px] font-bold text-text-muted">
            {dict.account.newPasswordLabel}
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
          />
          {tooShort && (
            <p className="text-sm text-red-600">{dict.validation.passwordTooShort}</p>
          )}
          {state?.errors?.newPassword && (
            <p className="text-sm text-red-600">{state.errors.newPassword[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-[12.8px] font-bold text-text-muted">
            {dict.account.confirmPasswordLabel}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
          />
          {mismatch && (
            <p className="text-sm text-red-600">{dict.validation.passwordMismatch}</p>
          )}
          {state?.errors?.confirmPassword && (
            <p className="text-sm text-red-600">{state.errors.confirmPassword[0]}</p>
          )}
        </div>

        {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending || mismatch || tooShort}
            className="w-fit bg-brand-red text-white text-sm font-bold px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {pending ? dict.common.saving : dict.account.changePassword}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-sm font-semibold text-text-faint hover:text-navy"
          >
            {dict.common.cancel}
          </button>
        </div>
      </form>
    </section>
  );
}

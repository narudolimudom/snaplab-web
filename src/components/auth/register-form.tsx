'use client';

import { useActionState } from 'react';
import { registerAction, type RegisterState } from '@/app/actions/auth';
import type { Dictionary } from '@/lib/dictionaries';

export function RegisterForm({ dict }: { dict: Dictionary }) {
  const [state, action, pending] = useActionState<RegisterState, FormData>(
    registerAction,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-4 w-full">
      <h1 className="text-lg font-bold">{dict.auth.register}</h1>

      <div className="flex flex-col gap-1">
        <label htmlFor="fullName" className="text-[12.8px] font-bold text-text-muted">
          {dict.auth.fullNameLabel}
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          placeholder={dict.auth.fullNamePlaceholder}
          className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
        />
        {state?.errors?.fullName && (
          <p className="text-sm text-red-600">{state.errors.fullName[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-[12.8px] font-bold text-text-muted">
          {dict.auth.emailLabel}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
        />
        {state?.errors?.email && (
          <p className="text-sm text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-[12.8px] font-bold text-text-muted">
          {dict.auth.phoneLabel}
        </label>
        <input
          id="phone"
          name="phone"
          placeholder="08X-XXX-XXXX"
          className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-[12.8px] font-bold text-text-muted">
          {dict.auth.passwordLabel}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder={dict.auth.passwordPlaceholder}
          className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
        />
        {state?.errors?.password && (
          <p className="text-sm text-red-600">{state.errors.password[0]}</p>
        )}
      </div>

      <label className="flex items-start gap-2 text-sm font-semibold text-text-muted cursor-pointer leading-relaxed">
        <input
          type="checkbox"
          required
          className="w-4 h-4 mt-0.5 accent-brand-red cursor-pointer"
        />
        <span>{dict.auth.pdpaConsent}</span>
      </label>

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-brand-red text-white text-lg font-bold py-4 rounded-lg hover:bg-brand-red-dark transition-colors disabled:opacity-50"
      >
        {pending ? dict.auth.registering : dict.auth.register}
      </button>
    </form>
  );
}

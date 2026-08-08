'use client';

import { useActionState, useState } from 'react';
import { registerAction, type RegisterState } from '@/app/actions/auth';
import type { Dictionary } from '@/lib/dictionaries';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm({ dict }: { dict: Dictionary }) {
  const [state, action, pending] = useActionState<RegisterState, FormData>(
    registerAction,
    undefined,
  );

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pdpaChecked, setPdpaChecked] = useState(false);
  const [touched, setTouched] = useState<{
    fullName?: boolean;
    email?: boolean;
    password?: boolean;
    pdpa?: boolean;
  }>({});

  const fullNameError = touched.fullName
    ? fullName.trim().length === 0
      ? dict.validation.requiredFullName
      : fullName.trim().length < 2
        ? dict.validation.fullNameTooShort
        : undefined
    : undefined;

  const emailError = touched.email
    ? email.trim().length === 0
      ? dict.validation.requiredEmail
      : !EMAIL_RE.test(email.trim())
        ? dict.validation.invalidEmail
        : undefined
    : undefined;

  const passwordError = touched.password
    ? password.length === 0
      ? dict.validation.requiredPassword
      : password.length < 8
        ? dict.validation.passwordTooShort
        : undefined
    : undefined;

  const pdpaError = touched.pdpa && !pdpaChecked ? dict.validation.requiredPdpaConsent : undefined;

  const isValid =
    fullName.trim().length >= 2 &&
    EMAIL_RE.test(email.trim()) &&
    password.length >= 8 &&
    pdpaChecked;

  return (
    <form action={action} className="flex flex-col gap-4 w-full" noValidate>
      <h1 className="text-lg font-bold">{dict.auth.register}</h1>

      <div className="flex flex-col gap-1">
        <label htmlFor="fullName" className="text-[12.8px] font-bold text-text-muted">
          {dict.auth.fullNameLabel}
        </label>
        <input
          id="fullName"
          name="fullName"
          placeholder={dict.auth.fullNamePlaceholder}
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            setTouched((prev) => ({ ...prev, fullName: true }));
          }}
          className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
        />
        {fullNameError && <p className="text-sm text-red-600">{fullNameError}</p>}
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
          placeholder="you@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setTouched((prev) => ({ ...prev, email: true }));
          }}
          className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
        />
        {emailError && <p className="text-sm text-red-600">{emailError}</p>}
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
          type="tel"
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
          placeholder={dict.auth.passwordPlaceholder}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setTouched((prev) => ({ ...prev, password: true }));
          }}
          className="border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
        />
        {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
        {state?.errors?.password && (
          <p className="text-sm text-red-600">{state.errors.password[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2 text-sm font-semibold text-text-muted cursor-pointer leading-relaxed">
          <input
            type="checkbox"
            checked={pdpaChecked}
            onChange={(e) => {
              setPdpaChecked(e.target.checked);
              setTouched((prev) => ({ ...prev, pdpa: true }));
            }}
            className="w-4 h-4 mt-0.5 accent-brand-red cursor-pointer"
          />
          <span>{dict.auth.pdpaConsent}</span>
        </label>
        {pdpaError && <p className="text-sm text-red-600">{pdpaError}</p>}
      </div>

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending || !isValid}
        className="w-full bg-brand-red text-white text-lg font-bold py-4 rounded-lg hover:bg-brand-red-dark transition-colors disabled:opacity-50"
      >
        {pending ? dict.auth.registering : dict.auth.register}
      </button>
    </form>
  );
}

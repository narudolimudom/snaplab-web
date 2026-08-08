'use client';

import { useActionState, useState } from 'react';
import { loginAction, type LoginState } from '@/app/actions/auth';
import type { Dictionary } from '@/lib/dictionaries';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm({
  redirectTo,
  title,
  dict,
}: {
  redirectTo: string;
  title: string;
  dict: Dictionary;
}) {
  const boundAction = loginAction.bind(null, redirectTo);
  const [state, action, pending] = useActionState<LoginState, FormData>(
    boundAction,
    undefined,
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

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
      : undefined
    : undefined;

  const isValid = EMAIL_RE.test(email.trim()) && password.length > 0;

  return (
    <form action={action} className="flex flex-col gap-4 w-full" noValidate>
      <h1 className="text-lg font-bold">{title}</h1>

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
        <label htmlFor="password" className="text-[12.8px] font-bold text-text-muted">
          {dict.auth.passwordLabel}
        </label>
        <input
          id="password"
          name="password"
          type="password"
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

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending || !isValid}
        className="w-full bg-brand-red text-white text-lg font-bold py-4 rounded-lg hover:bg-brand-red-dark transition-colors disabled:opacity-50"
      >
        {pending ? dict.auth.loggingIn : dict.auth.login}
      </button>
    </form>
  );
}

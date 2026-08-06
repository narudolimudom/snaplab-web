import { notFound } from 'next/navigation';
import { LoginForm } from '@/components/auth/login-form';
import { AuthLayout } from '@/components/auth/auth-layout';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n-config';

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <AuthLayout active="login" lang={lang} dict={dict}>
      <LoginForm redirectTo={`/${lang}/account`} title={dict.auth.login} dict={dict} />
    </AuthLayout>
  );
}

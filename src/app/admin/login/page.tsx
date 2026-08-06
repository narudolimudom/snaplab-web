import { LoginForm } from '@/components/auth/login-form';
import thDict from '@/dictionaries/th.json';

export default function AdminLoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
      <div className="w-full max-w-sm">
        <LoginForm redirectTo="/admin/dashboard" title="เข้าสู่ระบบแอดมิน" dict={thDict} />
      </div>
    </main>
  );
}

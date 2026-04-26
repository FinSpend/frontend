'use client'
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/app/Components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  return (
    <LoginForm
      onSuccess={() => router.push('/dashboard')}
    />
  );
}
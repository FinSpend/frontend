'use client'
import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/app/Components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <RegisterForm
      onSuccess={() => router.push('/onboarding')}
    />
  );
}
'use client'
import { useRouter } from 'next/navigation';
import { Onboarding } from '@/app/Components/onboarding/Onboarding';
import { useToast } from '@/app/Components/ui/ToastProvider';

export default function OnboardingPage() {
  const router = useRouter();
  const { showToast } = useToast();

  return (
    <Onboarding
      onFinish={() => {
        router.push('/dashboard');
        showToast('Onboarding selesai! Selamat datang di FinSpend.');
      }}
    />
  );
}

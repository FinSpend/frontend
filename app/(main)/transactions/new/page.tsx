'use client'
import { useRouter } from 'next/navigation';
import { AddTransaction } from '@/app/Components/transactions/AddTransaction';
import { useToast } from '@/app/Components/ui/ToastProvider';

export default function NewTransactionPage() {
  const router = useRouter();
  const { showToast } = useToast();

  return (
    <AddTransaction
      onBack={() => router.push('/transactions')}
      onSuccess={(msg) => {
        router.push('/transactions');
        showToast(msg);
      }}
    />
  );
}

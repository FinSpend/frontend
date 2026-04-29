'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card } from '@/app/Components/ui/Card';
import { useToast } from '@/app/Components/ui/ToastProvider';
import { useData } from '@/app/lib/data-context';

const schema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(1, 'Jumlah harus lebih dari 0'),
  name: z.string().min(1, 'Nama transaksi wajib diisi').max(100, 'Maksimal 100 karakter'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  date: z.string().min(1, 'Tanggal wajib diisi'),
});

type FormValues = z.infer<typeof schema>;

interface AddTransactionProps {
  onBack: () => void;
  onSuccess?: (message: string) => void;
}

export function AddTransaction({ onBack, onSuccess }: AddTransactionProps) {
  const { addTransaction, categories } = useData();
  const { showToast } = useToast();
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      type: 'expense',
      amount: undefined,
      name: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const filteredCategories = categories.filter(c => c.type === type);

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setValue('type', newType);
    setValue('category', '');
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const amount = values.type === 'expense' ? -values.amount : values.amount;
      await addTransaction({
        name: values.name,
        amount,
        category: values.category,
        date: values.date,
      });
      showToast('Transaksi berhasil ditambahkan!');
      onSuccess?.('Transaksi berhasil ditambahkan!');
      onBack();
    } catch {
      showToast('Gagal menyimpan transaksi, coba lagi.', 'error');
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors text-sm dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${
      hasError
        ? 'border-red-400 focus:ring-red-200 dark:border-red-500'
        : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
    }`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
          aria-label="Kembali ke daftar transaksi"
        >
          <ArrowLeft className="w-5 h-5 dark:text-white" />
        </button>
        <h2 className="text-2xl font-semibold dark:text-white">Tambah Transaksi</h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipe Transaksi</label>
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  type === 'expense'
                    ? 'bg-white dark:bg-gray-600 text-red-600 dark:text-red-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  type === 'income'
                    ? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Pemasukan
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jumlah</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium">Rp</span>
              <input
                id="amount"
                type="number"
                {...register('amount', { valueAsNumber: true })}
                className={`${inputClass(!!errors.amount)} pl-12`}
                placeholder="0"
              />
            </div>
            {errors.amount && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.amount.message}</p>}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Transaksi</label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={inputClass(!!errors.name)}
              placeholder="Contoh: Belanja bulanan"
            />
            {errors.name && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
            <select
              id="category"
              {...register('category')}
              className={inputClass(!!errors.category)}
            >
              <option value="">Pilih kategori</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.category.message}</p>}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tanggal</label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className={inputClass(!!errors.date)}
            />
            {errors.date && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.date.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm ${
              type === 'expense'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </form>
      </Card>
    </div>
  );
}

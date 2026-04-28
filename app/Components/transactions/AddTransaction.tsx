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
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors dark:bg-gray-700 dark:text-white ${
      hasError
        ? 'border-red-400 focus:ring-red-200 dark:border-red-500'
        : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
    }`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
          aria-label="Kembali ke daftar transaksi"
        >
          <ArrowLeft className="w-5 h-5 dark:text-white" />
        </button>
        <h2 className="text-2xl dark:text-white">Tambah Transaksi</h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Type Toggle */}
          <div>
            <label className="block text-sm mb-2 dark:text-gray-300">Tipe Transaksi</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-3 rounded-lg transition-colors ${type === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-3 rounded-lg transition-colors ${type === 'income' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
              >
                Pemasukan
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm mb-2 dark:text-gray-300">Jumlah</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">Rp</span>
              <input
                id="amount"
                type="number"
                {...register('amount', { valueAsNumber: true })}

                className={`${inputClass(!!errors.amount)} pl-12`}
                placeholder="0"
              />
            </div>
            {errors.amount && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.amount.message}</p>}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm mb-2 dark:text-gray-300">Nama Transaksi</label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={inputClass(!!errors.name)}
              placeholder="Contoh: Belanja bulanan"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm mb-2 dark:text-gray-300">Kategori</label>
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
            {errors.category && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.category.message}</p>}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm mb-2 dark:text-gray-300">Tanggal</label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className={inputClass(!!errors.date)}
            />
            {errors.date && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.date.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2 ${
              type === 'expense' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
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

'use client'
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/app/Components/ui/Card';
import { useData } from '@/app/lib/data-context';
import type { TransactionCategory } from '@/app/types';

interface AddTransactionProps {
  onBack: () => void;
  onSuccess?: (message: string) => void;
}

export function AddTransaction({ onBack, onSuccess }: AddTransactionProps) {
  const { addTransaction } = useData();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const expenseCategories: TransactionCategory[] = ['Makanan', 'Transport', 'Belanja', 'Hiburan', 'Tagihan', 'Kesehatan', 'Lainnya'];
  const incomeCategories: TransactionCategory[] = ['Pemasukan'];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const rawAmount = Number(formData.amount);
    const amount = type === 'expense' ? -rawAmount : rawAmount;
    addTransaction({
      name: formData.name,
      amount,
      category: formData.category as TransactionCategory,
      date: formData.date,
    });
    onSuccess?.('Transaksi berhasil ditambahkan!');
    onBack();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Kembali ke daftar transaksi"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl">Tambah Transaksi</h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Toggle */}
          <div>
            <label className="block text-sm mb-2">Tipe Transaksi</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-3 rounded-lg transition-colors ${
                  type === 'expense'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-3 rounded-lg transition-colors ${
                  type === 'income'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pemasukan
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm mb-2">
              Jumlah
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm mb-2">
              Nama Transaksi
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Belanja bulanan"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm mb-2">
              Kategori
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih kategori</option>
              {(type === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm mb-2">
              Tanggal
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm mb-2">
              Catatan (Opsional)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Tambahkan catatan..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white transition-colors ${
              type === 'expense'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Simpan Transaksi
          </button>
        </form>
      </Card>
    </div>
  );
}

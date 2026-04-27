'use client'
import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card } from '@/app/Components/ui/Card';
import { useData } from '@/app/lib/data-context';

interface AddTransactionProps {
  onBack: () => void;
  onSuccess?: (message: string) => void;
}

export function AddTransaction({ onBack, onSuccess }: AddTransactionProps) {
  const { addTransaction, categories } = useData();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const rawAmount = Number(formData.amount);
      const amount = type === 'expense' ? -rawAmount : rawAmount;
      await addTransaction({
        name: formData.name,
        amount,
        category: formData.category,
        date: formData.date,
      });
      onSuccess?.('Transaksi berhasil ditambahkan!');
      onBack();
    } catch {
      setError('Gagal menyimpan transaksi, coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Type Toggle */}
          <div>
            <label className="block text-sm mb-2">Tipe Transaksi</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setType('expense'); setFormData(f => ({ ...f, category: '' })); }}
                className={`flex-1 py-3 rounded-lg transition-colors ${type === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Pengeluaran
              </button>
              <button type="button" onClick={() => { setType('income'); setFormData(f => ({ ...f, category: '' })); }}
                className={`flex-1 py-3 rounded-lg transition-colors ${type === 'income' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Pemasukan
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm mb-2">Jumlah</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
              <input type="number" id="amount" value={formData.amount}
                onChange={(e) => setFormData(f => ({ ...f, amount: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0" required />
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm mb-2">Nama Transaksi</label>
            <input type="text" id="name" value={formData.name}
              onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Belanja bulanan" required />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm mb-2">Kategori</label>
            <select id="category" value={formData.category}
              onChange={(e) => setFormData(f => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required>
              <option value="">Pilih kategori</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm mb-2">Tanggal</label>
            <input type="date" id="date" value={formData.date}
              onChange={(e) => setFormData(f => ({ ...f, date: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>

          <button type="submit" disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2 ${type === 'expense' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </form>
      </Card>
    </div>
  );
}

'use client'
import { useState } from 'react';
import { Plus, Filter, Trash2, Pencil, X, Check } from 'lucide-react';
import { formatIDRSigned } from '@/app/lib/format';
import { Card } from '@/app/Components/ui/Card';
import { useData } from '@/app/lib/data-context';
import { updateTransaction } from '@/app/services/userService';
import type { Transaction } from '@/app/types';

export function Transactions() {
  const { transactions, isLoading, deleteTransaction, refetch } = useData();
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', amount: '' });
  const [error, setError] = useState('');

  const filterCategories = ['Semua', ...Array.from(new Set(transactions.map(t => t.category))).filter(Boolean)];

  const filtered = selectedCategory === 'Semua'
    ? transactions
    : transactions.filter(t => t.category === selectedCategory);

  const groupedByDate = filtered.reduce((acc, t) => {
    const date = new Date(t.date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus transaksi ini?')) return;
    try {
      await deleteTransaction(id);
    } catch {
      setError('Gagal menghapus transaksi');
    }
  };

  const startEdit = (t: Transaction) => {
    setEditingId(t.id);
    setEditForm({ name: t.name, amount: String(Math.abs(t.amount)) });
  };

  const handleEditSubmit = async (t: Transaction) => {
    try {
      await updateTransaction(t.id, {
        description: editForm.name,
        amount: Number(editForm.amount),
      });
      setEditingId(null);
      refetch();
    } catch {
      setError('Gagal memperbarui transaksi');
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Transaksi</h2>
        <a
          href="/transactions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Transaksi
        </a>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center justify-between">
          {error}
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Category Filter */}
      <Card className="p-4!">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-sm">Filter Kategori</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Transactions List */}
      {filtered.length === 0 ? (
        <Card>
          <p className="text-center text-gray-400 py-10">
            {transactions.length === 0 ? 'Belum ada transaksi. Tambahkan transaksi pertama Anda.' : 'Tidak ada transaksi untuk kategori ini.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, dateTransactions]) => (
            <div key={date}>
              <h3 className="text-sm text-gray-500 mb-3">{date}</h3>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
                {dateTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                    {editingId === transaction.id ? (
                      <div className="flex items-center gap-3">
                        <input
                          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={editForm.name}
                          onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Deskripsi"
                        />
                        <input
                          className="w-32 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          type="number"
                          value={editForm.amount}
                          onChange={e => setEditForm(f => ({ ...f, amount: e.target.value }))}
                          placeholder="Jumlah"
                        />
                        <button
                          onClick={() => handleEditSubmit(transaction)}
                          className="text-green-600 hover:text-green-700"
                          title="Simpan"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Batal"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">{transaction.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{transaction.category}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className={`text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatIDRSigned(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-400">{transaction.date}</p>
                          <button
                            onClick={() => startEdit(transaction)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

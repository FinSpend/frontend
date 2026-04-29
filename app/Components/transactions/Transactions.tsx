'use client'
import { useState, useMemo } from 'react';
import { Plus, Filter, Search, Trash2, Pencil, X, Check, ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { formatIDRSigned } from '@/app/lib/format';
import { Card } from '@/app/Components/ui/Card';
import { Skeleton } from '@/app/Components/ui/Skeleton';
import { useData } from '@/app/lib/data-context';
import { useToast } from '@/app/Components/ui/ToastProvider';
import { updateTransaction } from '@/app/services/userService';
import type { Transaction } from '@/app/types';

const PAGE_SIZE = 15;

export function Transactions() {
  const { transactions, isLoading, deleteTransaction, refetch } = useData();
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', amount: '' });

  const filterCategories = ['Semua', ...Array.from(new Set(transactions.map(t => t.category))).filter(Boolean)];

  const filtered = useMemo(() => {
    return transactions
      .filter(t => selectedCategory === 'Semua' || t.category === selectedCategory)
      .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()))
      .filter(t => !startDate || t.date >= startDate)
      .filter(t => !endDate || t.date <= endDate);
  }, [transactions, selectedCategory, search, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const groupedByDate = paged.reduce((acc, t) => {
    const date = new Date(t.date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const resetPage = () => setPage(1);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus transaksi ini?')) return;
    try {
      await deleteTransaction(id);
      showToast('Transaksi berhasil dihapus');
    } catch {
      showToast('Gagal menghapus transaksi', 'error');
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
      showToast('Transaksi berhasil diperbarui');
    } catch {
      showToast('Gagal memperbarui transaksi', 'error');
    }
  };

  if (isLoading) return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-20 rounded-2xl" />
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 rounded-2xl" />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold dark:text-white">Transaksi</h2>
        <a
          href="/transactions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Transaksi
        </a>
      </div>

      {/* Search + Date Filter */}
      <Card className="p-4!">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); resetPage(); }}
              placeholder="Cari transaksi..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={e => { setStartDate(e.target.value); resetPage(); }}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <span className="text-gray-400 text-sm">–</span>
            <input
              type="date"
              value={endDate}
              onChange={e => { setEndDate(e.target.value); resetPage(); }}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            {(search || startDate || endDate) && (
              <button
                onClick={() => { setSearch(''); setStartDate(''); setEndDate(''); resetPage(); }}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Reset filter
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <Card className="p-4!">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium dark:text-gray-300">Filter Kategori</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); resetPage(); }}
              aria-pressed={selectedCategory === cat}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Menampilkan {paged.length} dari {filtered.length} transaksi
      </p>

      {/* Transactions List */}
      {paged.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Receipt className="w-12 h-12 text-gray-200 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
              {transactions.length === 0 ? 'Belum ada transaksi' : 'Tidak ada transaksi yang cocok'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
              {transactions.length === 0
                ? 'Mulai catat pemasukan dan pengeluaran Anda'
                : 'Coba ubah atau reset filter pencarian'}
            </p>
            {transactions.length === 0 && (
              <a
                href="/transactions/new"
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Tambah Transaksi Pertama
              </a>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, dateTransactions]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{date}</h3>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                {dateTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                    {editingId === transaction.id ? (
                      <div className="flex items-center gap-3">
                        <input
                          className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={editForm.name}
                          onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Deskripsi"
                        />
                        <input
                          className="w-32 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          type="number"
                          value={editForm.amount}
                          onChange={e => setEditForm(f => ({ ...f, amount: e.target.value }))}
                          placeholder="Jumlah"
                        />
                        <button onClick={() => handleEditSubmit(transaction)} className="text-green-600 hover:text-green-700" title="Simpan">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600" title="Batal">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium dark:text-white">{transaction.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{transaction.category}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className={`text-sm font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatIDRSigned(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-400">{transaction.date}</p>
                          <button onClick={() => startEdit(transaction)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(transaction.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Hapus">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4 dark:text-gray-300" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                page === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-4 h-4 dark:text-gray-300" />
          </button>
        </div>
      )}
    </div>
  );
}

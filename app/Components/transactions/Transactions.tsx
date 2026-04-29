'use client'
import { useState, useMemo } from 'react';
import { Plus, Filter, Search, Trash2, Pencil, X, Check, ChevronLeft, ChevronRight, Receipt, Download, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { formatIDR, formatIDRSigned } from '@/app/lib/format';
import { Card } from '@/app/Components/ui/Card';
import { Skeleton } from '@/app/Components/ui/Skeleton';
import { ConfirmModal } from '@/app/Components/ui/ConfirmModal';
import { useData } from '@/app/lib/data-context';
import { useToast } from '@/app/Components/ui/ToastProvider';
import { updateTransaction } from '@/app/services/userService';
import type { Transaction } from '@/app/types';

const PAGE_SIZE = 15;

type TypeFilter = 'all' | 'income' | 'expense';
type SortBy    = 'newest' | 'oldest' | 'highest' | 'lowest';

const SORT_LABELS: Record<SortBy, string> = {
  newest:  'Terbaru',
  oldest:  'Terlama',
  highest: 'Terbesar',
  lowest:  'Terkecil',
};

export function Transactions() {
  const { transactions, categories, wallets, isLoading, deleteTransaction, refetch } = useData();
  const { showToast } = useToast();

  const [typeFilter, setTypeFilter]       = useState<TypeFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [search, setSearch]               = useState('');
  const [startDate, setStartDate]         = useState('');
  const [endDate, setEndDate]             = useState('');
  const [sortBy, setSortBy]               = useState<SortBy>('newest');
  const [page, setPage]                   = useState(1);
  const [deleteTarget, setDeleteTarget]   = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingId, setEditingId]         = useState<string | null>(null);
  const [editForm, setEditForm]           = useState({ name: '', amount: '' });

  const filterCategories = ['Semua', ...Array.from(new Set(transactions.map(t => t.category))).filter(Boolean)];

  const filtered = useMemo(() => {
    let result = transactions
      .filter(t => typeFilter === 'all' || (typeFilter === 'income' ? t.amount > 0 : t.amount < 0))
      .filter(t => selectedCategory === 'Semua' || t.category === selectedCategory)
      .filter(t => !selectedWallet || t.walletId === selectedWallet)
      .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()))
      .filter(t => !startDate || t.date >= startDate)
      .filter(t => !endDate || t.date <= endDate);

    switch (sortBy) {
      case 'oldest':  result = [...result].sort((a, b) => a.date.localeCompare(b.date)); break;
      case 'newest':  result = [...result].sort((a, b) => b.date.localeCompare(a.date)); break;
      case 'highest': result = [...result].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount)); break;
      case 'lowest':  result = [...result].sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount)); break;
    }
    return result;
  }, [transactions, typeFilter, selectedCategory, selectedWallet, search, startDate, endDate, sortBy]);

  const filteredIncome  = filtered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const filteredExpense = filtered.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteTransaction(deleteTarget);
      showToast('Transaksi berhasil dihapus');
      setDeleteTarget(null);
    } catch {
      showToast('Gagal menghapus transaksi', 'error');
    } finally {
      setDeleteLoading(false);
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

  const exportCSV = () => {
    const header = ['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Jumlah (IDR)'];
    const rows = filtered.map(t => [
      t.date,
      `"${t.name.replace(/"/g, '""')}"`,
      t.category,
      t.amount > 0 ? 'Pemasukan' : 'Pengeluaran',
      Math.abs(t.amount).toString(),
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `transaksi_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filtered.length} transaksi berhasil diexport`);
  };

  const getCategoryMeta = (catName: string) => categories.find(c => c.name === catName);

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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-semibold dark:text-white">Transaksi</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            title="Export ke CSV"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <a
            href="/transactions/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Transaksi
          </a>
        </div>
      </div>

      {/* Type Filter tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        {([['all', 'Semua'], ['income', 'Pemasukan'], ['expense', 'Pengeluaran']] as [TypeFilter, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setTypeFilter(key); resetPage(); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              typeFilter === key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search + Date + Sort */}
      <Card className="p-4!">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); resetPage(); }}
                placeholder="Cari transaksi..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={e => { setSortBy(e.target.value as SortBy); resetPage(); }}
                className="pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white appearance-none"
              >
                {(Object.keys(SORT_LABELS) as SortBy[]).map(k => (
                  <option key={k} value={k}>{SORT_LABELS[k]}</option>
                ))}
              </select>
            </div>
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
            {wallets.length > 0 && (
              <select
                value={selectedWallet}
                onChange={e => { setSelectedWallet(e.target.value); resetPage(); }}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="">Semua Wallet</option>
                {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            )}
            {(search || startDate || endDate || typeFilter !== 'all' || selectedCategory !== 'Semua' || selectedWallet) && (
              <button
                onClick={() => { setSearch(''); setStartDate(''); setEndDate(''); setTypeFilter('all'); setSelectedCategory('Semua'); setSelectedWallet(''); resetPage(); }}
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

      {/* Summary Bar */}
      {filtered.length > 0 && (
        <div className="flex flex-wrap gap-4 px-5 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Pemasukan</p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">+{formatIDR(filteredIncome)}</p>
          </div>
          <div className="w-px bg-gray-200 dark:bg-gray-700" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Pengeluaran</p>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">-{formatIDR(filteredExpense)}</p>
          </div>
          <div className="w-px bg-gray-200 dark:bg-gray-700" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Selisih</p>
            <p className={`text-sm font-semibold ${(filteredIncome - filteredExpense) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatIDR(filteredIncome - filteredExpense)}
            </p>
          </div>
          <div className="ml-auto self-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">{filtered.length} transaksi</p>
          </div>
        </div>
      )}

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
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{date}</h3>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatIDR(dateTransactions.reduce((s, t) => s + t.amount, 0))}
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                {dateTransactions.map((transaction) => {
                  const catMeta = getCategoryMeta(transaction.category);
                  return (
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
                        <div className="flex items-center gap-3 justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Category icon */}
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
                              style={{
                                backgroundColor: catMeta?.color
                                  ? `${catMeta.color}20`
                                  : transaction.amount > 0 ? '#d1fae520' : '#fee2e220',
                              }}
                            >
                              {catMeta?.icon ?? (transaction.amount > 0
                                ? <TrendingUp className="w-4 h-4 text-green-500" />
                                : <TrendingDown className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium dark:text-white truncate">{transaction.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {catMeta?.color && (
                                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: catMeta.color }} />
                                )}
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{transaction.category}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <p className={`text-sm font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatIDRSigned(transaction.amount)}
                              </p>
                              <p className="text-xs text-gray-400">{transaction.date}</p>
                            </div>
                            <button onClick={() => startEdit(transaction)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteTarget(transaction.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Hapus">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
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
          {[...Array(Math.min(totalPages, 7))].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                  page === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-4 h-4 dark:text-gray-300" />
          </button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <ConfirmModal
          title="Hapus Transaksi?"
          description="Transaksi ini akan dihapus permanen dan tidak bisa dikembalikan."
          confirmLabel="Hapus"
          isLoading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

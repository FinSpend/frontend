'use client'
import { useState, useEffect } from 'react';
import { AlertCircle, Sparkles, Plus, X, Trash2, RefreshCw, Target, Pencil } from 'lucide-react';
import { formatIDR } from '@/app/lib/format';
import { useData } from '@/app/lib/data-context';
import { useToast } from '@/app/Components/ui/ToastProvider';
import { Skeleton } from '@/app/Components/ui/Skeleton';
import { getAISuggestions, generateAISuggestion, updateBudget } from '@/app/services/userService';

interface AiSuggestionBrief {
  id: string;
  content: string;
}

export function Budgeting() {
  const { budgets, categories, isLoading, createBudget, deleteBudget, refetch } = useData();
  const { showToast } = useToast();
  const overBudget = budgets.filter(b => b.spent > b.limit);

  // Add modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    limitAmount: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit modal
  const [editingBudget, setEditingBudget] = useState<{ id: string; category: string; limit: number; period: string } | null>(null);
  const [editForm, setEditForm] = useState({ limitAmount: '', period: 'monthly' });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestionBrief | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    getAISuggestions()
      .then(res => {
        const list = res.data.data as AiSuggestionBrief[];
        if (list?.length > 0) setAiSuggestion(list[0]);
      })
      .catch(() => {});
  }, []);

  const handleGenerateSuggestion = async () => {
    setIsGenerating(true);
    try {
      const res = await generateAISuggestion();
      setAiSuggestion(res.data.data as AiSuggestionBrief);
      showToast('Saran AI berhasil dibuat');
    } catch {
      showToast('Gagal membuat saran AI', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.limitAmount) {
      setFormError('Semua field wajib diisi');
      return;
    }
    setIsSubmitting(true);
    setFormError('');
    try {
      await createBudget({
        categoryId: formData.categoryId,
        limitAmount: Number(formData.limitAmount),
        period: formData.period,
        startDate: formData.startDate,
      });
      setShowModal(false);
      setFormData({ categoryId: '', limitAmount: '', period: 'monthly', startDate: new Date().toISOString().split('T')[0] });
      showToast('Budget berhasil disimpan');
    } catch {
      setFormError('Gagal menyimpan budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (budget: { id: string; category: string; limit: number; period: string }) => {
    setEditingBudget(budget);
    setEditForm({ limitAmount: String(budget.limit), period: budget.period || 'monthly' });
  };

  const handleEditSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!editForm.limitAmount || Number(editForm.limitAmount) <= 0) {
      showToast('Batas anggaran harus lebih dari 0', 'error');
      return;
    }
    if (!editingBudget) return;
    setIsEditSubmitting(true);
    try {
      await updateBudget(editingBudget.id, {
        limitAmount: Number(editForm.limitAmount),
        period: editForm.period,
      });
      refetch();
      setEditingBudget(null);
      showToast('Budget berhasil diperbarui');
    } catch {
      showToast('Gagal memperbarui budget', 'error');
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus budget ini?')) return;
    try {
      await deleteBudget(id);
      showToast('Budget berhasil dihapus');
    } catch {
      showToast('Gagal menghapus budget', 'error');
    }
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');

  if (isLoading) return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
      <Skeleton className="h-36 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold dark:text-white">Budgeting</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Budget
        </button>
      </div>

      {/* AI Suggestion */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Saran AI untuk Budget Anda</h3>
            {aiSuggestion ? (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{aiSuggestion.content}</p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Belum ada saran AI. Klik tombol untuk mendapatkan saran berdasarkan data keuangan Anda.
              </p>
            )}
            <button
              onClick={handleGenerateSuggestion}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Membuat saran...' : 'Buat Saran Baru'}
            </button>
          </div>
        </div>
      </div>

      {/* Over Budget Alert */}
      {overBudget.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              {overBudget.length} kategori melebihi budget yang ditentukan
            </span>
          </div>
        </div>
      )}

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 p-12 text-center">
          <Target className="w-12 h-12 text-gray-200 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Belum ada budget</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">Buat budget untuk melacak dan mengendalikan pengeluaran Anda</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Buat Budget Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget) => {
            const pct = Math.round((budget.spent / budget.limit) * 100);
            return (
              <div
                key={budget.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border ${
                  pct > 100 ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{budget.icon}</span>
                    <div>
                      <h3 className="font-semibold dark:text-white">{budget.category}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {formatIDR(budget.spent)} / {formatIDR(budget.limit)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`text-right ${pct > 100 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      <p className="text-2xl font-semibold">{pct}%</p>
                      {pct > 100 && (
                        <p className="text-xs text-red-500">+{formatIDR(budget.spent - budget.limit)}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 ml-1">
                      <button
                        onClick={() => openEdit({ id: budget.id, category: budget.category, limit: budget.limit, period: 'monthly' })}
                        className="text-gray-300 dark:text-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Edit budget"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="text-gray-300 dark:text-gray-600 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Hapus budget"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      pct > 100 ? 'bg-red-500' : pct > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Sisa: <span className="font-medium">{formatIDR(Math.max(0, budget.limit - budget.spent))}</span>
                  </span>
                  {pct > 100 ? (
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">Melebihi budget!</span>
                  ) : pct > 80 ? (
                    <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Hampir habis</span>
                  ) : (
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">Aman</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Budget Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold dark:text-white">Tambah Budget Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kategori</label>
                <select
                  value={formData.categoryId}
                  onChange={e => setFormData(f => ({ ...f, categoryId: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Pilih kategori...</option>
                  {expenseCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Batas Anggaran (Rp)</label>
                <input
                  type="number"
                  value={formData.limitAmount}
                  onChange={e => setFormData(f => ({ ...f, limitAmount: e.target.value }))}
                  placeholder="1000000"
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Periode</label>
                <select
                  value={formData.period}
                  onChange={e => setFormData(f => ({ ...f, period: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="monthly">Bulanan</option>
                  <option value="weekly">Mingguan</option>
                  <option value="custom">Kustom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tanggal Mulai</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData(f => ({ ...f, startDate: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              {formError && <p className="text-red-600 dark:text-red-400 text-sm">{formError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      {editingBudget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold dark:text-white">Edit Budget</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{editingBudget.category}</p>
              </div>
              <button onClick={() => setEditingBudget(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Batas Anggaran Baru (Rp)</label>
                <input
                  type="number"
                  value={editForm.limitAmount}
                  onChange={e => setEditForm(f => ({ ...f, limitAmount: e.target.value }))}
                  placeholder="1000000"
                  autoFocus
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-400 mt-1.5">Sebelumnya: {formatIDR(editingBudget.limit)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Periode</label>
                <select
                  value={editForm.period}
                  onChange={e => setEditForm(f => ({ ...f, period: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="monthly">Bulanan</option>
                  <option value="weekly">Mingguan</option>
                  <option value="custom">Kustom</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingBudget(null)}
                  className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                  Batal
                </button>
                <button type="submit" disabled={isEditSubmitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium">
                  {isEditSubmitting ? 'Menyimpan...' : 'Perbarui Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

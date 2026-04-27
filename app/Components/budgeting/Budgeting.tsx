'use client'
import { useState, useEffect } from 'react';
import { AlertCircle, Sparkles, Plus, X, Trash2, RefreshCw } from 'lucide-react';
import { formatIDR } from '@/app/lib/format';
import { useData } from '@/app/lib/data-context';
import { getAISuggestions, generateAISuggestion } from '@/app/services/userService';

interface AiSuggestionBrief {
  id: string;
  content: string;
}

export function Budgeting() {
  const { budgets, categories, isLoading, createBudget, deleteBudget } = useData();
  const overBudget = budgets.filter(b => b.spent > b.limit);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    limitAmount: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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
    } catch {
      // ignore
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
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
    } catch {
      setFormError('Gagal menyimpan budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus budget ini?')) return;
    try {
      await deleteBudget(id);
    } catch {
      setDeleteError('Gagal menghapus budget');
    }
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Budgeting</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Budget
        </button>
      </div>

      {/* AI Suggestion */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg mb-2">Saran AI untuk Budget Anda</h3>
            {aiSuggestion ? (
              <p className="text-sm text-gray-700 mb-3">{aiSuggestion.content}</p>
            ) : (
              <p className="text-sm text-gray-500 mb-3">
                Belum ada saran AI. Klik tombol untuk mendapatkan saran berdasarkan data keuangan Anda.
              </p>
            )}
            <button
              onClick={handleGenerateSuggestion}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Membuat saran...' : 'Buat Saran Baru'}
            </button>
          </div>
        </div>
      </div>

      {/* Errors */}
      {deleteError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center justify-between">
          {deleteError}
          <button onClick={() => setDeleteError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Over Budget Alert */}
      {overBudget.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">
              {overBudget.length} kategori melebihi budget yang ditentukan
            </span>
          </div>
        </div>
      )}

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-400 mb-4">Belum ada budget. Buat budget untuk melacak pengeluaran Anda.</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                className={`bg-white rounded-lg p-6 shadow-sm border ${
                  pct > 100 ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{budget.icon}</span>
                    <div>
                      <h3 className="text-lg">{budget.category}</h3>
                      <p className="text-xs text-gray-500">
                        {formatIDR(budget.spent)} / {formatIDR(budget.limit)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-right ${pct > 100 ? 'text-red-600' : 'text-gray-700'}`}>
                      <p className="text-2xl">{pct}%</p>
                      {pct > 100 && (
                        <p className="text-xs">+{formatIDR(budget.spent - budget.limit)}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Hapus budget"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      pct > 100 ? 'bg-red-500' : pct > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Sisa: {formatIDR(Math.max(0, budget.limit - budget.spent))}
                  </span>
                  {pct > 100 ? (
                    <span className="text-xs text-red-600">Melebihi budget!</span>
                  ) : pct > 80 ? (
                    <span className="text-xs text-yellow-600">Hampir habis</span>
                  ) : (
                    <span className="text-xs text-green-600">Aman</span>
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg">Tambah Budget Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Kategori</label>
                <select
                  value={formData.categoryId}
                  onChange={e => setFormData(f => ({ ...f, categoryId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih kategori...</option>
                  {expenseCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Batas Anggaran (Rp)</label>
                <input
                  type="number"
                  value={formData.limitAmount}
                  onChange={e => setFormData(f => ({ ...f, limitAmount: e.target.value }))}
                  placeholder="1000000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Periode</label>
                <select
                  value={formData.period}
                  onChange={e => setFormData(f => ({ ...f, period: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Bulanan</option>
                  <option value="weekly">Mingguan</option>
                  <option value="custom">Kustom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Tanggal Mulai</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData(f => ({ ...f, startDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {formError && <p className="text-red-600 text-sm">{formError}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

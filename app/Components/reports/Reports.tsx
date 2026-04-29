'use client'
import { useState, useEffect } from 'react';
import { FileText, Lock, Calendar, Plus, X, RefreshCw } from 'lucide-react';
import { formatIDR } from '@/app/lib/format';
import { Card } from '@/app/Components/ui/Card';
import { SkeletonCard } from '@/app/Components/ui/Skeleton';
import { PremiumBanner } from '@/app/Components/ui/PremiumBanner';
import { useToast } from '@/app/Components/ui/ToastProvider';
import { getReports, createReport } from '@/app/services/userService';
import type { Report } from '@/app/types';

const PERIOD_LABELS: Record<string, string> = {
  monthly: 'Bulanan',
  quarterly: 'Kuartalan',
  custom: 'Kustom',
};

export function Reports() {
  const { showToast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    periodType: 'monthly',
    periodStart: '',
    periodEnd: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await getReports();
        if (!cancelled) setReports((res.data.data as Report[]) || []);
      } catch {
        if (!cancelled) showToast('Gagal memuat laporan', 'error');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchKey]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!formData.periodStart || !formData.periodEnd) {
      setFormError('Tanggal mulai dan akhir wajib diisi');
      return;
    }
    setIsSubmitting(true);
    setFormError('');
    try {
      await createReport(formData);
      setShowModal(false);
      setFormData({ periodType: 'monthly', periodStart: '', periodEnd: '' });
      setFetchKey(k => k + 1);
      showToast('Laporan berhasil dibuat');
    } catch {
      setFormError('Gagal membuat laporan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold dark:text-white">Laporan</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Buat Laporan Baru
        </button>
      </div>

      <PremiumBanner
        icon={<Lock className="w-6 h-6 text-amber-600" />}
        title="Export PDF & Excel Tersedia di Premium"
        description="Upgrade ke Premium untuk download laporan dalam format PDF dan Excel tanpa batas."
        ctaLabel="Upgrade Sekarang"
      />

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="w-12 h-12 text-gray-200 dark:text-gray-600 mb-4" />
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Belum ada laporan</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">
              Buat laporan untuk melihat ringkasan dan analisis keuangan Anda
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Buat Laporan Pertama
            </button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const start = new Date(report.periodStart).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'short', year: 'numeric',
            });
            const end = new Date(report.periodEnd).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'short', year: 'numeric',
            });
            return (
              <Card key={report.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 dark:text-white">
                        Laporan {PERIOD_LABELS[report.periodType] || report.periodType}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{start} – {end}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-2.5 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Pemasukan</p>
                          <p className="text-sm font-semibold text-green-600 dark:text-green-400">{formatIDR(report.summaryData.income)}</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-2.5 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Pengeluaran</p>
                          <p className="text-sm font-semibold text-red-600 dark:text-red-400">{formatIDR(report.summaryData.expense)}</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-2.5 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Saldo</p>
                          <p className={`text-sm font-semibold ${report.summaryData.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatIDR(Math.abs(report.summaryData.balance))}
                          </p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-2.5 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Tabungan</p>
                          <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">{report.summaryData.savingsRate}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-xl cursor-not-allowed flex items-center gap-1 text-sm"
                      disabled
                      title="Tersedia di paket Premium"
                    >
                      <Lock className="w-3 h-3" />
                      PDF
                    </button>
                    <button
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-xl cursor-not-allowed flex items-center gap-1 text-sm"
                      disabled
                      title="Tersedia di paket Premium"
                    >
                      <Lock className="w-3 h-3" />
                      Excel
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Report Types Info */}
      <Card>
        <h3 className="mb-4 font-semibold dark:text-white">Tipe Laporan yang Tersedia</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <h4 className="font-semibold mb-1.5 text-blue-900 dark:text-blue-300">Laporan Bulanan</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Ringkasan pemasukan, pengeluaran, dan saldo per bulan
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <h4 className="font-semibold mb-1.5 text-green-900 dark:text-green-300">Laporan Kuartalan</h4>
            <p className="text-sm text-green-700 dark:text-green-400">
              Analisis tren keuangan per 3 bulan dengan grafik perbandingan
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <h4 className="font-semibold mb-1.5 text-purple-900 dark:text-purple-300">Laporan Kustom</h4>
            <p className="text-sm text-purple-700 dark:text-purple-400">
              Pilih rentang tanggal bebas untuk laporan yang disesuaikan
            </p>
          </div>
        </div>
      </Card>

      {/* Create Report Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold dark:text-white">Buat Laporan Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Period shortcuts */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Periode Cepat</p>
                <div className="flex flex-wrap gap-2">
                  {([
                    {
                      label: 'Bulan Ini',
                      type: 'monthly',
                      get: () => {
                        const now = new Date();
                        return {
                          start: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`,
                          end: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
                        };
                      },
                    },
                    {
                      label: 'Bulan Lalu',
                      type: 'monthly',
                      get: () => {
                        const now = new Date();
                        const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                        const last  = new Date(now.getFullYear(), now.getMonth(), 0);
                        return { start: first.toISOString().split('T')[0], end: last.toISOString().split('T')[0] };
                      },
                    },
                    {
                      label: 'Kuartal Ini',
                      type: 'quarterly',
                      get: () => {
                        const now = new Date();
                        const q = Math.floor(now.getMonth() / 3);
                        const first = new Date(now.getFullYear(), q * 3, 1);
                        const last  = new Date(now.getFullYear(), q * 3 + 3, 0);
                        return { start: first.toISOString().split('T')[0], end: last.toISOString().split('T')[0] };
                      },
                    },
                    {
                      label: 'Tahun Ini',
                      type: 'custom',
                      get: () => {
                        const y = new Date().getFullYear();
                        return { start: `${y}-01-01`, end: `${y}-12-31` };
                      },
                    },
                  ] as const).map(({ label, type, get }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        const { start, end } = get();
                        setFormData({ periodType: type as string, periodStart: start, periodEnd: end });
                      }}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl text-sm font-medium transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tipe Periode</label>
                <select
                  value={formData.periodType}
                  onChange={e => setFormData(f => ({ ...f, periodType: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="monthly">Bulanan</option>
                  <option value="quarterly">Kuartalan</option>
                  <option value="custom">Kustom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tanggal Mulai</label>
                <input
                  type="date"
                  value={formData.periodStart}
                  onChange={e => setFormData(f => ({ ...f, periodStart: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tanggal Akhir</label>
                <input
                  type="date"
                  value={formData.periodEnd}
                  onChange={e => setFormData(f => ({ ...f, periodEnd: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              {formError && <p className="text-red-600 dark:text-red-400 text-sm">{formError}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Membuat...' : 'Buat Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client'
import { useState, useEffect } from 'react';
import { FileText, Lock, Calendar, Plus, X, RefreshCw } from 'lucide-react';
import { formatIDR } from '@/app/lib/format';
import { Card } from '@/app/Components/ui/Card';
import { PremiumBanner } from '@/app/Components/ui/PremiumBanner';
import { getReports, createReport } from '@/app/services/userService';
import type { Report } from '@/app/types';

const PERIOD_LABELS: Record<string, string> = {
  monthly: 'Bulanan',
  quarterly: 'Kuartalan',
  custom: 'Kustom',
};

export function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    periodType: 'monthly',
    periodStart: '',
    periodEnd: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const res = await getReports();
        if (!cancelled) setReports((res.data.data as Report[]) || []);
      } catch {
        if (!cancelled) setError('Gagal memuat laporan');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [fetchKey]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!formData.periodStart || !formData.periodEnd) {
      setError('Tanggal mulai dan akhir wajib diisi');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await createReport(formData);
      setShowModal(false);
      setFormData({ periodType: 'monthly', periodStart: '', periodEnd: '' });
      setFetchKey(k => k + 1);
    } catch {
      setError('Gagal membuat laporan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Laporan</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Buat Laporan Baru
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center justify-between">
          {error}
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      <PremiumBanner
        icon={<Lock className="w-6 h-6 text-amber-600" />}
        title="Export PDF & Excel Tersedia di Premium"
        description="Upgrade ke Premium untuk download laporan dalam format PDF dan Excel tanpa batas."
        ctaLabel="Upgrade Sekarang"
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">
              Belum ada laporan. Buat laporan untuk melihat ringkasan keuangan Anda.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1">
                        Laporan {PERIOD_LABELS[report.periodType] || report.periodType}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{start} – {end}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="bg-green-50 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-500">Pemasukan</p>
                          <p className="text-sm text-green-600">{formatIDR(report.summaryData.income)}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-500">Pengeluaran</p>
                          <p className="text-sm text-red-600">{formatIDR(report.summaryData.expense)}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-500">Saldo</p>
                          <p className={`text-sm ${report.summaryData.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {formatIDR(Math.abs(report.summaryData.balance))}
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-500">Tabungan</p>
                          <p className="text-sm text-purple-600">{report.summaryData.savingsRate}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      className="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-1 text-sm"
                      disabled
                      title="Tersedia di paket Premium"
                    >
                      <Lock className="w-3 h-3" />
                      PDF
                    </button>
                    <button
                      className="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-1 text-sm"
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
        <h3 className="mb-4">Tipe Laporan yang Tersedia</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="mb-2 text-blue-900">Laporan Bulanan</h4>
            <p className="text-sm text-blue-700">
              Ringkasan pemasukan, pengeluaran, dan saldo per bulan
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="mb-2 text-green-900">Laporan Kuartalan</h4>
            <p className="text-sm text-green-700">
              Analisis tren keuangan per 3 bulan dengan grafik perbandingan
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="mb-2 text-purple-900">Laporan Kustom</h4>
            <p className="text-sm text-purple-700">
              Pilih rentang tanggal bebas untuk laporan yang disesuaikan
            </p>
          </div>
        </div>
      </Card>

      {/* Create Report Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg">Buat Laporan Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Tipe Periode</label>
                <select
                  value={formData.periodType}
                  onChange={e => setFormData(f => ({ ...f, periodType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Bulanan</option>
                  <option value="quarterly">Kuartalan</option>
                  <option value="custom">Kustom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Tanggal Mulai</label>
                <input
                  type="date"
                  value={formData.periodStart}
                  onChange={e => setFormData(f => ({ ...f, periodStart: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Tanggal Akhir</label>
                <input
                  type="date"
                  value={formData.periodEnd}
                  onChange={e => setFormData(f => ({ ...f, periodEnd: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
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
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
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

'use client'
import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, Crown, RefreshCw } from 'lucide-react';
import { Card } from '@/app/Components/ui/Card';
import { Skeleton, SkeletonCard } from '@/app/Components/ui/Skeleton';
import { PremiumBanner } from '@/app/Components/ui/PremiumBanner';
import { useToast } from '@/app/Components/ui/ToastProvider';
import { getAISuggestions, generateAISuggestion, updateAISuggestion } from '@/app/services/userService';
import { useData } from '@/app/lib/data-context';
import type { AiSuggestion } from '@/app/types';

export function AISuggestions() {
  const { transactions } = useData();
  const { showToast } = useToast();
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await getAISuggestions();
        if (!cancelled) setSuggestions((res.data.data as AiSuggestion[]) || []);
      } catch {
        if (!cancelled) showToast('Gagal memuat saran AI', 'error');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchKey]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateAISuggestion();
      setFetchKey(k => k + 1);
      showToast('Saran AI baru berhasil dibuat');
    } catch {
      showToast('Gagal membuat saran AI. Pastikan Anda memiliki data transaksi.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = async (id: string) => {
    try {
      await updateAISuggestion(id, { isApplied: true, isRead: true });
      setSuggestions(prev => prev.map(s => s.id === id ? { ...s, isApplied: true, isRead: true } : s));
      showToast('Saran berhasil diterapkan');
    } catch {
      showToast('Gagal menerapkan saran', 'error');
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await updateAISuggestion(id, { isRead: true });
      setSuggestions(prev => prev.map(s => s.id === id ? { ...s, isRead: true } : s));
      showToast('Saran diabaikan');
    } catch {
      showToast('Gagal mengabaikan saran', 'error');
    }
  };

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  const financialScore = Math.min(100, Math.max(0, Math.round(savingsRate * 3)));

  const scoreLabel =
    financialScore >= 80 ? 'Sangat Baik' :
    financialScore >= 60 ? 'Bagus' :
    financialScore >= 40 ? 'Cukup' :
    'Perlu Perbaikan';

  const scoreColor =
    financialScore >= 80 ? 'text-green-600 dark:text-green-400' :
    financialScore >= 60 ? 'text-blue-600 dark:text-blue-400' :
    financialScore >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
    'text-red-600 dark:text-red-400';

  const activeSuggestions = suggestions.filter(s => !s.isApplied);
  const appliedSuggestions = suggestions.filter(s => s.isApplied);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl dark:text-white">Saran AI</h2>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Membuat...' : 'Minta Saran Baru'}
        </button>
      </div>

      {/* Financial Score */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg mb-1 dark:text-white">Skor Keuangan Anda</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Berdasarkan data transaksi Anda</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl ${scoreColor}`}>{financialScore}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">/ 100</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-linear-to-r from-purple-500 to-pink-500 transition-all"
            style={{ width: `${financialScore}%` }}
          />
        </div>
        <p className={`text-sm mt-3 ${scoreColor}`}>
          {scoreLabel}.{' '}
          {financialScore >= 60
            ? 'Pertahankan kebiasaan baik ini!'
            : 'Terapkan saran di bawah untuk meningkatkan skor Anda.'}
        </p>
      </Card>

      {/* Active Suggestions */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 dark:text-white">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Saran Aktif
        </h3>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : activeSuggestions.length === 0 ? (
          <Card>
            <p className="text-center text-gray-400 py-8">
              Belum ada saran aktif. Klik &quot;Minta Saran Baru&quot; untuk mendapatkan rekomendasi berdasarkan data keuangan Anda.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeSuggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{suggestion.content}</p>
                <p className="text-xs text-gray-400 mb-3">
                  {new Date(suggestion.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApply(suggestion.id)}
                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Terapkan
                  </button>
                  {!suggestion.isRead && (
                    <button
                      onClick={() => handleDismiss(suggestion.id)}
                      className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      Abaikan
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Applied Suggestions History */}
      {appliedSuggestions.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 dark:text-white">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            Saran yang Sudah Diterapkan
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
            {appliedSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm dark:text-gray-300">{suggestion.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(suggestion.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <PremiumBanner
        icon={<Crown className="w-6 h-6 text-amber-600" />}
        title="Upgrade ke Premium"
        badge="Baru!"
        description="Dapatkan saran AI yang lebih personal, prediksi keuangan 6 bulan ke depan, dan analisis mendalam untuk mencapai tujuan finansial lebih cepat."
        features={[
          'Saran AI unlimited & real-time',
          'Prediksi keuangan 6 bulan',
          'Export laporan PDF tanpa batas',
        ]}
        ctaLabel="Mulai Trial 7 Hari Gratis"
      />

      {/* Loading overlay for generate */}
      {isGenerating && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full bg-gray-600" />
          Membuat saran AI...
        </div>
      )}
    </div>
  );
}

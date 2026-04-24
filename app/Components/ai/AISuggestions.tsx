import { Sparkles, CheckCircle, Crown } from 'lucide-react';
import { formatIDR } from '@/app/lib/format';
import { Card } from '@/app/Components/ui/Card';
import { PremiumBanner } from '@/app/Components/ui/PremiumBanner';

const suggestions = [
  {
    id: 1,
    title: 'Kurangi belanja online minggu ini',
    description: 'Anda sudah melewati budget belanja 25%. Tunda pembelian non-esensial untuk menghemat Rp 300.000.',
    impact: 'Rp 300.000',
    priority: 'Tinggi',
    category: 'Penghematan',
  },
  {
    id: 2,
    title: 'Alihkan ke transportasi umum',
    description: 'Menggunakan KRL/MRT bisa menghemat Rp 200.000 per bulan dibanding Grab/Gojek setiap hari.',
    impact: 'Rp 200.000',
    priority: 'Sedang',
    category: 'Transport',
  },
  {
    id: 3,
    title: 'Meal prep untuk hemat makan',
    description: 'Masak untuk 3 hari sekaligus bisa mengurangi pengeluaran makan hingga 40%.',
    impact: 'Rp 480.000',
    priority: 'Sedang',
    category: 'Makanan',
  },
];

const appliedSuggestions = [
  {
    id: 1,
    title: 'Batalkan langganan yang tidak terpakai',
    savedAmount: 150000,
    date: '15 Apr 2026',
  },
  {
    id: 2,
    title: 'Pindah paket internet ke yang lebih murah',
    savedAmount: 100000,
    date: '10 Apr 2026',
  },
];

export function AISuggestions() {
  const financialScore = 78;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl">Saran AI</h2>

      {/* Financial Score */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg mb-1">Skor Keuangan Anda</h3>
            <p className="text-sm text-gray-600">Berdasarkan kebiasaan 30 hari terakhir</p>
          </div>
          <div className="text-right">
            <div className="text-4xl text-purple-600">{financialScore}</div>
            <p className="text-sm text-gray-600">/ 100</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-linear-to-r from-purple-500 to-pink-500"
            style={{ width: `${financialScore}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Bagus! Tingkatkan skor dengan menerapkan saran di bawah.
        </p>
      </Card>

      {/* Priority Suggestions */}
      <div>
        <h3 className="mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Saran Prioritas
        </h3>
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="mb-2">{suggestion.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      Hemat {suggestion.impact}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        suggestion.priority === 'Tinggi'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      Prioritas {suggestion.priority}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {suggestion.category}
                    </span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Terapkan Saran
              </button>
            </Card>
          ))}
        </div>
      </div>

      {/* Applied Suggestions History */}
      <div>
        <h3 className="mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Saran yang Sudah Diterapkan
        </h3>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
          {appliedSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm">{suggestion.title}</p>
                  <p className="text-xs text-gray-500">{suggestion.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">+{formatIDR(suggestion.savedAmount)}</p>
                <p className="text-xs text-gray-500">Hemat</p>
              </div>
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
}

import { Sparkles, TrendingUp, CheckCircle, Crown, Lock } from 'lucide-react';

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
      {/* Header */}
      <h2 className="text-2xl">Saran AI</h2>

      {/* Financial Score */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
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
            className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ width: `${financialScore}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Bagus! Tingkatkan skor dengan menerapkan saran di bawah.
        </p>
      </div>

      {/* Priority Suggestions */}
      <div>
        <h3 className="mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Saran Prioritas
        </h3>
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
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
            </div>
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
                <p className="text-sm text-green-600">+Rp {suggestion.savedAmount.toLocaleString('id-ID')}</p>
                <p className="text-xs text-gray-500">Hemat</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Teaser */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-6 border-2 border-amber-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Crown className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg mb-2 flex items-center gap-2">
              Upgrade ke Premium
              <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded text-xs">Baru!</span>
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Dapatkan saran AI yang lebih personal, prediksi keuangan 6 bulan ke depan,
              dan analisis mendalam untuk mencapai tujuan finansial lebih cepat.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Saran AI unlimited & real-time
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Prediksi keuangan 6 bulan
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Export laporan PDF tanpa batas
              </li>
            </ul>
            <button className="bg-linear-to-r from-amber-500 to-yellow-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all">
              Mulai Trial 7 Hari Gratis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

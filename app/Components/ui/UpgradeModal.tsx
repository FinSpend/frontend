'use client'
import { X, Crown, Sparkles, FileText, BarChart3, Shield } from 'lucide-react';

interface UpgradeModalProps {
  onClose: () => void;
}

const FEATURES = [
  { icon: Sparkles, label: 'Saran AI Personal Tanpa Batas', desc: 'Analisis mendalam berdasarkan profil keuangan Anda' },
  { icon: FileText, label: 'Export Laporan PDF & Excel', desc: 'Download laporan keuangan lengkap kapan saja' },
  { icon: BarChart3, label: 'Laporan Keuangan Lanjutan', desc: 'Tren historis, prediksi, dan analisis mendalam' },
  { icon: Shield, label: 'Prioritas Dukungan', desc: 'Respon lebih cepat dari tim support FinSpend' },
];

export function UpgradeModal({ onClose }: UpgradeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-linear-to-r from-amber-400 to-yellow-500 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl text-white">Upgrade ke Premium</h2>
              <p className="text-white/80 text-sm">Buka semua fitur eksklusif FinSpend</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="p-6">
          <div className="space-y-3 mb-6">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-center mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Mulai dari</p>
            <p className="text-3xl text-amber-600 dark:text-amber-400">
              Rp 49.000<span className="text-base text-gray-400 dark:text-gray-500">/bulan</span>
            </p>
          </div>

          {/* Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-3 text-center mb-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              🚀 Fitur pembayaran segera hadir — pantau terus pembaruan FinSpend!
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl text-sm transition-all"
          >
            Oke, Beritahu Saya Saat Siap
          </button>
        </div>
      </div>
    </div>
  );
}

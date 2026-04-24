import { FileText, Lock, Calendar } from 'lucide-react';
import { Card } from '@/app/Components/ui/Card';
import { PremiumBanner } from '@/app/Components/ui/PremiumBanner';

const reports = [
  {
    id: 1,
    name: 'Laporan Keuangan Maret 2026',
    date: '31 Mar 2026',
    type: 'Bulanan',
    size: '2.4 MB',
  },
  {
    id: 2,
    name: 'Laporan Keuangan Februari 2026',
    date: '28 Feb 2026',
    type: 'Bulanan',
    size: '2.1 MB',
  },
  {
    id: 3,
    name: 'Laporan Tahunan 2025',
    date: '31 Des 2025',
    type: 'Tahunan',
    size: '15.8 MB',
  },
  {
    id: 4,
    name: 'Laporan Q1 2026',
    date: '31 Mar 2026',
    type: 'Kuartalan',
    size: '5.2 MB',
  },
];

export function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Laporan</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Buat Laporan Baru
        </button>
      </div>

      <PremiumBanner
        icon={<Lock className="w-6 h-6 text-amber-600" />}
        title="Export PDF & Excel Tersedia di Premium"
        description="Upgrade ke Premium untuk download laporan dalam format PDF dan Excel tanpa batas."
        ctaLabel="Upgrade Sekarang"
      />

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-1">{report.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {report.date}
                    </span>
                    <span>•</span>
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Lihat
                </button>
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2"
                  disabled
                  aria-disabled="true"
                  title="Tersedia di paket Premium"
                >
                  <Lock className="w-4 h-4" />
                  PDF
                </button>
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2"
                  disabled
                  aria-disabled="true"
                  title="Tersedia di paket Premium"
                >
                  <Lock className="w-4 h-4" />
                  Excel
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

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
            <h4 className="mb-2 text-purple-900">Laporan Tahunan</h4>
            <p className="text-sm text-purple-700">
              Laporan lengkap setahun dengan breakdown kategori detail
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

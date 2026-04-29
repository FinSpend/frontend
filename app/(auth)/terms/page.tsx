import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl text-gray-900">Syarat & Ketentuan</h1>
            <p className="text-xs text-gray-400 mt-0.5">Terakhir diperbarui: Januari 2025</p>
          </div>
        </div>

        <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-gray-900 mb-1.5">1. Penerimaan Syarat</h2>
            <p>Dengan mendaftar dan menggunakan layanan FinSpend, Anda menyetujui syarat dan ketentuan yang berlaku. Jika tidak setuju, harap tidak menggunakan layanan ini.</p>
          </section>
          <section>
            <h2 className="text-gray-900 mb-1.5">2. Penggunaan Layanan</h2>
            <p>FinSpend adalah aplikasi manajemen keuangan pribadi. Anda bertanggung jawab atas keakuratan data yang dimasukkan dan keamanan akun Anda.</p>
          </section>
          <section>
            <h2 className="text-gray-900 mb-1.5">3. Privasi Data</h2>
            <p>Data keuangan Anda dienkripsi dan hanya digunakan untuk keperluan layanan FinSpend. Kami tidak menjual data pribadi Anda kepada pihak ketiga.</p>
          </section>
          <section>
            <h2 className="text-gray-900 mb-1.5">4. Batasan Layanan</h2>
            <p>Saran AI yang diberikan bersifat informatif dan bukan merupakan saran keuangan profesional. Selalu konsultasikan keputusan keuangan besar dengan profesional keuangan.</p>
          </section>
          <section>
            <h2 className="text-gray-900 mb-1.5">5. Perubahan Syarat</h2>
            <p>FinSpend berhak mengubah syarat dan ketentuan sewaktu-waktu. Perubahan akan diberitahukan melalui email atau notifikasi dalam aplikasi.</p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke pendaftaran
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl text-gray-900">Kebijakan Privasi</h1>
            <p className="text-xs text-gray-400 mt-0.5">Terakhir diperbarui: Januari 2025</p>
          </div>
        </div>

        <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-gray-900 mb-1.5">1. Data yang Dikumpulkan</h2>
            <p>Kami mengumpulkan nama, email, dan data keuangan yang Anda masukkan secara sukarela, termasuk transaksi, anggaran, dan profil keuangan.</p>
          </section>
          <section>
            <h2 className="text-gray-900 mb-1.5">2. Penggunaan Data</h2>
            <p>Data Anda digunakan untuk menyediakan layanan manajemen keuangan, menghasilkan laporan personal, dan memberikan saran AI yang relevan.</p>
          </section>
          <section>
            <h2 className="text-gray-900 mb-1.5">3. Keamanan Data</h2>
            <p>Kami menggunakan enkripsi standar industri untuk melindungi data Anda. Password disimpan dalam bentuk hash dan tidak pernah disimpan dalam plaintext.</p>
          </section>
          <section>
            <h2 className="text-gray-900 mb-1.5">4. Berbagi Data</h2>
            <p>Kami tidak menjual, menyewakan, atau berbagi data pribadi Anda kepada pihak ketiga tanpa persetujuan eksplisit Anda, kecuali diwajibkan oleh hukum.</p>
          </section>
          <section>
            <h2 className="text-gray-900 mb-1.5">5. Hak Pengguna</h2>
            <p>Anda berhak mengakses, memperbarui, atau menghapus data pribadi Anda kapan saja melalui pengaturan akun atau dengan menghubungi tim support kami.</p>
          </section>
          <section>
            <h2 className="text-gray-900 mb-1.5">6. Kontak</h2>
            <p>Pertanyaan terkait privasi dapat disampaikan ke <a href="mailto:privacy@finspend.id" className="text-blue-600 hover:underline">privacy@finspend.id</a>.</p>
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

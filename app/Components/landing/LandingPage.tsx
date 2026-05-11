'use client'
import { useRouter } from 'next/navigation';
import { ArrowRight, TrendingUp, Wallet, PieChart, Zap, Shield, BarChart3, Loader2 } from 'lucide-react';
import { useData } from '@/app/lib/data-context';
import { useEffect } from 'react';

export function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useData();

  // Jika sedang loading atau sudah login, redirect ke dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const handleGetStarted = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">FinSpend</div>
          <div className="flex gap-4">
            <button
              onClick={handleGetStarted}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
            >
              Masuk
            </button>
            <button
              onClick={handleSignUp}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Daftar Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Kelola Keuangan <span className="text-blue-600 dark:text-blue-400">Anda dengan Mudah</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              FinSpend membantu Anda melacak pengeluaran, membuat anggaran, dan mencapai tujuan finansial dengan fitur analitik yang canggih dan antarmuka yang intuitif.
            </p>
            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={handleGetStarted}
                className="flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
              >
                Mulai Gratis <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={handleSignUp}
                className="flex items-center justify-center px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 font-semibold transition"
              >
                Lihat Demo
              </button>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-linear-to-br from-blue-400 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-80">Saldo Anda</span>
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-bold">Rp 2.450.000</div>
                  <div className="pt-4 border-t border-white/20">
                    <div className="flex justify-between text-sm mb-4">
                      <span>Pengeluaran Bulan Ini</span>
                      <span className="font-semibold">Rp 890.000</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white rounded-full h-2 w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Fitur Unggulan FinSpend
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Semua yang Anda butuhkan untuk mengelola keuangan pribadi dengan efisien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8 hover:shadow-lg transition">
              <div className="bg-blue-600 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Pantau Pengeluaran
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Catat setiap transaksi dengan kategori lengkap dan lihat pola pengeluaran Anda secara real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8 hover:shadow-lg transition">
              <div className="bg-green-600 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Buat Anggaran
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Tetapkan batas pengeluaran per kategori dan dapatkan pemberitahuan ketika mendekati batas.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8 hover:shadow-lg transition">
              <div className="bg-purple-600 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Analitik Mendalam
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Dapatkan wawasan visual dengan laporan dan grafik yang mudah dipahami untuk setiap periode.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8 hover:shadow-lg transition">
              <div className="bg-orange-600 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Kelola Dompet
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Kelola multiple dompet atau rekening bank dan lacak saldo di masing-masing dengan mudah.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-linear-to-br from-red-50 to-red-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8 hover:shadow-lg transition">
              <div className="bg-red-600 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Saran AI
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Dapatkan rekomendasi personal untuk meningkatkan kesehatan finansial Anda dengan AI.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-linear-to-br from-cyan-50 to-cyan-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8 hover:shadow-lg transition">
              <div className="bg-cyan-600 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Aman & Privat
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Data Anda dienkripsi dengan standar keamanan industri dan dijaga dengan ketat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Siap Mengelola Keuangan Anda dengan Lebih Baik?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Bergabunglah dengan ribuan pengguna yang telah mengubah cara mereka mengelola keuangan.
          </p>
          <button
            onClick={handleSignUp}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 font-bold text-lg transition"
          >
            Mulai Gratis Sekarang
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">Produk</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Fitur</a></li>
                <li><a href="#" className="hover:text-white transition">Harga</a></li>
                <li><a href="#" className="hover:text-white transition">Keamanan</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Tentang</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Karir</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white transition">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Kontak</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@finspend.com" className="hover:text-white transition">Email</a></li>
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm">&copy; 2024 FinSpend. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

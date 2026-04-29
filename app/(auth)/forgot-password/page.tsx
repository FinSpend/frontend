import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-7 h-7 text-blue-600" />
        </div>
        <h1 className="text-xl text-gray-900 mb-2">Lupa Password</h1>
        <p className="text-sm text-gray-500 mb-6">
          Fitur reset password sedang dalam pengembangan. Hubungi tim support FinSpend untuk bantuan pemulihan akun.
        </p>
        <a
          href="mailto:support@finspend.id"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors mb-4"
        >
          <Mail className="w-4 h-4" />
          Hubungi Support
        </a>
        <div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke halaman login
          </Link>
        </div>
      </div>
    </div>
  );
}

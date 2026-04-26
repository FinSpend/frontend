'use client'
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import type { RegisterCredentials } from '@/app/types';
import { register } from '@/app/services/userService';

interface RegisterFormProps {
  onSuccess?: () => void;
}

type FieldErrors = Partial<Record<keyof RegisterCredentials, string>>;

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const capped = Math.min(score, 4);
  const labels = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat kuat'];
  const colors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-500', 'bg-green-500'];

  return { score: capped, label: labels[capped], color: colors[capped] };
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [data, setData] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [agreed, setAgreed] = useState(false);

  const strength = useMemo(() => getPasswordStrength(data.password), [data.password]);

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!data.name.trim()) {
      errors.name = 'Nama lengkap wajib diisi';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Nama minimal 2 karakter';
    }

    if (!data.email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Format email tidak valid';
    }

    if (!data.password) {
      errors.password = 'Password wajib diisi';
    } else if (data.password.length < 8) {
      errors.password = 'Password minimal 8 karakter';
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Password tidak cocok';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;
    if (!agreed) {
      setError('Anda harus menyetujui syarat & ketentuan untuk melanjutkan');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: ganti dengan API call
      // const res = await api.post('/auth/register', { name: data.name, email: data.email, password: data.password });
      const { confirmPassword, ...payload } = data;
      const res = await register(payload);
      console.log("SUCCESS:", res.data);

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan, coba lagi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof RegisterCredentials, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    if (error) setError('');
  };

  const inputClass = (field: keyof RegisterCredentials) =>
    `w-full pl-10 pr-4 py-3 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
      fieldErrors[field]
        ? 'border-red-400 focus:ring-red-200'
        : 'border-gray-200 focus:ring-[#0047AB]/25 focus:border-[#0047AB]'
    }`;

  return (
    <div className="w-full max-w-md">
      {/* Logo & Heading */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0047AB] rounded-2xl mb-4 shadow-lg shadow-[#0047AB]/30">
          <span className="text-white text-2xl">💸</span>
        </div>
        <h1 className="text-2xl text-gray-900 mb-1">Buat akun baru</h1>
        <p className="text-sm text-gray-500">Mulai kelola keuangan Anda bersama FinSpend</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {error && (
          <div className="mb-5 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm text-gray-700 mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={data.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nama lengkap Anda"
                className={inputClass('name')}
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1.5 text-xs text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="block text-sm text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="nama@email.com"
                className={inputClass('email')}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1.5 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="reg-password" className="block text-sm text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={data.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Minimal 8 karakter"
                className={`${inputClass('password')} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1.5 text-xs text-red-600">{fieldErrors.password}</p>
            )}

            {/* Password Strength Meter */}
            {data.password && (
              <div className="mt-2.5">
                <div className="flex gap-1 mb-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        i <= strength.score ? strength.color : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs ${
                  strength.score <= 1 ? 'text-red-500' :
                  strength.score === 2 ? 'text-yellow-600' :
                  strength.score === 3 ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-1.5">
              Konfirmasi Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                value={data.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Ulangi password"
                className={`${inputClass('confirmPassword')} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showConfirm ? 'Sembunyikan konfirmasi' : 'Tampilkan konfirmasi'}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {data.confirmPassword && data.password === data.confirmPassword && (
                <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (error.includes('syarat')) setError('');
              }}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#0047AB]"
            />
            <span className="text-sm text-gray-600 leading-relaxed">
              Saya menyetujui{' '}
              <Link href="/terms" className="text-[#0047AB] hover:underline">Syarat & Ketentuan</Link>
              {' '}dan{' '}
              <Link href="/privacy" className="text-[#0047AB] hover:underline">Kebijakan Privasi</Link>
              {' '}FinSpend
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#0047AB] text-white text-sm rounded-xl hover:bg-[#003d99] active:bg-[#003080] focus:outline-none focus:ring-2 focus:ring-[#0047AB]/50 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Membuat akun…
              </>
            ) : (
              'Buat Akun'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">atau</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button
          type="button"
          className="w-full py-3 px-4 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Daftar dengan Google
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-[#0047AB] hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
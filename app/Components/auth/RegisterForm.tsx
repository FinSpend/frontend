'use client'
import { useState, useMemo } from 'react';
import Image from 'next/image';
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

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;
    if (!agreed) {
      setError('Anda harus menyetujui syarat & ketentuan untuk melanjutkan');
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      await register(payload);
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
        : 'border-gray-200 focus:ring-blue-600/25 focus:border-blue-600'
    }`;

  return (
    <div className="w-full max-w-md">
      {/* Logo & Heading */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <Image src="/Logo_FinSpend.png" alt="FinSpend" width={220} height={220} priority />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Buat akun baru</h1>
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
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
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1.5">
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
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1.5">
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
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
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
              className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-blue-600"
            />
            <span className="text-sm text-gray-600 leading-relaxed">
              Saya menyetujui{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">Syarat & Ketentuan</Link>
              {' '}dan{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">Kebijakan Privasi</Link>
              {' '}FinSpend
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
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

      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-blue-600 hover:underline font-medium">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}

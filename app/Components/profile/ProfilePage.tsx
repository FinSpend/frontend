'use client'
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Mail, Calendar, Crown, Receipt, Target, TrendingUp,
  Settings, Shield, ChevronRight, KeyRound, Trash2,
  X, Eye, EyeOff, Loader2, AlertCircle, Pencil, User,
} from 'lucide-react';
import { useData } from '@/app/lib/data-context';
import { useToast } from '@/app/Components/ui/ToastProvider';
import { formatIDR } from '@/app/lib/format';
import { changePassword, deleteAccount, updateUser } from '@/app/services/userService';
import { UpgradeModal } from '@/app/Components/ui/UpgradeModal';
import { useRouter } from 'next/navigation';

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    'from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600',
    'from-emerald-500 to-teal-600', 'from-rose-500 to-orange-500',
    'from-amber-500 to-yellow-500', 'from-indigo-500 to-purple-600',
    'from-teal-500 to-cyan-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

const GOAL_LABELS: Record<string, { label: string; icon: string }> = {
  emergency:  { label: 'Dana Darurat',  icon: '🛡️' },
  house:      { label: 'Beli Rumah',    icon: '🏠' },
  vacation:   { label: 'Liburan',       icon: '✈️' },
  investment: { label: 'Investasi',     icon: '📈' },
  retirement: { label: 'Pensiun',       icon: '🌴' },
  debt:       { label: 'Lunasi Hutang', icon: '💳' },
};

const inputCls = 'w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm';

export function ProfilePage() {
  const { user, transactions, budgets, profile, clearAll, refetch } = useData();
  const { showToast } = useToast();
  const router = useRouter();

  // modal states
  const [showUpgrade, setShowUpgrade]     = useState(false);
  const [showPassword, setShowPassword]   = useState(false);
  const [showDelete, setShowDelete]       = useState(false);
  const [showEditName, setShowEditName]   = useState(false);

  // edit name form
  const [editNameValue, setEditNameValue] = useState('');
  const [editNameLoading, setEditNameLoading] = useState(false);

  // password form
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');

  // delete form
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const initials       = user ? getInitials(user.name) : '?';
  const avatarGradient = user ? getAvatarColor(user.name) : 'from-gray-400 to-gray-500';
  const isPremium      = user?.plan === 'premium';

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const totalIncome  = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const savingsRate  = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  const financialScore = Math.min(100, Math.max(0, Math.round(savingsRate * 3)));
  const scoreLabel     = financialScore >= 80 ? 'Sangat Baik' : financialScore >= 60 ? 'Bagus' : financialScore >= 40 ? 'Cukup' : 'Perlu Perbaikan';
  const scoreGradient  = financialScore >= 80 ? 'from-green-400 to-emerald-500' : financialScore >= 60 ? 'from-blue-400 to-indigo-500' : financialScore >= 40 ? 'from-yellow-400 to-amber-500' : 'from-red-400 to-rose-500';
  const scoreTextColor = financialScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : financialScore >= 60 ? 'text-blue-600 dark:text-blue-400' : financialScore >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';

  const activeCategories = useMemo(
    () => Array.from(new Set(transactions.map(t => t.category))).filter(Boolean).length,
    [transactions]
  );

  // ── Handlers ──────────────────────────────────────────────────

  const handleEditName = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    const trimmed = editNameValue.trim();
    if (!trimmed || trimmed.length < 2) {
      showToast('Nama minimal 2 karakter', 'error');
      return;
    }
    setEditNameLoading(true);
    try {
      await updateUser({ name: trimmed });
      refetch();
      setShowEditName(false);
      showToast('Nama berhasil diperbarui');
    } catch {
      showToast('Gagal memperbarui nama', 'error');
    } finally {
      setEditNameLoading(false);
    }
  };

  const handleChangePassword = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setPwError('');
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      setPwError('Semua field wajib diisi'); return;
    }
    if (pwForm.next.length < 8) {
      setPwError('Password baru minimal 8 karakter'); return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('Konfirmasi password tidak cocok'); return;
    }
    setPwLoading(true);
    try {
      await changePassword({ currentPassword: pwForm.current, newPassword: pwForm.next });
      showToast('Password berhasil diubah');
      setShowPassword(false);
      setPwForm({ current: '', next: '', confirm: '' });
    } catch {
      setPwError('Password saat ini salah atau terjadi kesalahan');
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (deleteEmail !== user?.email) {
      showToast('Email tidak sesuai', 'error'); return;
    }
    setDeleteLoading(true);
    try {
      await deleteAccount();
      clearAll();
      router.replace('/login');
    } catch {
      showToast('Gagal menghapus akun, coba lagi', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Hero Card ── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 md:px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${avatarGradient} flex items-center justify-center text-white text-xl shadow-md shrink-0`}>
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-semibold dark:text-white">{user?.name ?? '—'}</h2>
                  <button
                    onClick={() => { setEditNameValue(user?.name ?? ''); setShowEditName(true); }}
                    className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Edit nama"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  {isPremium ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-linear-to-r from-amber-400 to-yellow-500 text-white rounded-full text-xs shadow-sm">
                      <Crown className="w-3 h-3" /> Premium
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-xs">
                      <Shield className="w-3 h-3" /> Free
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                  <span className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
                    <Mail className="w-3.5 h-3.5" />{user?.email ?? '—'}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />Bergabung {joinDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!isPremium && (
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm transition-colors shadow-sm font-medium"
                >
                  <Crown className="w-3.5 h-3.5" /> Upgrade
                </button>
              )}
              <Link
                href="/settings"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-sm transition-colors font-medium"
              >
                <Settings className="w-3.5 h-3.5" /> Edit Profil
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Transaksi', value: transactions.length, icon: Receipt,    bg: 'bg-blue-50 dark:bg-blue-900/20',     text: 'text-blue-600 dark:text-blue-400' },
          { label: 'Budget Aktif',    value: budgets.length,      icon: Target,     bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
          { label: 'Kategori',        value: activeCategories,    icon: TrendingUp, bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
        ].map(({ label, value, icon: Icon, bg, text }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 text-center">
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}>
              <Icon className={`w-6 h-6 ${text}`} />
            </div>
            <p className={`text-3xl font-semibold ${text}`}>{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Financial Score ── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold dark:text-white">Skor Keuangan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Berdasarkan riwayat transaksi Anda</p>
          </div>
          <div className="text-right">
            <span className={`text-5xl font-bold ${scoreTextColor}`}>{financialScore}</span>
            <span className="text-gray-400 text-xl">/100</span>
          </div>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-3 overflow-hidden">
          <div className={`h-3 rounded-full bg-linear-to-r ${scoreGradient} transition-all duration-1000`} style={{ width: `${financialScore}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${scoreTextColor}`}>{scoreLabel}</span>
          <span className="text-xs text-gray-400">
            {financialScore >= 60 ? 'Pertahankan kebiasaan baik ini!' : 'Terapkan saran AI untuk meningkatkan skor.'}
          </span>
        </div>
      </div>

      {/* ── Financial Profile + Goals ── */}
      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold dark:text-white">Profil Keuangan</h3>
              <Link href="/settings" className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Edit <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Penghasilan Bulanan',  value: formatIDR(profile.monthlyIncome),  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                { label: 'Pengeluaran Estimasi', value: formatIDR(profile.monthlyExpense), color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-900/20' },
                { label: 'Tabungan Saat Ini',    value: formatIDR(profile.currentSavings), color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-900/20' },
                ...(profile.occupation ? [{ label: 'Profesi', value: profile.occupation, color: 'text-gray-800 dark:text-gray-200', bg: 'bg-gray-50 dark:bg-gray-700' }] : []),
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`flex items-center justify-between px-4 py-3 rounded-xl ${bg}`}>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                  <span className={`text-sm font-semibold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold dark:text-white">Tujuan Finansial</h3>
              <Link href="/settings" className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Edit <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {profile.financialGoals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-gray-400 text-sm mb-3">Belum ada tujuan finansial dipilih.</p>
                <Link href="/settings" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">Tambah tujuan →</Link>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.financialGoals.map((goal) => {
                  const g = GOAL_LABELS[goal] ?? { label: goal, icon: '🎯' };
                  return (
                    <span key={goal} className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium border border-blue-100 dark:border-blue-800">
                      {g.icon} {g.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Account Actions ── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <h3 className="text-lg font-semibold dark:text-white mb-1">Keamanan Akun</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Kelola sesi dan keamanan akun Anda</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setPwError(''); setShowPassword(true); }}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
          >
            <KeyRound className="w-4 h-4" /> Ubah Password
          </button>
          <button
            onClick={() => { setDeleteEmail(''); setShowDelete(true); }}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Hapus Akun
          </button>
        </div>
      </div>

      {/* ── Upgrade Modal ── */}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      {/* ── Edit Name Modal ── */}
      {showEditName && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-semibold dark:text-white">Edit Nama</h3>
              </div>
              <button onClick={() => setShowEditName(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditName} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={editNameValue}
                  onChange={e => setEditNameValue(e.target.value)}
                  placeholder="Masukkan nama baru"
                  autoFocus
                  className={inputCls}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditName(false)}
                  className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editNameLoading || !editNameValue.trim()}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {editNameLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Menyimpan…</> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Change Password Modal ── */}
      {showPassword && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-semibold dark:text-white">Ubah Password</h3>
              </div>
              <button onClick={() => setShowPassword(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {pwError && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />{pwError}
                </div>
              )}
              {(['current', 'next', 'confirm'] as const).map((key) => {
                const labels = { current: 'Password Saat Ini', next: 'Password Baru', confirm: 'Konfirmasi Password Baru' };
                const placeholders = { current: 'Masukkan password saat ini', next: 'Minimal 8 karakter', confirm: 'Ulangi password baru' };
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{labels[key]}</label>
                    <div className="relative">
                      <input
                        type={showPw[key] ? 'text' : 'password'}
                        value={pwForm[key]}
                        onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholders[key]}
                        className={`${inputCls} pr-11`}
                      />
                      <button type="button" onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowPassword(false)}
                  className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={pwLoading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Menyimpan…</> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Account Modal ── */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-600" />
                <h3 className="text-base font-semibold dark:text-white">Hapus Akun</h3>
              </div>
              <button onClick={() => setShowDelete(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleDeleteAccount} className="p-6 space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-700 dark:text-red-400">
                  <strong>Peringatan:</strong> Tindakan ini tidak dapat dibatalkan. Seluruh data transaksi, budget, dan profil Anda akan dihapus permanen.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Ketik email Anda untuk konfirmasi
                  <span className="ml-1 text-gray-400 font-normal">({user?.email})</span>
                </label>
                <input
                  type="email"
                  value={deleteEmail}
                  onChange={e => setDeleteEmail(e.target.value)}
                  placeholder={user?.email ?? 'email@anda.com'}
                  className={inputCls}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowDelete(false)}
                  className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={deleteLoading || deleteEmail !== user?.email}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  {deleteLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Menghapus…</> : 'Hapus Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

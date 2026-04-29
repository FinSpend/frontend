'use client'
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, LogOut, User, ChevronDown, Crown, Settings } from 'lucide-react';
import { useData } from '@/app/lib/data-context';
import { logout } from '@/app/services/userService';
import { UpgradeModal } from '@/app/Components/ui/UpgradeModal';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transaksi',
  '/transactions/new': 'Tambah Transaksi',
  '/wallets': 'Dompet & Rekening',
  '/budgeting': 'Budgeting',
  '/categories': 'Kategori',
  '/ai-suggestions': 'Saran AI',
  '/reports': 'Laporan',
  '/onboarding': 'Profil Keuangan',
  '/profile': 'Profil Saya',
  '/settings': 'Pengaturan Profil',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500',
    'bg-rose-500', 'bg-amber-500', 'bg-indigo-500', 'bg-teal-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function TopBar() {
  const { user, clearAll } = useData();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageTitle = PAGE_TITLES[pathname] ?? 'FinSpend';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    if (!confirm('Apakah Anda yakin ingin keluar?')) return;
    try { await logout(); } catch { /* tetap logout */ }
    clearAll();
    router.push('/login');
  };

  const initials = user ? getInitials(user.name) : '?';
  const avatarColor = user ? getAvatarColor(user.name) : 'bg-gray-400';
  const isPremium = user?.plan === 'premium';

  return (
    <>
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{pageTitle}</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shrink-0 ${avatarColor}`}>
              {initials}
            </div>

            {/* Name + Plan */}
            <div className="text-left leading-tight">
              <p className="text-sm text-gray-800 dark:text-gray-200 max-w-30 truncate">
                {user?.name ?? 'Memuat...'}
              </p>
              <p className={`text-xs flex items-center gap-1 ${isPremium ? 'text-amber-500' : 'text-gray-400'}`}>
                {isPremium && <Crown className="w-3 h-3" />}
                {isPremium ? 'Premium' : 'Free'}
              </p>
            </div>

            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${avatarColor}`}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
                {isPremium ? (
                  <div className="mt-2 flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg w-fit">
                    <Crown className="w-3 h-3 text-amber-500" />
                    <span className="text-xs text-amber-600 dark:text-amber-400">Paket Premium</span>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center justify-between px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Paket Free</span>
                    <button
                      onClick={() => { setOpen(false); setShowUpgrade(true); }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Upgrade
                    </button>
                  </div>
                )}
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  onClick={() => { setOpen(false); router.push('/profile'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  Profil Saya
                </button>
                <button
                  onClick={() => { setOpen(false); router.push('/settings'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Pengaturan Profil
                </button>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
  </>
  );
}

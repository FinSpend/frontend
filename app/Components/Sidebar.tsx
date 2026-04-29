"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Receipt,
  Target,
  Sparkles,
  FileText,
  BarChart3,
  Tag,
  Wallet,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Crown,
} from "lucide-react";
import { logout } from "../services/userService";
import { useData } from "@/app/lib/data-context";

const tabs = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transaksi", icon: Receipt },
  { href: "/wallets", label: "Dompet & Rekening", icon: Wallet },
  { href: "/budgeting", label: "Budgeting", icon: Target },
  { href: "/categories", label: "Kategori", icon: Tag },
  { href: "/ai-suggestions", label: "Saran AI", icon: Sparkles },
  { href: "/reports", label: "Laporan", icon: FileText },
  { href: "/onboarding", label: "Profil Keuangan", icon: BarChart3 },
];

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

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { clearAll, user } = useData();

  const isPremium = user?.plan === 'premium';
  const initials = user ? getInitials(user.name) : '?';
  const avatarColor = user ? getAvatarColor(user.name) : 'bg-gray-400';

  const handleLogout = async () => {
    if (!confirm("Apakah Anda yakin ingin keluar?")) return;
    try {
      await logout();
    } catch {
      // tetap logout meski API gagal
    } finally {
      clearAll();
      router.push("/login");
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 z-20">
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5 dark:text-white" />
        </button>
        <Image
          src="/Logo_FinSpend.png"
          alt="FinSpend"
          width={150}
          height={50}
          className="object-contain"
          priority
        />
      </header>

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 fixed left-0 top-0 bottom-0 flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        aria-label="Navigasi utama"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <Image
            src="/Logo_FinSpend.png"
            alt="FinSpend"
            width={150}
            height={50}
            className="object-contain"
            priority
          />
          <button
            onClick={() => setOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                pathname === tab.href || pathname.startsWith(tab.href + "/");
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom section — user info + actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
          {/* User info (desktop) */}
          {user && (
            <div className="hidden md:flex items-center gap-3 px-4 py-3 mb-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shrink-0 ${avatarColor}`}>
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{user.name}</p>
                <p className={`text-xs flex items-center gap-1 ${isPremium ? 'text-amber-500' : 'text-gray-400'}`}>
                  {isPremium && <Crown className="w-3 h-3" />}
                  {isPremium ? 'Premium' : 'Free'}
                </p>
              </div>
            </div>
          )}

          {/* Mobile: dark mode toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="md:hidden w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}

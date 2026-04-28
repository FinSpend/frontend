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
  UserPlus,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { logout } from "../services/userService";

const tabs = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transaksi", icon: Receipt },
  { href: "/budgeting", label: "Budgeting", icon: Target },
  { href: "/ai-suggestions", label: "Saran AI", icon: Sparkles },
  { href: "/reports", label: "Laporan", icon: FileText },
  { href: "/onboarding", label: "Onboarding", icon: UserPlus },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    if (!confirm("Apakah Anda yakin ingin keluar?")) return;
    try {
      await logout();
    } catch {
      // tetap logout meski API gagal
    } finally {
      router.push("/login");
      router.refresh();
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
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
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
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile only: dark mode + logout */}
        <div className="md:hidden p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span className="text-sm">{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

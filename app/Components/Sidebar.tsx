'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Target, Sparkles, FileText, UserPlus, Menu, X } from 'lucide-react';

const tabs = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transaksi', icon: Receipt },
  { href: '/budgeting', label: 'Budgeting', icon: Target },
  { href: '/ai-suggestions', label: 'Saran AI', icon: Sparkles },
  { href: '/reports', label: 'Laporan', icon: FileText },
  { href: '/onboarding', label: 'Onboarding', icon: UserPlus },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-20">
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Image src="/Logo_FinSpend.png" alt="FinSpend" width={150} height={50} className="object-contain" priority />
      </header>

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white border-r border-gray-200 fixed left-0 top-0 bottom-0 flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        aria-label="Navigasi utama"
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Image src="/Logo_FinSpend.png" alt="FinSpend" width={150} height={50} className="object-contain" priority />
          <button
            onClick={() => setOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">FinSpend v1.0</div>
        </div>
      </aside>
    </>
  );
}

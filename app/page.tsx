'use client'
import { useState } from 'react';
import { LayoutDashboard, Receipt, PlusCircle, Target, Sparkles, FileText, UserPlus } from 'lucide-react';
import { Dashboard } from './Components/Dashboard';
import { Transactions } from './Components/Transactions';
import { AddTransaction } from './Components/AddTransaction';
import { Budgeting } from './Components/Budgeting';
import { AISuggestions } from './Components/AISuggestions';
import { Reports } from './Components/Reports';
import { Onboarding } from './Components/Onboarding';

type Tab = 'dashboard' | 'transactions' | 'add-transaction' | 'budgeting' | 'ai-suggestions' | 'reports' | 'onboarding';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions' as Tab, label: 'Transaksi', icon: Receipt },
    { id: 'budgeting' as Tab, label: 'Budgeting', icon: Target },
    { id: 'ai-suggestions' as Tab, label: 'Saran AI', icon: Sparkles },
    { id: 'reports' as Tab, label: 'Laporan', icon: FileText },
    { id: 'onboarding' as Tab, label: 'Onboarding', icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 bottom-0 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl">MoneyWise 💰</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            MoneyWise v1.0
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'transactions' && (
          <Transactions onAddClick={() => setActiveTab('add-transaction')} />
        )}
        {activeTab === 'add-transaction' && (
          <AddTransaction onBack={() => setActiveTab('transactions')} />
        )}
        {activeTab === 'budgeting' && <Budgeting />}
        {activeTab === 'ai-suggestions' && <AISuggestions />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'onboarding' && <Onboarding />}
      </main>
    </div>
  );
}
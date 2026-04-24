'use client'
import { AlertCircle, TrendingUp } from 'lucide-react';
import { formatIDR } from '@/app/lib/format';
import { useData } from '@/app/lib/data-context';

export function Budgeting() {
  const { budgets } = useData();
  const overBudget = budgets.filter(b => b.spent > b.limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl">Budgeting</h2>

      {/* AI Suggestion */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg mb-2">Saran AI untuk Budget Anda</h3>
            <p className="text-sm text-gray-700 mb-3">
              Kategori "Belanja" sudah melebihi budget sebesar 25%. Pertimbangkan untuk mengurangi pembelian
              non-esensial di minggu ini. Anda bisa menghemat hingga Rp 300.000 dengan menunda belanja online.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                Hemat Rp 300.000
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                Prioritas Tinggi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Over Budget Alert */}
      {overBudget.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">
              {overBudget.length} kategori melebihi budget yang ditentukan
            </span>
          </div>
        </div>
      )}

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const pct = Math.round((budget.spent / budget.limit) * 100);
          return (
            <div
              key={budget.id}
              className={`bg-white rounded-lg p-6 shadow-sm border ${
                pct > 100 ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{budget.icon}</span>
                  <div>
                    <h3 className="text-lg">{budget.category}</h3>
                    <p className="text-xs text-gray-500">
                      {formatIDR(budget.spent)} / {formatIDR(budget.limit)}
                    </p>
                  </div>
                </div>
                <div className={`text-right ${pct > 100 ? 'text-red-600' : 'text-gray-700'}`}>
                  <p className="text-2xl">{pct}%</p>
                  {pct > 100 && (
                    <p className="text-xs">+{formatIDR(budget.spent - budget.limit)}</p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    pct > 100 ? 'bg-red-500' : pct > 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>

              {/* Status */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Sisa: {formatIDR(Math.max(0, budget.limit - budget.spent))}
                </span>
                {pct > 100 ? (
                  <span className="text-xs text-red-600">Melebihi budget!</span>
                ) : pct > 80 ? (
                  <span className="text-xs text-yellow-600">Hampir habis</span>
                ) : (
                  <span className="text-xs text-green-600">Aman</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Set Budget Button */}
      <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
        + Tambah Kategori Budget Baru
      </button>
    </div>
  );
}

'use client'
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { TrendingUp, TrendingDown, Wallet, Receipt, Target, ArrowRight } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatIDR, formatIDRSigned } from '@/app/lib/format';
import { Card } from '@/app/Components/ui/Card';
import { useData, CATEGORY_COLORS } from '@/app/lib/data-context';
import type { TrendPoint } from '@/app/types';

type Period = 'this_month' | '3m' | '6m' | 'this_year';

const PERIOD_FILTERS: { key: Period; label: string }[] = [
  { key: 'this_month', label: 'Bulan Ini' },
  { key: '3m', label: '3 Bulan' },
  { key: '6m', label: '6 Bulan' },
  { key: 'this_year', label: 'Tahun Ini' },
];

function getPeriodStart(period: Period): Date {
  const now = new Date();
  switch (period) {
    case 'this_month': return new Date(now.getFullYear(), now.getMonth(), 1);
    case '3m':        return new Date(now.getFullYear(), now.getMonth() - 3, 1);
    case '6m':        return new Date(now.getFullYear(), now.getMonth() - 6, 1);
    case 'this_year': return new Date(now.getFullYear(), 0, 1);
  }
}

const computeTrend = (transactions: { date: string; amount: number }[]): TrendPoint[] => {
  const map: Record<string, { income: number; expense: number }> = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!map[key]) map[key] = { income: 0, expense: 0 };
    if (t.amount > 0) map[key].income += t.amount;
    else map[key].expense += Math.abs(t.amount);
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, val]) => ({
      month: new Date(key + '-01').toLocaleString('id-ID', { month: 'short' }),
      ...val,
    }));
};

function formatTransactionDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

const GOAL_LABELS: Record<string, { label: string; icon: string }> = {
  emergency:  { label: 'Dana Darurat',  icon: '🛡️' },
  house:      { label: 'Beli Rumah',    icon: '🏠' },
  vacation:   { label: 'Liburan',       icon: '✈️' },
  investment: { label: 'Investasi',     icon: '📈' },
  retirement: { label: 'Pensiun',       icon: '🌴' },
  debt:       { label: 'Lunasi Hutang', icon: '💳' },
};

export function Dashboard() {
  const { transactions, budgets, categories, profile } = useData();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [period, setPeriod] = useState<Period>('this_month');
  const periodLabel = PERIOD_FILTERS.find(p => p.key === period)?.label ?? '';

  const periodStart = getPeriodStart(period);
  const filtered = transactions.filter(t => new Date(t.date) >= periodStart);

  const totalIncome  = filtered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const trendData = computeTrend(filtered);
  const recentTransactions = filtered.slice(0, 5);
  const budgetStatus = budgets.slice(0, 3);

  const filteredCategoryData = (() => {
    const grouped = filtered
      .filter(t => t.amount < 0)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>);
    return Object.entries(grouped).map(([name, value]) => {
      const cat = categories.find(c => c.name === name);
      return { name, value, color: cat?.color || CATEGORY_COLORS[name] || '#8b5cf6' };
    });
  })();

  const chartGridColor    = isDark ? '#374151' : '#e5e7eb';
  const chartAxisColor    = isDark ? '#9ca3af' : '#6b7280';
  const chartTooltipStyle = isDark
    ? { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f9fafb', borderRadius: '12px' }
    : { borderRadius: '12px', border: '1px solid #e5e7eb' };

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {PERIOD_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              period === key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Saldo ({periodLabel})
              </p>
              <p className="text-2xl font-semibold mt-1.5 dark:text-white">{formatIDR(balance)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Pemasukan ({periodLabel})
              </p>
              <p className="text-2xl font-semibold mt-1.5 text-green-600 dark:text-green-400">{formatIDR(totalIncome)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Pengeluaran ({periodLabel})
              </p>
              <p className="text-2xl font-semibold mt-1.5 text-red-600 dark:text-red-400">{formatIDR(totalExpense)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="mb-4 font-semibold dark:text-white">Tren Keuangan</h3>
          {trendData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TrendingUp className="w-10 h-10 text-gray-200 dark:text-gray-600 mb-3" />
              <p className="text-sm font-medium text-gray-400 dark:text-gray-500">Data belum cukup</p>
              <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Tambahkan transaksi untuk melihat grafik tren</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240} aria-label="Grafik tren pemasukan dan pengeluaran per bulan">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis dataKey="month" tick={{ fill: chartAxisColor, fontSize: 12 }} axisLine={{ stroke: chartGridColor }} tickLine={false} />
                <YAxis tick={{ fill: chartAxisColor, fontSize: 11 }} axisLine={{ stroke: chartGridColor }} tickLine={false} width={70} tickFormatter={(v) => `${(v/1e6).toFixed(1)}jt`} />
                <Tooltip
                  formatter={(value) => formatIDR(Number(value))}
                  contentStyle={chartTooltipStyle}
                />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }} name="Pemasukan" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 4, strokeWidth: 0 }} name="Pengeluaran" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold dark:text-white">Kategori Pengeluaran</h3>
          {filteredCategoryData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TrendingDown className="w-10 h-10 text-gray-200 dark:text-gray-600 mb-3" />
              <p className="text-sm font-medium text-gray-400 dark:text-gray-500">Belum ada data kategori</p>
              <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Tambahkan transaksi pengeluaran</p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="45%" height={200} aria-label="Grafik donat kategori pengeluaran">
                <PieChart>
                  <Pie
                    data={filteredCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {filteredCategoryData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatIDR(Number(value))}
                    contentStyle={chartTooltipStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5 flex-1 min-w-0">
                {filteredCategoryData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-sm dark:text-gray-300 truncate">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium dark:text-gray-300 shrink-0">{formatIDR(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Transactions & Budget Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold dark:text-white">Transaksi Terbaru</h3>
            <a href="/transactions" className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-1">
            {recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Receipt className="w-10 h-10 text-gray-200 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-400 dark:text-gray-500">Belum ada transaksi</p>
                <a href="/transactions/new" className="text-xs text-blue-500 hover:underline mt-1">
                  Tambah transaksi pertama
                </a>
              </div>
            ) : recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    transaction.amount > 0
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {transaction.amount > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium dark:text-gray-200 truncate">{transaction.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className={`text-sm font-semibold ${transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatIDRSigned(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{formatTransactionDate(transaction.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold dark:text-white">Status Budget</h3>
            <a href="/budgeting" className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-4">
            {budgetStatus.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Target className="w-10 h-10 text-gray-200 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-400 dark:text-gray-500">Belum ada budget</p>
                <a href="/budgeting" className="text-xs text-blue-500 hover:underline mt-1">
                  Buat budget pertama
                </a>
              </div>
            ) : budgetStatus.map((budget) => {
              const pct = Math.round((budget.spent / budget.limit) * 100);
              return (
                <div key={budget.category}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium dark:text-gray-300">{budget.category}</span>
                    <span className={`text-sm font-semibold ${pct > 100 ? 'text-red-600 dark:text-red-400' : pct > 80 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${pct > 100 ? 'bg-red-500' : pct > 80 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{formatIDR(budget.spent)}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{formatIDR(budget.limit)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Profil Keuangan dari Onboarding */}
      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="mb-4 font-semibold dark:text-white">Profil Keuangan</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Pemasukan Bulanan (Target)</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{formatIDR(profile.monthlyIncome)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Pengeluaran Bulanan (Estimasi)</span>
                <span className="font-semibold text-red-500 dark:text-red-400">{formatIDR(profile.monthlyExpense)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Tabungan Saat Ini</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{formatIDR(profile.currentSavings)}</span>
              </div>
              {profile.occupation && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Profesi</span>
                  <span className="font-medium dark:text-gray-200">{profile.occupation}</span>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 font-semibold dark:text-white">Tujuan Finansial</h3>
            {profile.financialGoals.length === 0 ? (
              <p className="text-sm text-gray-400">Belum ada tujuan finansial dipilih.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.financialGoals.map((goal) => {
                  const g = GOAL_LABELS[goal] ?? { label: goal, icon: '🎯' };
                  return (
                    <span key={goal} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {g.icon} {g.label}
                    </span>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

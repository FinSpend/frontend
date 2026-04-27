'use client'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatIDR, formatIDRSigned } from '@/app/lib/format';
import { Card } from '@/app/Components/ui/Card';
import { useData } from '@/app/lib/data-context';
import type { TrendPoint } from '@/app/types';

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

const GOAL_LABELS: Record<string, { label: string; icon: string }> = {
  emergency:  { label: 'Dana Darurat',  icon: '🛡️' },
  house:      { label: 'Beli Rumah',    icon: '🏠' },
  vacation:   { label: 'Liburan',       icon: '✈️' },
  investment: { label: 'Investasi',     icon: '📈' },
  retirement: { label: 'Pensiun',       icon: '🌴' },
  debt:       { label: 'Lunasi Hutang', icon: '💳' },
};

export function Dashboard() {
  const { transactions, budgets, categoryData, profile } = useData();
  const trendData = computeTrend(transactions);

  const recentTransactions = transactions.slice(0, 5);
  const budgetStatus = budgets.slice(0, 3);

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Saldo</p>
              <p className="text-2xl mt-1">{formatIDR(balance)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pemasukan Bulan Ini</p>
              <p className="text-2xl mt-1 text-green-600">{formatIDR(totalIncome)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pengeluaran Bulan Ini</p>
              <p className="text-2xl mt-1 text-red-600">{formatIDR(totalExpense)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="mb-4">Tren Keuangan</h3>
          <ResponsiveContainer width="100%" height={250} aria-label="Grafik tren pemasukan dan pengeluaran per bulan">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatIDR(Number(value))} />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4">Kategori Pengeluaran</h3>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="50%" height={250} aria-label="Grafik donat kategori pengeluaran">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatIDR(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm">{formatIDR(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions & Budget Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="mb-4">Transaksi Terbaru</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {transaction.amount > 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{transaction.name}</p>
                    <p className="text-xs text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatIDRSigned(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4">Status Budget</h3>
          <div className="space-y-4">
            {budgetStatus.map((budget) => {
              const pct = Math.round((budget.spent / budget.limit) * 100);
              return (
                <div key={budget.category}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">{budget.category}</span>
                    <span className={`text-sm ${pct > 100 ? 'text-red-600' : 'text-gray-600'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${pct > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{formatIDR(budget.spent)}</span>
                    <span className="text-xs text-gray-500">{formatIDR(budget.limit)}</span>
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
            <h3 className="mb-4">Profil Keuangan</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pemasukan Bulanan (Target)</span>
                <span className="text-green-600">{formatIDR(profile.monthlyIncome)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pengeluaran Bulanan (Estimasi)</span>
                <span className="text-red-500">{formatIDR(profile.monthlyExpense)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tabungan Saat Ini</span>
                <span className="text-blue-600">{formatIDR(profile.currentSavings)}</span>
              </div>
              {profile.occupation && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Profesi</span>
                  <span>{profile.occupation}</span>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="mb-4">Tujuan Finansial</h3>
            {profile.financialGoals.length === 0 ? (
              <p className="text-sm text-gray-400">Belum ada tujuan finansial dipilih.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.financialGoals.map((goal) => {
                  const g = GOAL_LABELS[goal] ?? { label: goal, icon: '🎯' };
                  return (
                    <span key={goal} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
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

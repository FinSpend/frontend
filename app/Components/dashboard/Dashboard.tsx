'use client'
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const trendData = [
  { month: 'Jan', income: 4500000, expense: 3200000 },
  { month: 'Feb', income: 5200000, expense: 3800000 },
  { month: 'Mar', income: 4800000, expense: 4100000 },
  { month: 'Apr', income: 6000000, expense: 3500000 },
];

const categoryData = [
  { name: 'Makanan', value: 1200000, color: '#3b82f6' },
  { name: 'Transport', value: 800000, color: '#10b981' },
  { name: 'Belanja', value: 1500000, color: '#f59e0b' },
  { name: 'Hiburan', value: 600000, color: '#ef4444' },
  { name: 'Lainnya', value: 400000, color: '#8b5cf6' },
];

const recentTransactions = [
  { id: 1, name: 'Alfamart', category: 'Makanan', amount: -45000, date: '24 Apr 2026' },
  { id: 2, name: 'Gaji Bulanan', category: 'Pemasukan', amount: 6000000, date: '24 Apr 2026' },
  { id: 3, name: 'Grab', category: 'Transport', amount: -35000, date: '23 Apr 2026' },
  { id: 4, name: 'Netflix', category: 'Hiburan', amount: -186000, date: '23 Apr 2026' },
  { id: 5, name: 'Tokopedia', category: 'Belanja', amount: -250000, date: '22 Apr 2026' },
];

const budgetStatus = [
  { category: 'Makanan', spent: 1200000, limit: 1500000, percentage: 80 },
  { category: 'Transport', spent: 800000, limit: 1000000, percentage: 80 },
  { category: 'Belanja', spent: 1500000, limit: 1200000, percentage: 125 },
];

export function Dashboard() {
  const totalIncome = 6000000;
  const totalExpense = 3500000;
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Saldo</p>
              <p className="text-2xl mt-1">Rp {balance.toLocaleString('id-ID')}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pemasukan Bulan Ini</p>
              <p className="text-2xl mt-1 text-green-600">Rp {totalIncome.toLocaleString('id-ID')}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pengeluaran Bulan Ini</p>
              <p className="text-2xl mt-1 text-red-600">Rp {totalExpense.toLocaleString('id-ID')}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="mb-4">Tren Keuangan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString('id-ID')}`} />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="mb-4">Kategori Pengeluaran</h3>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="50%" height={250}>
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
                <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString('id-ID')}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm">Rp {item.value.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions & Budget Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
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
                    {transaction.amount > 0 ? '+' : ''}Rp {Math.abs(transaction.amount).toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Status */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="mb-4">Status Budget</h3>
          <div className="space-y-4">
            {budgetStatus.map((budget) => (
              <div key={budget.category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">{budget.category}</span>
                  <span className={`text-sm ${budget.percentage > 100 ? 'text-red-600' : 'text-gray-600'}`}>
                    {budget.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${budget.percentage > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Rp {budget.spent.toLocaleString('id-ID')}</span>
                  <span className="text-xs text-gray-500">Rp {budget.limit.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

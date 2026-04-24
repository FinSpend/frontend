import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';

const transactions = [
  { id: 1, date: '2026-04-24', name: 'Alfamart', category: 'Makanan', amount: -45000 },
  { id: 2, date: '2026-04-24', name: 'Gaji Bulanan', category: 'Pemasukan', amount: 6000000 },
  { id: 3, date: '2026-04-23', name: 'Grab', category: 'Transport', amount: -35000 },
  { id: 4, date: '2026-04-23', name: 'Netflix', category: 'Hiburan', amount: -186000 },
  { id: 5, date: '2026-04-22', name: 'Tokopedia', category: 'Belanja', amount: -250000 },
  { id: 6, date: '2026-04-22', name: 'Indomaret', category: 'Makanan', amount: -65000 },
  { id: 7, date: '2026-04-21', name: 'Gojek', category: 'Transport', amount: -42000 },
  { id: 8, date: '2026-04-21', name: 'Shopee', category: 'Belanja', amount: -180000 },
];

const categories = ['Semua', 'Makanan', 'Transport', 'Belanja', 'Hiburan', 'Pemasukan'];

interface TransactionsProps {
  onAddClick: () => void;
}

export function Transactions({ onAddClick }: TransactionsProps) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const filteredTransactions = selectedCategory === 'Semua'
    ? transactions
    : transactions.filter(t => t.category === selectedCategory);

  const groupedByDate = filteredTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, typeof transactions>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Transaksi</h2>
        <button
          onClick={onAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Transaksi
        </button>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-sm">Filter Kategori</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-6">
        {Object.entries(groupedByDate).map(([date, dateTransactions]) => (
          <div key={date}>
            <h3 className="text-sm text-gray-500 mb-3">{date}</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
              {dateTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm">{transaction.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{transaction.category}</p>
                  </div>
                  <p className={`text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}Rp {Math.abs(transaction.amount).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

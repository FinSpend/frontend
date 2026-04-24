'use client'
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Filter } from 'lucide-react';
import { formatIDRSigned } from '@/app/lib/format';
import { Card } from '@/app/Components/ui/Card';
import { useData } from '@/app/lib/data-context';
import type { Transaction, TransactionCategory } from '@/app/types';

const categories: ('Semua' | TransactionCategory)[] = ['Semua', 'Makanan', 'Transport', 'Belanja', 'Hiburan', 'Pemasukan'];

export function Transactions() {
  const { transactions } = useData();
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const filtered = selectedCategory === 'Semua'
    ? transactions
    : transactions.filter(t => t.category === selectedCategory);

  const groupedByDate = filtered.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Transaksi</h2>
        <Link
          href="/transactions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Transaksi
        </Link>
      </div>

      {/* Category Filter */}
      <Card className="p-4!">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-sm">Filter Kategori</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
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
      </Card>

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
                    {formatIDRSigned(transaction.amount)}
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

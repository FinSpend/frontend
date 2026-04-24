'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Transaction, Budget, CategoryStat } from '@/app/types';

const CATEGORY_COLORS: Record<string, string> = {
  Makanan: '#3b82f6',
  Transport: '#10b981',
  Belanja: '#f59e0b',
  Hiburan: '#ef4444',
  Lainnya: '#8b5cf6',
};

const initialTransactions: Transaction[] = [
  { id: 1, date: '2026-04-24', name: 'Alfamart', category: 'Makanan', amount: -45000 },
  { id: 2, date: '2026-04-24', name: 'Gaji Bulanan', category: 'Pemasukan', amount: 6000000 },
  { id: 3, date: '2026-04-23', name: 'Grab', category: 'Transport', amount: -35000 },
  { id: 4, date: '2026-04-23', name: 'Netflix', category: 'Hiburan', amount: -186000 },
  { id: 5, date: '2026-04-22', name: 'Tokopedia', category: 'Belanja', amount: -250000 },
  { id: 6, date: '2026-04-22', name: 'Indomaret', category: 'Makanan', amount: -65000 },
  { id: 7, date: '2026-04-21', name: 'Gojek', category: 'Transport', amount: -42000 },
  { id: 8, date: '2026-04-21', name: 'Shopee', category: 'Belanja', amount: -180000 },
];

const initialBudgets: Budget[] = [
  { id: 1, category: 'Makanan', spent: 1200000, limit: 1500000, icon: '🍔' },
  { id: 2, category: 'Transport', spent: 800000, limit: 1000000, icon: '🚗' },
  { id: 3, category: 'Belanja', spent: 1500000, limit: 1200000, icon: '🛍️' },
  { id: 4, category: 'Hiburan', spent: 600000, limit: 800000, icon: '🎬' },
  { id: 5, category: 'Tagihan', spent: 450000, limit: 500000, icon: '💳' },
  { id: 6, category: 'Kesehatan', spent: 200000, limit: 500000, icon: '🏥' },
];

const initialCategoryData: CategoryStat[] = [
  { name: 'Makanan', value: 1200000, color: '#3b82f6' },
  { name: 'Transport', value: 800000, color: '#10b981' },
  { name: 'Belanja', value: 1500000, color: '#f59e0b' },
  { name: 'Hiburan', value: 600000, color: '#ef4444' },
  { name: 'Lainnya', value: 400000, color: '#8b5cf6' },
];

interface DataContextValue {
  transactions: Transaction[];
  budgets: Budget[];
  categoryData: CategoryStat[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [categoryData] = useState<CategoryStat[]>(initialCategoryData);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    const newId = Math.max(...transactions.map((tx) => tx.id)) + 1;
    setTransactions((prev) => [{ ...t, id: newId }, ...prev]);

    // Update budget spent if it's an expense with a matching category
    if (t.amount < 0) {
      setBudgets((prev) =>
        prev.map((b) =>
          b.category === t.category
            ? { ...b, spent: b.spent + Math.abs(t.amount) }
            : b
        )
      );
    }
  }, [transactions]);

  return (
    <DataContext.Provider value={{ transactions, budgets, categoryData, addTransaction }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

export { CATEGORY_COLORS };

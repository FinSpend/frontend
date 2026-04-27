'use client'
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { Transaction, Budget, CategoryStat, Category, UserProfile } from '@/app/types';
import api from '@/app/services/api';

const CATEGORY_COLORS: Record<string, string> = {
  'Makan & minum': '#3b82f6',
  'Transport': '#10b981',
  'Belanja': '#f59e0b',
  'Hiburan': '#ef4444',
  'Tagihan': '#888780',
  'Kesehatan': '#D4537E',
  'Pendidikan': '#378ADD',
  'Gaji': '#1D9E75',
  'Freelance': '#378ADD',
  'Investasi': '#639922',
  'Lainnya': '#8b5cf6',
};

interface RawTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: string | number;
  description?: string;
  transactionDate?: string;
  category?: { name?: string; color?: string; icon?: string };
}

interface RawBudget {
  id: string;
  limitAmount: string | number;
  spent: number;
  category?: { name?: string; icon?: string };
}

const mapTransaction = (t: RawTransaction): Transaction => ({
  id: t.id,
  date: (t.transactionDate || '').split('T')[0],
  name: t.description || '',
  category: t.category?.name || '',
  amount: t.type === 'expense' ? -Number(t.amount) : Number(t.amount),
});

const mapBudget = (b: RawBudget): Budget => ({
  id: b.id,
  category: b.category?.name || '',
  spent: b.spent,
  limit: Number(b.limitAmount),
  icon: b.category?.icon || '💰',
});

const computeCategoryData = (transactions: Transaction[], categories: Category[]): CategoryStat[] => {
  const grouped = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  return Object.entries(grouped).map(([name, value]) => {
    const cat = categories.find(c => c.name === name);
    return { name, value, color: cat?.color || CATEGORY_COLORS[name] || '#8b5cf6' };
  });
};

interface DataContextValue {
  transactions: Transaction[];
  budgets: Budget[];
  categoryData: CategoryStat[];
  categories: Category[];
  profile: UserProfile | null;
  isLoading: boolean;
  addTransaction: (t: { name: string; amount: number; category: string; date: string }) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  createBudget: (data: { categoryId: string; limitAmount: number; period: string; startDate: string }) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  refetch: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const categoryData = computeCategoryData(transactions, categories);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [txRes, budgetRes, catRes, profileRes] = await Promise.all([
          api.get('/api/transactions'),
          api.get('/api/budgets'),
          api.get('/api/categories'),
          api.get('/api/profile'),
        ]);
        if (cancelled) return;
        setTransactions((txRes.data.data as RawTransaction[] || []).map(mapTransaction));
        setBudgets((budgetRes.data.data as RawBudget[] || []).map(mapBudget));
        setCategories((catRes.data.data as Category[]) || []);
        setProfile((profileRes.data.data as UserProfile) || null);
      } catch {
        // user belum login atau tidak ada data
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const refetch = useCallback(() => setRefreshKey(k => k + 1), []);

  const addTransaction = useCallback(async (t: { name: string; amount: number; category: string; date: string }) => {
    const cat = categories.find(c => c.name === t.category);
    if (!cat) throw new Error('Kategori tidak ditemukan');

    await api.post('/api/transactions', {
      categoryId: cat.id,
      type: t.amount < 0 ? 'expense' : 'income',
      amount: Math.abs(t.amount),
      description: t.name,
      transactionDate: t.date,
    });

    setRefreshKey(k => k + 1);
  }, [categories]);

  const deleteTransaction = useCallback(async (id: string) => {
    await api.delete(`/api/transactions/${id}`);
    setRefreshKey(k => k + 1);
  }, []);

  const createBudget = useCallback(async (data: { categoryId: string; limitAmount: number; period: string; startDate: string }) => {
    await api.post('/api/budgets', data);
    setRefreshKey(k => k + 1);
  }, []);

  const deleteBudget = useCallback(async (id: string) => {
    await api.delete(`/api/budgets/${id}`);
    setRefreshKey(k => k + 1);
  }, []);

  return (
    <DataContext.Provider value={{ transactions, budgets, categoryData, categories, profile, isLoading, addTransaction, deleteTransaction, createBudget, deleteBudget, refetch }}>
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

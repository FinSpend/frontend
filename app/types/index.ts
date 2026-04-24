export type TransactionCategory =
  | 'Makanan'
  | 'Transport'
  | 'Belanja'
  | 'Hiburan'
  | 'Pemasukan'
  | 'Tagihan'
  | 'Kesehatan'
  | 'Lainnya';

export interface Transaction {
  id: number;
  /** ISO date string, e.g. '2026-04-24' */
  date: string;
  name: string;
  category: TransactionCategory;
  /** Positive = income, negative = expense */
  amount: number;
}

export interface Budget {
  id: number;
  category: TransactionCategory;
  spent: number;
  limit: number;
  icon: string;
}

export interface CategoryStat {
  name: TransactionCategory;
  value: number;
  color: string;
}

export interface TrendPoint {
  month: string;
  income: number;
  expense: number;
}

export type FinancialGoalId =
  | 'emergency'
  | 'house'
  | 'vacation'
  | 'investment'
  | 'retirement'
  | 'debt';

export interface FinancialGoal {
  id: FinancialGoalId;
  title: string;
  icon: string;
  description: string;
}

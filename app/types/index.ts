// ─── Transaction ───────────────────────────────────────────────
export type TransactionCategory =
  | 'Makanan'
  | 'Transport'
  | 'Belanja'
  | 'Hiburan'
  | 'Tagihan'
  | 'Kesehatan'
  | 'Lainnya'
  | 'Pemasukan';

export interface Transaction {
  id: number;
  date: string;
  name: string;
  category: TransactionCategory;
  amount: number;
}

export interface Budget {
  id: number;
  category: string;
  spent: number;
  limit: number;
  icon: string;
}

export interface CategoryStat {
  name: string;
  value: number;
  color: string;
}

export interface TrendPoint {
  month: string;
  income: number;
  expense: number;
}

// ─── Auth ──────────────────────────────────────────────────────
export type UserPlan = 'free' | 'premium';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
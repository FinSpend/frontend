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
  id: string;
  date: string;
  name: string;
  category: string;
  amount: number;
  walletId?: string | null;
  walletName?: string | null;
  walletColor?: string | null;
}

export interface Wallet {
  id: string;
  name: string;
  type: string;
  bankCode: string | null;
  color: string | null;
  icon: string | null;
  initialBalance: number;
  isDefault: boolean;
  balance: number;
  createdAt: string;
}

export interface Transfer {
  id: string;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  note: string | null;
  transferDate: string;
  createdAt: string;
  fromWallet: { id: string; name: string; color: string | null };
  toWallet:   { id: string; name: string; color: string | null };
}

export interface Budget {
  id: string;
  category: string;
  spent: number;
  limit: number;
  icon: string;
  period: string;
  startDate: string;
}

export interface Category {
  id: string;
  name: string;
  type: string;
  color: string;
  icon: string;
}

export interface UserProfile {
  monthlyIncome: number;
  monthlyExpense: number;
  currentSavings: number;
  incomeCurrency: string;
  occupation: string | null;
  financialGoals: string[];
  riskProfile: string | null;
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

export interface AiSuggestion {
  id: string;
  type: string;
  content: string;
  metadata: {
    income?: number;
    expense?: number;
    expenseByCategory?: Record<string, number>;
  } | null;
  isRead: boolean;
  isApplied: boolean;
  createdAt: string;
}

export interface ReportSummary {
  income: number;
  expense: number;
  balance: number;
  transactionCount: number;
  savingsRate: number;
  expenseByCategory: Record<string, number>;
  incomeByCategory: Record<string, number>;
}

export interface Report {
  id: string;
  periodType: string;
  periodStart: string;
  periodEnd: string;
  summaryData: ReportSummary;
  fileUrl: string | null;
  status: string;
  generatedAt: string;
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
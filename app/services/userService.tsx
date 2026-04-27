import api from "./api";

// Auth
export const register = (data: { name: string; email: string; password: string }) =>
  api.post("/auth/register", data);
export const login = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
export const getMe = () => api.get("/auth/me");

// Profile
export const fetchProfile = () => api.get("/api/profile");
export const upsertProfile = (data: {
  monthlyIncome: number;
  monthlyExpense: number;
  currentSavings: number;
  incomeCurrency: string;
  occupation: string;
  financialGoals: string[];
}) => api.put("/api/profile", data);

// Transactions
export const deleteTransaction = (id: string) => api.delete(`/api/transactions/${id}`);
export const updateTransaction = (id: string, data: object) =>
  api.put(`/api/transactions/${id}`, data);

// Budgets
export const createBudget = (data: {
  categoryId: string;
  limitAmount: number;
  period: string;
  startDate: string;
}) => api.post("/api/budgets", data);
export const deleteBudget = (id: string) => api.delete(`/api/budgets/${id}`);
export const updateBudget = (id: string, data: object) =>
  api.put(`/api/budgets/${id}`, data);

// AI
export const generateAISuggestion = () => api.post("/api/ai/suggest");
export const getAISuggestions = () => api.get("/api/ai/suggestions");
export const updateAISuggestion = (id: string, data: { isRead?: boolean; isApplied?: boolean }) =>
  api.patch(`/api/ai/suggestions/${id}`, data);

// Reports
export const getReports = () => api.get("/api/reports");
export const createReport = (data: {
  periodType: string;
  periodStart: string;
  periodEnd: string;
}) => api.post("/api/reports", data);

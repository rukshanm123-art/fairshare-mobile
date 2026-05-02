import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001'

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: import('./types').User }>('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post<{ token: string; user: import('./types').User }>('/auth/register', { name, email, password }),
  me: () => api.get<import('./types').User>('/auth/me'),
}

// Group endpoints
export const groupsApi = {
  list: () => api.get<import('./types').Group[]>('/groups'),
  get: (id: string) => api.get<import('./types').Group>(`/groups/${id}`),
  create: (name: string, emoji: string) => api.post<import('./types').Group>('/groups', { name, emoji }),
  addMember: (groupId: string, email: string) =>
    api.post(`/groups/${groupId}/members`, { email }),
  removeMember: (groupId: string, userId: string) =>
    api.delete(`/groups/${groupId}/members/${userId}`),
}

// Expense endpoints
export const expensesApi = {
  list: (params?: { groupId?: string; category?: string }) =>
    api.get<import('./types').Expense[]>('/expenses', { params }),
  create: (data: {
    description: string
    amount: number
    currency: string
    category: string
    date: string
    groupId: string
    splitType: string
    splits?: { userId: string; amount: number }[]
  }) => api.post<import('./types').Expense>('/expenses', data),
  update: (id: string, data: Partial<{ description: string; amount: number; category: string }>) =>
    api.put<import('./types').Expense>(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
}

// Settlement endpoints
export const settlementsApi = {
  suggestions: (groupId?: string) =>
    api.get<import('./types').SettlementSuggestion[]>('/settlements', {
      params: { groupId, mode: 'optimal' },
    }),
  settle: (id: string) => api.post(`/settlements/${id}/settle`),
  history: () => api.get<import('./types').Settlement[]>('/settlements/history'),
}

// Analytics endpoints
export const analyticsApi = {
  summary: () => api.get<import('./types').DashboardSummary>('/analytics/summary'),
  monthly: (groupId?: string) =>
    api.get<import('./types').MonthlyData[]>('/analytics/monthly', { params: { groupId } }),
  categories: (groupId?: string) =>
    api.get<import('./types').CategoryData[]>('/analytics/categories', { params: { groupId } }),
}

import { create } from 'zustand'
import { expensesApi } from '../api'
import type { Expense } from '../types'

interface ExpenseState {
  expenses: Expense[]
  loading: boolean
  fetchExpenses: (groupId?: string) => Promise<void>
  createExpense: (data: {
    description: string
    amount: number
    currency: string
    category: string
    date: string
    groupId: string
    splitType: string
    splits?: { userId: string; amount: number }[]
  }) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  loading: false,

  fetchExpenses: async (groupId) => {
    set({ loading: true })
    try {
      const { data } = await expensesApi.list(groupId ? { groupId } : undefined)
      set({ expenses: data })
    } finally {
      set({ loading: false })
    }
  },

  createExpense: async (data) => {
    const { data: expense } = await expensesApi.create(data)
    set((s) => ({ expenses: [expense, ...s.expenses] }))
  },

  deleteExpense: async (id) => {
    await expensesApi.delete(id)
    set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) }))
  },
}))

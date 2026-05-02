export interface User {
  id: string
  name: string
  email: string
}

export interface GroupMember {
  userId: string
  groupId: string
  user: User
}

export interface Group {
  id: string
  name: string
  emoji: string
  members: GroupMember[]
  _count?: { expenses: number }
}

export interface ExpenseSplit {
  id: string
  userId: string
  amount: number
  user: User
}

export interface Expense {
  id: string
  description: string
  amount: number
  currency: string
  category: string
  date: string
  groupId: string
  paidById: string
  splitType: 'equal' | 'exact' | 'percentage' | 'shares'
  receiptUrl?: string | null
  paidBy: User
  splits: ExpenseSplit[]
  group?: Group
}

export interface Settlement {
  id: string
  fromUserId: string
  toUserId: string
  amount: number
  groupId: string
  isPaid: boolean
  createdAt: string
  from: User
  to: User
  group: Group
}

export interface SettlementSuggestion {
  from: User
  to: User
  amount: number
  groupId: string
  group: Group
}

export interface Balance {
  userId: string
  name: string
  net: number
}

export interface DashboardSummary {
  totalExpenses: number
  settledCount: number
  groupCount: number
  netBalance: number
}

export interface MonthlyData {
  month: string
  total: number
}

export interface CategoryData {
  category: string
  total: number
}

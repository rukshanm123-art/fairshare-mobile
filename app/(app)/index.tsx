import { useEffect, useState } from 'react'
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { useAuthStore } from '@/lib/stores/authStore'
import { useExpenseStore } from '@/lib/stores/expenseStore'
import { useGroupStore } from '@/lib/stores/groupStore'
import { analyticsApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { ExpenseCard } from '@/components/ExpenseCard'
import type { DashboardSummary } from '@/lib/types'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { expenses, fetchExpenses, loading: expLoading } = useExpenseStore()
  const { groups, fetchGroups } = useGroupStore()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  async function load() {
    await Promise.all([
      fetchExpenses(),
      fetchGroups(),
      analyticsApi.summary().then((r) => setSummary(r.data)).catch(() => {}),
    ])
  }

  useEffect(() => { load() }, [])

  async function onRefresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const netBalance = summary?.netBalance ?? 0
  const recentExpenses = expenses.slice(0, 5)

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ADE80" />}
    >
      {/* Header */}
      <View className="px-5 pt-16 pb-6">
        <Text className="text-muted text-sm">{greeting} 👋</Text>
        <Text className="text-white text-2xl font-bold mt-0.5">{user?.name?.split(' ')[0]}</Text>
      </View>

      {/* Net balance card */}
      <View className="px-5 mb-6">
        <Card className="p-5">
          <Text className="text-muted text-xs font-medium uppercase tracking-wider mb-2">Your Net Balance</Text>
          <Text
            className={`text-4xl font-bold ${netBalance >= 0 ? 'text-brand' : 'text-red-400'}`}
          >
            {netBalance >= 0 ? '+' : ''}{netBalance.toFixed(2)}
          </Text>
          <Text className="text-muted text-xs mt-1">
            {netBalance > 0 ? "You're owed money" : netBalance < 0 ? "You owe money" : "All settled up ✓"}
          </Text>
        </Card>
      </View>

      {/* Stats row */}
      <View className="px-5 flex-row gap-3 mb-6">
        <Card className="flex-1 p-4">
          <Text className="text-muted text-xs mb-1">Groups</Text>
          <Text className="text-white text-2xl font-bold">{groups.length}</Text>
        </Card>
        <Card className="flex-1 p-4">
          <Text className="text-muted text-xs mb-1">Expenses</Text>
          <Text className="text-white text-2xl font-bold">{summary?.totalExpenses ?? expenses.length}</Text>
        </Card>
        <Card className="flex-1 p-4">
          <Text className="text-muted text-xs mb-1">Settled</Text>
          <Text className="text-brand text-2xl font-bold">{summary?.settledCount ?? 0}</Text>
        </Card>
      </View>

      {/* Quick actions */}
      <View className="px-5 mb-6">
        <Text className="text-white font-semibold text-base mb-3">Quick Actions</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.push('/groups')}
            className="flex-1 bg-brand rounded-2xl p-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-2xl mb-1">👥</Text>
            <Text className="text-black font-semibold text-sm">Groups</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/settle')}
            className="flex-1 bg-bg-card border border-bg-border rounded-2xl p-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-2xl mb-1">💳</Text>
            <Text className="text-white font-semibold text-sm">Settle Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/analytics')}
            className="flex-1 bg-bg-card border border-bg-border rounded-2xl p-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-2xl mb-1">📊</Text>
            <Text className="text-white font-semibold text-sm">Analytics</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent expenses — skeleton while loading, list when loaded */}
      <View className="px-5">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white font-semibold text-base">Recent Expenses</Text>
          <TouchableOpacity onPress={() => router.push('/groups')}>
            <Text className="text-brand text-sm">See all →</Text>
          </TouchableOpacity>
        </View>

        {expLoading && expenses.length === 0 && (
          [1, 2, 3].map((i) => (
            <View key={i} className="h-20 bg-bg-card rounded-2xl mb-3 opacity-40" />
          ))
        )}

        {!expLoading && recentExpenses.length === 0 && (
          <View className="items-center py-8">
            <Text className="text-4xl mb-3">🧾</Text>
            <Text className="text-muted text-sm text-center">No expenses yet. Add a group and start splitting!</Text>
          </View>
        )}

        {recentExpenses.map((exp) => (
          <ExpenseCard key={exp.id} expense={exp} currentUserId={user?.id} />
        ))}
      </View>
    </ScrollView>
  )
}

import { useEffect, useState } from 'react'
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Dimensions } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { analyticsApi } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import type { MonthlyData, CategoryData } from '@/lib/types'

const CATEGORY_COLORS: Record<string, string> = {
  food: '#4ADE80', transport: '#60A5FA', entertainment: '#C084FC',
  accommodation: '#FB923C', utilities: '#FBBF24', shopping: '#F472B6',
  health: '#34D399', travel: '#38BDF8', other: '#94A3B8',
}

const { width } = Dimensions.get('window')

export default function Analytics() {
  const [monthly, setMonthly] = useState<MonthlyData[]>([])
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function load() {
    try {
      const [m, c] = await Promise.all([
        analyticsApi.monthly().then((r) => r.data),
        analyticsApi.categories().then((r) => r.data),
      ])
      setMonthly(m)
      setCategories(c)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function onRefresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  const totalSpend = categories.reduce((a, c) => a + Number(c.total), 0)

  const barData = monthly.slice(-6).map((m) => ({
    value: Number(m.total),
    label: m.month.slice(0, 3),
    frontColor: '#4ADE80',
    topLabelComponent: () => (
      <Text style={{ color: '#737373', fontSize: 9, marginBottom: 2 }}>
        {Number(m.total) > 0 ? `$${Number(m.total).toFixed(0)}` : ''}
      </Text>
    ),
  }))

  return (
    <View className="flex-1 bg-bg">
      <View className="px-5 pt-16 pb-4">
        <Text className="text-white text-2xl font-bold">Analytics</Text>
        <Text className="text-muted text-sm">Spending insights across all groups</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#4ADE80" size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ADE80" />}
        >
          {/* Total */}
          <Card className="mb-5 p-5">
            <Text className="text-muted text-xs uppercase tracking-wider mb-1">Total Tracked</Text>
            <Text className="text-white text-3xl font-bold">${totalSpend.toFixed(2)}</Text>
          </Card>

          {/* Monthly bar chart */}
          {barData.length > 0 && (
            <Card className="mb-5 p-5">
              <Text className="text-white font-semibold text-sm mb-4">Monthly Spending (Last 6 months)</Text>
              <BarChart
                data={barData}
                barWidth={32}
                spacing={12}
                roundedTop
                hideRules
                xAxisThickness={0}
                yAxisThickness={0}
                yAxisTextStyle={{ color: '#525252', fontSize: 10 }}
                xAxisLabelTextStyle={{ color: '#737373', fontSize: 10 }}
                noOfSections={4}
                maxValue={Math.max(...barData.map((d) => d.value), 10) * 1.2}
                width={width - 100}
                height={160}
                barBorderRadius={4}
              />
            </Card>
          )}

          {/* Category breakdown */}
          {categories.length > 0 && (
            <Card className="mb-5 p-5">
              <Text className="text-white font-semibold text-sm mb-4">By Category</Text>
              {categories.map((cat) => {
                const pct = totalSpend > 0 ? (Number(cat.total) / totalSpend) * 100 : 0
                const color = CATEGORY_COLORS[cat.category?.toLowerCase()] ?? '#94A3B8'
                return (
                  <View key={cat.category} className="mb-4">
                    <View className="flex-row justify-between mb-1.5">
                      <Text className="text-white text-sm capitalize">{cat.category}</Text>
                      <View className="flex-row gap-2">
                        <Text className="text-muted text-sm">{pct.toFixed(0)}%</Text>
                        <Text className="text-white text-sm font-semibold">${Number(cat.total).toFixed(2)}</Text>
                      </View>
                    </View>
                    <View className="h-2 bg-bg-input rounded-full overflow-hidden">
                      <View className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </View>
                  </View>
                )
              })}
            </Card>
          )}

          {categories.length === 0 && monthly.length === 0 && (
            <View className="items-center py-16">
              <Text className="text-5xl mb-4">📊</Text>
              <Text className="text-muted text-sm text-center">No data yet. Add expenses to see analytics.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  )
}

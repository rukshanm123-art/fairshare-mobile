import { useEffect, useState } from 'react'
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native'
import { settlementsApi } from '@/lib/api'
import { useAuthStore } from '@/lib/stores/authStore'
import { SettlementCard } from '@/components/SettlementCard'
import type { SettlementSuggestion } from '@/lib/types'

export default function Settle() {
  const { user } = useAuthStore()
  const [suggestions, setSuggestions] = useState<SettlementSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [settling, setSettling] = useState<string | null>(null)

  async function load() {
    try {
      const { data } = await settlementsApi.suggestions()
      setSuggestions(data)
    } catch {
      // settle endpoint may return empty on no debts
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

  async function handleSettle(suggestion: SettlementSuggestion, index: number) {
    const key = `${index}`
    Alert.alert(
      'Confirm payment',
      `Mark $${Number(suggestion.amount).toFixed(2)} as paid to ${suggestion.to.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setSettling(key)
            try {
              // Create the settlement record, then mark it as paid
              const { data: record } = await settlementsApi.create({
                fromUserId: suggestion.from.id,
                toUserId: suggestion.to.id,
                amount: suggestion.amount,
                groupId: suggestion.groupId,
              })
              await settlementsApi.settle(record.id)
              // Remove settled item from local state immediately
              setSuggestions((prev) => prev.filter((_, i) => i !== index))
            } catch {
              Alert.alert('Error', 'Could not record payment')
            } finally {
              setSettling(null)
              await load()
            }
          },
        },
      ]
    )
  }

  const myDebts = suggestions.filter((s) => s.from.id === user?.id)
  const owedToMe = suggestions.filter((s) => s.to.id === user?.id)
  const otherDebts = suggestions.filter((s) => s.from.id !== user?.id && s.to.id !== user?.id)

  return (
    <View className="flex-1 bg-bg">
      <View className="px-5 pt-16 pb-4">
        <Text className="text-white text-2xl font-bold">Settle Up</Text>
        <Text className="text-muted text-sm">Outstanding balances across all groups</Text>
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
          {suggestions.length === 0 ? (
            <View className="items-center py-20">
              <Text className="text-5xl mb-4">🎉</Text>
              <Text className="text-white font-semibold text-lg mb-1">All settled!</Text>
              <Text className="text-muted text-sm text-center">No outstanding balances. Add expenses to track who owes who.</Text>
            </View>
          ) : (
            <>
              {myDebts.length > 0 && (
                <View className="mb-6">
                  <Text className="text-red-400 font-semibold text-sm uppercase tracking-wider mb-3">You Owe</Text>
                  {myDebts.map((s, i) => (
                    <SettlementCard
                      key={i}
                      suggestion={s}
                      currentUserId={user?.id}
                      onSettle={() => handleSettle(s, suggestions.indexOf(s))}
                      settling={settling === `${suggestions.indexOf(s)}`}
                    />
                  ))}
                </View>
              )}

              {owedToMe.length > 0 && (
                <View className="mb-6">
                  <Text className="text-brand font-semibold text-sm uppercase tracking-wider mb-3">Owed to You</Text>
                  {owedToMe.map((s, i) => (
                    <SettlementCard
                      key={i}
                      suggestion={s}
                      currentUserId={user?.id}
                      settling={settling === `${suggestions.indexOf(s)}`}
                    />
                  ))}
                </View>
              )}

              {otherDebts.length > 0 && (
                <View>
                  <Text className="text-muted font-semibold text-sm uppercase tracking-wider mb-3">Between Others</Text>
                  {otherDebts.map((s, i) => (
                    <SettlementCard key={i} suggestion={s} currentUserId={user?.id} />
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  )
}

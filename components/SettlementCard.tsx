import { View, Text, TouchableOpacity } from 'react-native'
import { Avatar } from './ui/Avatar'
import type { SettlementSuggestion } from '@/lib/types'

interface Props {
  suggestion: SettlementSuggestion
  currentUserId?: string
  onSettle?: () => void
  settling?: boolean
}

export function SettlementCard({ suggestion, currentUserId, onSettle, settling }: Props) {
  const isYouPaying = suggestion.from.id === currentUserId
  const isYouReceiving = suggestion.to.id === currentUserId

  return (
    <View className="bg-bg-card border border-bg-border rounded-2xl p-4 mb-3">
      <View className="flex-row items-center gap-3 mb-3">
        <Avatar name={suggestion.from.name} size="md" />
        <View className="flex-1">
          <Text className="text-white font-medium text-sm">
            {isYouPaying ? 'You' : suggestion.from.name}
            <Text className="text-muted"> owes </Text>
            {isYouReceiving ? 'you' : suggestion.to.name}
          </Text>
          <Text className="text-muted text-xs">{suggestion.group?.name}</Text>
        </View>
        <Avatar name={suggestion.to.name} size="md" />
      </View>

      <View className="flex-row items-center justify-between">
        <Text className={`text-xl font-bold ${isYouPaying ? 'text-red-400' : 'text-brand'}`}>
          ${Number(suggestion.amount).toFixed(2)}
        </Text>

        {(isYouPaying || isYouReceiving) && onSettle && (
          <TouchableOpacity
            onPress={onSettle}
            disabled={settling}
            activeOpacity={0.8}
            className={`px-4 py-2 rounded-xl ${isYouPaying ? 'bg-brand' : 'bg-bg-input border border-bg-border'}`}
          >
            <Text className={`text-sm font-semibold ${isYouPaying ? 'text-black' : 'text-white'}`}>
              {settling ? '...' : isYouPaying ? 'Pay' : 'Confirm'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

import { View, Text, TouchableOpacity } from 'react-native'
import { format } from 'date-fns'
import { Ionicons } from '@expo/vector-icons'
import type { Expense } from '@/lib/types'

const CATEGORY_ICONS: Record<string, string> = {
  food: '🍔', transport: '🚗', entertainment: '🎬',
  accommodation: '🏠', utilities: '⚡', shopping: '🛍️',
  health: '💊', travel: '✈️', other: '📦',
}

interface Props {
  expense: Expense
  currentUserId?: string
  onDelete?: (id: string) => void
}

export function ExpenseCard({ expense, currentUserId, onDelete }: Props) {
  const isMyExpense = expense.paidById === currentUserId
  const icon = CATEGORY_ICONS[expense.category?.toLowerCase()] ?? '📦'

  return (
    <View className="bg-bg-card border border-bg-border rounded-2xl p-4 mb-3">
      <View className="flex-row items-start gap-3">
        <View className="h-10 w-10 bg-bg-input rounded-xl items-center justify-center">
          <Text className="text-xl">{icon}</Text>
        </View>

        <View className="flex-1">
          <Text className="text-white font-semibold text-sm">{expense.description}</Text>
          <Text className="text-muted text-xs mt-0.5">
            Paid by{' '}
            <Text className={isMyExpense ? 'text-brand' : 'text-white'}>
              {isMyExpense ? 'you' : expense.paidBy?.name}
            </Text>
            {expense.group && ` · ${expense.group.name}`}
          </Text>
          {expense.date ? (
            <Text className="text-muted text-xs mt-0.5">
              {format(new Date(expense.date), 'MMM d, yyyy')}
            </Text>
          ) : null}
        </View>

        <View className="items-end gap-1">
          <Text className="text-white font-bold text-base">
            {expense.currency} {Number(expense.amount).toFixed(2)}
          </Text>
          {onDelete && (
            <TouchableOpacity onPress={() => onDelete(expense.id)} hitSlop={8}>
              <Ionicons name="trash-outline" size={16} color="#737373" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

import { TouchableOpacity, View, Text } from 'react-native'
import { router } from 'expo-router'
import type { Group } from '@/lib/types'

export function GroupCard({ group }: { group: Group }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/groups/${group.id}`)}
      activeOpacity={0.8}
      className="bg-bg-card border border-bg-border rounded-2xl p-4 mb-3"
    >
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 bg-bg-input rounded-xl items-center justify-center">
          <Text className="text-2xl">{group.emoji || '💰'}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white font-semibold text-base">{group.name}</Text>
          <Text className="text-muted text-sm mt-0.5">
            {group.members?.length ?? 0} member{group.members?.length !== 1 ? 's' : ''}
            {group._count?.expenses !== undefined ? ` · ${group._count.expenses} expense${group._count.expenses !== 1 ? 's' : ''}` : ''}
          </Text>
        </View>
        <Text className="text-muted text-xl">›</Text>
      </View>
    </TouchableOpacity>
  )
}

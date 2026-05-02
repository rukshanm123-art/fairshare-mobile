import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { useAuthStore } from '@/lib/stores/authStore'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { Ionicons } from '@expo/vector-icons'

export default function Profile() {
  const { user, logout } = useAuthStore()

  function handleLogout() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ])
  }

  return (
    <View className="flex-1 bg-bg">
      <View className="px-5 pt-16 pb-4">
        <Text className="text-white text-2xl font-bold">Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Avatar + name */}
        <View className="items-center mb-8">
          <Avatar name={user?.name ?? '?'} size="lg" />
          <Text className="text-white text-xl font-bold mt-3">{user?.name}</Text>
          <Text className="text-muted text-sm">{user?.email}</Text>
        </View>

        {/* Info card */}
        <Card className="mb-4">
          <View className="flex-row items-center gap-3 py-1">
            <Ionicons name="person-outline" size={18} color="#737373" />
            <View>
              <Text className="text-muted text-xs">Full Name</Text>
              <Text className="text-white text-sm font-medium">{user?.name}</Text>
            </View>
          </View>
        </Card>
        <Card className="mb-8">
          <View className="flex-row items-center gap-3 py-1">
            <Ionicons name="mail-outline" size={18} color="#737373" />
            <View>
              <Text className="text-muted text-xs">Email</Text>
              <Text className="text-white text-sm font-medium">{user?.email}</Text>
            </View>
          </View>
        </Card>

        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center gap-2 bg-red-600/20 border border-red-600/40 rounded-2xl py-4"
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#F87171" />
          <Text className="text-red-400 font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

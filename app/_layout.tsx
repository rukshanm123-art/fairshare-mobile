import '../global.css'
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useAuthStore } from '@/lib/stores/authStore'
import { View, ActivityIndicator } from 'react-native'

export default function RootLayout() {
  const { hydrate, loading } = useAuthStore()

  useEffect(() => { hydrate() }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0D0D0D', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#4ADE80" size="large" />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#0D0D0D" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D0D0D' } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  )
}

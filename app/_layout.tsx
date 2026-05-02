import '../global.css'
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useAuthStore } from '@/lib/stores/authStore'
import { View, ActivityIndicator } from 'react-native'

export default function RootLayout() {
  const { hydrate, loading } = useAuthStore()

  useEffect(() => { hydrate() }, [])

  if (loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: '#0D0D0D', alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#4ADE80" size="large" />
        </View>
      </GestureHandlerRootView>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#0D0D0D" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D0D0D' } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </GestureHandlerRootView>
  )
}

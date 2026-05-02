import '../global.css'
import { useEffect, Component } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useAuthStore } from '@/lib/stores/authStore'
import { View, Text, ActivityIndicator } from 'react-native'

// Top-level error boundary so crash details show on screen instead of silent close
class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message } }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, backgroundColor: '#0D0D0D', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ color: '#f87171', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Something went wrong</Text>
          <Text style={{ color: '#737373', fontSize: 12, textAlign: 'center' }}>{this.state.error}</Text>
        </View>
      )
    }
    return this.props.children
  }
}

function AppLayout() {
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

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <AppLayout />
      </ErrorBoundary>
    </GestureHandlerRootView>
  )
}

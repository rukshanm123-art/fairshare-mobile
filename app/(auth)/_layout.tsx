import { useEffect } from 'react'
import { Stack, router } from 'expo-router'
import { useAuthStore } from '@/lib/stores/authStore'

export default function AuthLayout() {
  const { user } = useAuthStore()

  useEffect(() => {
    if (user) router.replace('/(app)')
  }, [user])

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D0D0D' } }} />
  )
}

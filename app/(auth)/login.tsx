import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { router } from 'expo-router'
import { useAuthStore } from '@/lib/stores/authStore'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function Login() {
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  async function handleLogin() {
    const errs: typeof errors = {}
    if (!email.trim()) errs.email = 'Email is required'
    if (!password) errs.password = 'Password is required'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await login(email.trim().toLowerCase(), password)
      router.replace('/(app)')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      Alert.alert('Login failed', msg ?? 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-bg"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6 py-12">
          {/* Logo */}
          <View className="items-center mb-12">
            <View className="h-16 w-16 bg-brand rounded-2xl items-center justify-center mb-4">
              <Text className="text-3xl">💸</Text>
            </View>
            <Text className="text-white text-3xl font-bold">FairShare</Text>
            <Text className="text-muted text-sm mt-1">Split expenses, stay friends</Text>
          </View>

          <Text className="text-white text-2xl font-bold mb-1">Welcome back</Text>
          <Text className="text-muted text-sm mb-8">Sign in to your account</Text>

          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />
          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          <Button title="Sign in" loading={loading} onPress={handleLogin} className="mt-2" />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            className="mt-6 items-center"
          >
            <Text className="text-muted text-sm">
              No account?{' '}
              <Text className="text-brand font-semibold">Create one</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

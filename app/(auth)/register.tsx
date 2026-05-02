import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { router } from 'expo-router'
import { useAuthStore } from '@/lib/stores/authStore'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function Register() {
  const { register } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function handleRegister() {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    if (form.password.length < 6) errs.password = 'At least 6 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await register(form.name.trim(), form.email.trim().toLowerCase(), form.password)
      router.replace('/(app)')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      Alert.alert('Registration failed', msg ?? 'Something went wrong')
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
          <View className="items-center mb-12">
            <View className="h-16 w-16 bg-brand rounded-2xl items-center justify-center mb-4">
              <Text className="text-3xl">💸</Text>
            </View>
            <Text className="text-white text-3xl font-bold">FairShare</Text>
            <Text className="text-muted text-sm mt-1">Split expenses, stay friends</Text>
          </View>

          <Text className="text-white text-2xl font-bold mb-1">Create account</Text>
          <Text className="text-muted text-sm mb-8">Start splitting expenses fairly</Text>

          <Input label="Full name" placeholder="Rukshan De Silva" value={form.name} onChangeText={set('name')} error={errors.name} />
          <Input label="Email" placeholder="you@example.com" value={form.email} onChangeText={set('email')} keyboardType="email-address" error={errors.email} />
          <Input label="Password" placeholder="Min 6 characters" value={form.password} onChangeText={set('password')} secureTextEntry error={errors.password} />
          <Input label="Confirm password" placeholder="Repeat password" value={form.confirm} onChangeText={set('confirm')} secureTextEntry error={errors.confirm} />

          <Button title="Create account" loading={loading} onPress={handleRegister} className="mt-2" />

          <TouchableOpacity onPress={() => router.back()} className="mt-6 items-center">
            <Text className="text-muted text-sm">
              Already have an account?{' '}
              <Text className="text-brand font-semibold">Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

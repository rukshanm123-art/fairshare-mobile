import { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, Modal, TextInput,
  Alert, ActivityIndicator, RefreshControl,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { groupsApi, expensesApi } from '@/lib/api'
import { useAuthStore } from '@/lib/stores/authStore'
import { Avatar } from '@/components/ui/Avatar'
import { ExpenseCard } from '@/components/ExpenseCard'
import { Button } from '@/components/ui/Button'
import type { Group, Expense } from '@/lib/types'

const CATEGORIES = ['Food','Transport','Entertainment','Accommodation','Utilities','Shopping','Health','Other']

export default function GroupDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user } = useAuthStore()
  const [group, setGroup] = useState<Group | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Add expense modal
  const [showExpense, setShowExpense] = useState(false)
  const [form, setForm] = useState({ description: '', amount: '', category: 'Food', currency: 'USD' })
  const [adding, setAdding] = useState(false)

  // Add member modal
  const [showMember, setShowMember] = useState(false)
  const [memberEmail, setMemberEmail] = useState('')
  const [addingMember, setAddingMember] = useState(false)

  async function load() {
    try {
      const [gRes, eRes] = await Promise.all([
        groupsApi.get(id),
        expensesApi.list({ groupId: id }),
      ])
      setGroup(gRes.data)
      setExpenses(eRes.data)
    } catch {
      Alert.alert('Error', 'Could not load group')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  async function onRefresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  async function handleAddExpense() {
    if (!form.description.trim()) { Alert.alert('Description required'); return }
    const amount = parseFloat(form.amount)
    if (!amount || amount <= 0) { Alert.alert('Enter a valid amount'); return }

    setAdding(true)
    try {
      const members = group?.members ?? []
      const perPerson = amount / members.length
      const splits = members.map((m) => ({ userId: m.userId, amount: perPerson }))
      const { data } = await expensesApi.create({
        description: form.description.trim(),
        amount,
        currency: form.currency,
        category: form.category.toLowerCase(),
        date: new Date().toISOString(),
        groupId: id,
        splitType: 'equal',
        splits,
      })
      setExpenses((prev) => [data, ...prev])
      setShowExpense(false)
      setForm({ description: '', amount: '', category: 'Food', currency: 'USD' })
    } catch {
      Alert.alert('Error', 'Could not add expense')
    } finally {
      setAdding(false)
    }
  }

  async function handleAddMember() {
    if (!memberEmail.trim()) return
    setAddingMember(true)
    try {
      await groupsApi.addMember(id, memberEmail.trim().toLowerCase())
      await load()
      setShowMember(false)
      setMemberEmail('')
    } catch {
      Alert.alert('Error', 'Could not add member. Check the email address.')
    } finally {
      setAddingMember(false)
    }
  }

  async function handleDeleteExpense(expId: string) {
    Alert.alert('Delete expense?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await expensesApi.delete(expId)
          setExpenses((prev) => prev.filter((e) => e.id !== expId))
        },
      },
    ])
  }

  if (loading) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator color="#4ADE80" size="large" />
      </View>
    )
  }

  if (!group) return null

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View className="px-5 pt-14 pb-4 flex-row items-center gap-3 border-b border-bg-border">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text className="text-2xl">{group.emoji || '💰'}</Text>
        <View className="flex-1">
          <Text className="text-white font-bold text-lg">{group.name}</Text>
          <Text className="text-muted text-xs">{group.members.length} members · {expenses.length} expenses</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowExpense(true)}
          className="h-9 w-9 bg-brand rounded-full items-center justify-center"
        >
          <Ionicons name="add" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ADE80" />}
      >
        {/* Members */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-semibold text-base">Members</Text>
            <TouchableOpacity onPress={() => setShowMember(true)} className="flex-row items-center gap-1">
              <Ionicons name="person-add-outline" size={16} color="#4ADE80" />
              <Text className="text-brand text-sm">Add</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {group.members.map((m) => (
              <View key={m.userId} className="flex-row items-center gap-2 bg-bg-card border border-bg-border rounded-xl px-3 py-2">
                <Avatar name={m.user.name} size="sm" />
                <Text className="text-white text-sm">{m.user.id === user?.id ? 'You' : m.user.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Expenses */}
        <View>
          <Text className="text-white font-semibold text-base mb-3">Expenses</Text>
          {expenses.length === 0 ? (
            <View className="items-center py-10">
              <Text className="text-4xl mb-3">🧾</Text>
              <Text className="text-muted text-sm">No expenses yet</Text>
              <TouchableOpacity onPress={() => setShowExpense(true)} className="mt-4 bg-brand px-5 py-2.5 rounded-xl">
                <Text className="text-black font-semibold text-sm">Add first expense</Text>
              </TouchableOpacity>
            </View>
          ) : (
            expenses.map((e) => (
              <ExpenseCard key={e.id} expense={e} currentUserId={user?.id} onDelete={handleDeleteExpense} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Add expense modal */}
      <Modal visible={showExpense} animationType="slide" transparent presentationStyle="pageSheet">
        <View className="flex-1 bg-bg-card">
          <View className="px-5 pt-8 pb-4 flex-row items-center justify-between border-b border-bg-border">
            <Text className="text-white text-lg font-bold">Add Expense</Text>
            <TouchableOpacity onPress={() => setShowExpense(false)}>
              <Ionicons name="close" size={24} color="#737373" />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1 px-5 pt-6">
            <Text className="text-muted text-xs font-medium uppercase tracking-wider mb-2">What was it for?</Text>
            <TextInput
              value={form.description}
              onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
              placeholder="e.g. Dinner at Sushi Place"
              placeholderTextColor="#525252"
              className="bg-bg-input border border-bg-border rounded-xl px-4 py-3.5 text-white text-base mb-4"
              autoFocus
            />
            <Text className="text-muted text-xs font-medium uppercase tracking-wider mb-2">Amount (USD)</Text>
            <TextInput
              value={form.amount}
              onChangeText={(v) => setForm((f) => ({ ...f, amount: v }))}
              placeholder="0.00"
              placeholderTextColor="#525252"
              keyboardType="decimal-pad"
              className="bg-bg-input border border-bg-border rounded-xl px-4 py-3.5 text-white text-base mb-4"
            />
            <Text className="text-muted text-xs font-medium uppercase tracking-wider mb-3">Category</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setForm((f) => ({ ...f, category: cat }))}
                  className={`px-3 py-1.5 rounded-lg border ${form.category === cat ? 'bg-brand border-brand' : 'bg-transparent border-bg-border'}`}
                >
                  <Text className={`text-sm font-medium ${form.category === cat ? 'text-black' : 'text-muted'}`}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-muted text-xs mb-3">
              Split equally among {group.members.length} members
              {form.amount ? ` · ${(parseFloat(form.amount || '0') / group.members.length).toFixed(2)} each` : ''}
            </Text>
            <Button title="Add Expense" loading={adding} onPress={handleAddExpense} />
          </ScrollView>
        </View>
      </Modal>

      {/* Add member modal */}
      <Modal visible={showMember} animationType="slide" transparent presentationStyle="pageSheet">
        <View className="flex-1 bg-bg-card">
          <View className="px-5 pt-8 pb-4 flex-row items-center justify-between border-b border-bg-border">
            <Text className="text-white text-lg font-bold">Add Member</Text>
            <TouchableOpacity onPress={() => setShowMember(false)}>
              <Ionicons name="close" size={24} color="#737373" />
            </TouchableOpacity>
          </View>
          <View className="flex-1 px-5 pt-6">
            <Text className="text-muted text-xs font-medium uppercase tracking-wider mb-2">Email Address</Text>
            <TextInput
              value={memberEmail}
              onChangeText={setMemberEmail}
              placeholder="friend@example.com"
              placeholderTextColor="#525252"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-bg-input border border-bg-border rounded-xl px-4 py-3.5 text-white text-base mb-4"
              autoFocus
            />
            <Text className="text-muted text-xs mb-6">They must already have a FairShare account.</Text>
            <Button title="Add Member" loading={addingMember} onPress={handleAddMember} />
          </View>
        </View>
      </Modal>
    </View>
  )
}

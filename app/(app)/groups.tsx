import { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, RefreshControl, TouchableOpacity,
  Modal, TextInput, Alert, ActivityIndicator,
} from 'react-native'
import { useGroupStore } from '@/lib/stores/groupStore'
import { GroupCard } from '@/components/GroupCard'
import { Button } from '@/components/ui/Button'
import { Ionicons } from '@expo/vector-icons'

const EMOJIS = ['💰','🍕','✈️','🏠','🎉','🚗','🏋️','🎮','🍺','🛒','💊','⚽']

export default function Groups() {
  const { groups, fetchGroups, createGroup, loading } = useGroupStore()
  const [refreshing, setRefreshing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('💰')
  const [creating, setCreating] = useState(false)

  useEffect(() => { fetchGroups() }, [])

  async function onRefresh() {
    setRefreshing(true)
    await fetchGroups()
    setRefreshing(false)
  }

  async function handleCreate() {
    if (!name.trim()) { Alert.alert('Name required'); return }
    setCreating(true)
    try {
      await createGroup(name.trim(), emoji)
      setShowModal(false)
      setName('')
      setEmoji('💰')
    } catch {
      Alert.alert('Error', 'Could not create group')
    } finally {
      setCreating(false)
    }
  }

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View className="px-5 pt-16 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-2xl font-bold">Groups</Text>
          <Text className="text-muted text-sm">{groups.length} group{groups.length !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="h-10 w-10 bg-brand rounded-full items-center justify-center"
        >
          <Ionicons name="add" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ADE80" />}
      >
        {loading && groups.length === 0 ? (
          <ActivityIndicator color="#4ADE80" className="mt-8" />
        ) : groups.length === 0 ? (
          <View className="items-center py-16">
            <Text className="text-5xl mb-4">👥</Text>
            <Text className="text-white font-semibold text-base mb-1">No groups yet</Text>
            <Text className="text-muted text-sm text-center">Create a group to start splitting expenses with friends</Text>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              className="mt-6 bg-brand px-6 py-3 rounded-xl"
            >
              <Text className="text-black font-semibold">Create Group</Text>
            </TouchableOpacity>
          </View>
        ) : (
          groups.map((g) => <GroupCard key={g.id} group={g} />)
        )}
      </ScrollView>

      {/* Create group modal */}
      <Modal visible={showModal} animationType="slide" transparent presentationStyle="pageSheet">
        <View className="flex-1 bg-bg-card">
          <View className="px-5 pt-8 pb-4 flex-row items-center justify-between border-b border-bg-border">
            <Text className="text-white text-lg font-bold">New Group</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color="#737373" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-5 pt-6">
            <Text className="text-muted text-xs font-medium uppercase tracking-wider mb-2">Group Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Bali Trip, Flat Bills..."
              placeholderTextColor="#525252"
              className="bg-bg-input border border-bg-border rounded-xl px-4 py-3.5 text-white text-base mb-6"
              autoFocus
            />

            <Text className="text-muted text-xs font-medium uppercase tracking-wider mb-3">Pick an Emoji</Text>
            <View className="flex-row flex-wrap gap-2 mb-8">
              {EMOJIS.map((e) => (
                <TouchableOpacity
                  key={e}
                  onPress={() => setEmoji(e)}
                  className={`h-12 w-12 rounded-xl items-center justify-center ${emoji === e ? 'bg-brand' : 'bg-bg-input'}`}
                >
                  <Text className="text-2xl">{e}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button title="Create Group" loading={creating} onPress={handleCreate} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

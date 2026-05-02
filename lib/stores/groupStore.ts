import { create } from 'zustand'
import { groupsApi } from '../api'
import type { Group } from '../types'

interface GroupState {
  groups: Group[]
  loading: boolean
  fetchGroups: () => Promise<void>
  createGroup: (name: string, emoji: string) => Promise<Group>
  addMember: (groupId: string, email: string) => Promise<void>
  removeMember: (groupId: string, userId: string) => Promise<void>
  getGroup: (id: string) => Promise<Group>
}

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  loading: false,

  fetchGroups: async () => {
    set({ loading: true })
    try {
      const { data } = await groupsApi.list()
      set({ groups: data })
    } finally {
      set({ loading: false })
    }
  },

  createGroup: async (name, emoji) => {
    const { data } = await groupsApi.create(name, emoji)
    set((s) => ({ groups: [data, ...s.groups] }))
    return data
  },

  addMember: async (groupId, email) => {
    await groupsApi.addMember(groupId, email)
  },

  removeMember: async (groupId, userId) => {
    await groupsApi.removeMember(groupId, userId)
  },

  getGroup: async (id) => {
    const { data } = await groupsApi.get(id)
    return data
  },
}))

import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { authApi } from '../api'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,

  login: async (email, password) => {
    const { data } = await authApi.login(email, password)
    await SecureStore.setItemAsync('auth_token', data.token)
    set({ user: data.user, token: data.token })
  },

  register: async (name, email, password) => {
    const { data } = await authApi.register(name, email, password)
    await SecureStore.setItemAsync('auth_token', data.token)
    set({ user: data.user, token: data.token })
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token')
    set({ user: null, token: null })
  },

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token')
      if (token) {
        const { data } = await authApi.me()
        set({ user: data, token, loading: false })
      } else {
        set({ loading: false })
      }
    } catch {
      await SecureStore.deleteItemAsync('auth_token')
      set({ user: null, token: null, loading: false })
    }
  },
}))

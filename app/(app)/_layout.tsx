import { useEffect } from 'react'
import { Tabs, router } from 'expo-router'
import { View, Text, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '@/lib/stores/authStore'

function TabIcon({ name, focused, label }: { name: keyof typeof Ionicons.glyphMap; focused: boolean; label: string }) {
  return (
    <View className="items-center gap-0.5 pt-1">
      <Ionicons name={focused ? name : `${name}-outline` as keyof typeof Ionicons.glyphMap} size={22} color={focused ? '#4ADE80' : '#525252'} />
      <Text style={{ fontSize: 10, color: focused ? '#4ADE80' : '#525252', fontWeight: focused ? '600' : '400' }}>{label}</Text>
    </View>
  )
}

export default function AppLayout() {
  const { user } = useAuthStore()
  const insets = useSafeAreaInsets()
  // Reserve space for the home indicator on iPhone; minimum 8px on Android
  const tabBarHeight = 60 + (Platform.OS === 'ios' ? insets.bottom : 8)

  useEffect(() => {
    if (!user) router.replace('/(auth)/login')
  }, [user])

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#111111',
          borderTopColor: '#262626',
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} label="Home" /> }}
      />
      <Tabs.Screen
        name="groups"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="people" focused={focused} label="Groups" /> }}
      />
      {/* Hide group detail from tab bar — navigated to via router.push */}
      <Tabs.Screen name="groups/[id]" options={{ href: null }} />
      <Tabs.Screen
        name="settle"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="swap-horizontal" focused={focused} label="Settle" /> }}
      />
      <Tabs.Screen
        name="analytics"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="bar-chart" focused={focused} label="Analytics" /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} label="Profile" /> }}
      />
    </Tabs>
  )
}

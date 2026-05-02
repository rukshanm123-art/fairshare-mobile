import { View, Text } from 'react-native'
import { Link } from 'expo-router'

export default function NotFound() {
  return (
    <View className="flex-1 bg-bg items-center justify-center px-6">
      <Text className="text-white text-2xl font-bold mb-2">Page not found</Text>
      <Link href="/" className="text-brand text-base">Go home</Link>
    </View>
  )
}

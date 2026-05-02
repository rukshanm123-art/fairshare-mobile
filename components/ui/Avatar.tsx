import { View, Text } from 'react-native'

interface Props {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const COLORS = [
  'bg-violet-600', 'bg-blue-600', 'bg-emerald-600',
  'bg-amber-600', 'bg-rose-600', 'bg-cyan-600',
]

function colorFor(name: string) {
  const idx = name.charCodeAt(0) % COLORS.length
  return COLORS[idx]
}

export function Avatar({ name, size = 'md' }: Props) {
  const sizes = { sm: 'h-7 w-7', md: 'h-9 w-9', lg: 'h-12 w-12' }
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-lg' }

  return (
    <View className={`${sizes[size]} ${colorFor(name)} rounded-full items-center justify-center`}>
      <Text className={`${textSizes[size]} font-bold text-white`}>
        {name[0]?.toUpperCase()}
      </Text>
    </View>
  )
}

import { View, Text, TextInput, TextInputProps } from 'react-native'

interface Props extends TextInputProps {
  label?: string
  error?: string
}

export function Input({ label, error, ...rest }: Props) {
  return (
    <View className="mb-4">
      {label && <Text className="text-muted text-xs font-medium mb-1.5 uppercase tracking-wider">{label}</Text>}
      <TextInput
        className={`bg-bg-input border ${error ? 'border-red-500' : 'border-bg-border'} rounded-xl px-4 py-3.5 text-white text-base`}
        placeholderTextColor="#525252"
        autoCapitalize="none"
        {...rest}
      />
      {error && <Text className="text-red-400 text-xs mt-1">{error}</Text>}
    </View>
  )
}

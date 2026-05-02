import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native'

interface Props extends TouchableOpacityProps {
  title: string
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

export function Button({ title, loading, variant = 'primary', disabled, ...rest }: Props) {
  const base = 'flex-row items-center justify-center rounded-xl py-3.5 px-5'
  const variants = {
    primary: 'bg-brand',
    secondary: 'bg-bg-card border border-bg-border',
    ghost: 'bg-transparent',
    danger: 'bg-red-600',
  }
  const textVariants = {
    primary: 'text-black font-semibold text-base',
    secondary: 'text-white font-medium text-base',
    ghost: 'text-brand font-medium text-base',
    danger: 'text-white font-semibold text-base',
  }

  return (
    <TouchableOpacity
      className={`${base} ${variants[variant]} ${disabled || loading ? 'opacity-50' : ''}`}
      disabled={disabled || loading}
      activeOpacity={0.75}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#000' : '#4ADE80'} size="small" />
      ) : (
        <Text className={textVariants[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

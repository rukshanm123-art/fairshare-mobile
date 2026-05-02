import { View, ViewProps } from 'react-native'

interface Props extends ViewProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '', ...rest }: Props) {
  return (
    <View
      className={`bg-bg-card border border-bg-border rounded-2xl p-4 ${className}`}
      {...rest}
    >
      {children}
    </View>
  )
}

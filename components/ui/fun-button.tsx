import { Pressable, Text, ActivityIndicator, Animated, Easing, View } from 'react-native'
import { clsx } from 'clsx'
import React, { ReactNode, useEffect, useRef } from 'react'

interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'orange' | 'blue' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  classList?: string
  children: ReactNode
  icon?: ReactNode
  onPress?: () => void
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
}

const variants = {
  default: { bg: 'bg-blue-500', text: 'text-white', color: 'white' },
  outline: { bg: 'border border-gray-100', text: 'text-white', color: 'white' },
  ghost: { bg: 'bg-transparent', text: 'text-white', color: 'white' },
  destructive: { bg: 'bg-red-500', text: 'text-white', color: 'white' },
  orange: { bg: 'border border-top-orange bg-top-orange', text: 'text-white', color: 'white' },
  blue: { bg: 'border border-top-blue bg-top-blue', text: 'text-white', color: 'white' },
  dark: { bg: 'border border-black bg-black', text: 'text-white', color: 'white' },
}

const sizes = {
  sm: 'px-3 py-1',
  md: 'px-4 py-2',
  lg: 'px-5 py-3',
}

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const shadowStyles = {
  shadowColor: 'rgba(38, 37, 23, 0.16)',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 1,
  shadowRadius: 14,
  elevation: 6,
  minHeight: 56,
}

export function FunButton({
  variant = 'default',
  size = 'md',
  classList,
  children,
  icon,
  fullWidth = false,
  disabled = false,
  loading = false,
  ...props
}: ButtonProps) {
  const spinValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start()
    } else {
      spinValue.setValue(0)
    }
  }, [loading])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const classes = clsx(
    'items-center justify-center rounded-2xl flex flex-row p-2 px-4 space-x-2',
    variants[variant].bg,
    sizes[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'opacity-50',
    classList
  )

  return (
    <Pressable className={classes} style={shadowStyles} disabled={disabled || loading} {...props}>
      {loading ? (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <ActivityIndicator color="white" />
        </Animated.View>
      ) : (
        <View className="flex-row items-center">
          {icon && <View className="mr-2">{React.cloneElement(icon as any, { color: variants[variant].color })}</View>}
          <Text className={clsx('font-medium font-sf-black', textSizes[size], variants[variant].text)}>{children}</Text>
        </View>
      )}
    </Pressable>
  )
}

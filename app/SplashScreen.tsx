import React, { useEffect } from 'react'
import { View, Image, ActivityIndicator, Text } from 'react-native'
import { useRouter, useRootNavigationState } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function SplashScreen() {
  const router = useRouter()
  const nav = useRootNavigationState()
  const { isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    // Only navigate after the root navigator and Clerk are ready
    if (!nav?.key || !isLoaded) return

    const timer = setTimeout(() => {
      router.replace(isSignedIn ? '/' : '/sign-in')
    }, 1500) // adjust duration as you like

    return () => clearTimeout(timer)
  }, [nav?.key, isLoaded, isSignedIn, router])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#040720',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={require('../assets/images/logo_icon.png')}
        style={{ width: 180, height: 180, resizeMode: 'contain', marginBottom: 20 }}
      />
      <ActivityIndicator size="large" color="#1e90ff" />
      <Text style={{ marginTop: 16, fontSize: 14, color: '#9CA3AF' }}>
        Preparing your child’s protection...
      </Text>
    </View>
  )
}
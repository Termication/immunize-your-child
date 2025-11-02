import React from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useSignIn, useOAuth } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { Ionicons } from '@expo/vector-icons'

WebBrowser.maybeCompleteAuthSession()

// Sign in page
export default function SignIn() {
  const router = useRouter()
  const { isLoaded, signIn, setActive } = useSignIn()

  const [email, setEmail] = React.useState('')
  const [code, setCode] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // iOS
  const redirectUrl = Linking.createURL('/dashboard/page')

  const { startOAuthFlow: startGoogle } = useOAuth({ strategy: 'oauth_google' })
  const { startOAuthFlow: startApple } = useOAuth({ strategy: 'oauth_apple' })

  // Email
  const handleEmailStart = async () => {
    if (!isLoaded || !email.trim()) return
    setLoading(true)
    setError(null)
    try {
      await signIn.create({
        identifier: email.trim(),
        strategy: 'email_code',
      })
      setPendingVerification(true)
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? 'Failed to send code. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // Verify code
  const handleVerifyCode = async () => {
    if (!isLoaded || !code.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code: code.trim(),
      })
      if (res.status === 'complete') {
        await setActive({ session: res.createdSessionId })
        router.replace('/')
      } else {
        setError('Additional steps required. Please try again.')
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? 'Invalid or expired code.')
    } finally {
      setLoading(false)
    }
  }

  // OAuth 
  const handleOAuth = async (provider: 'google' | 'apple') => {
    setError(null)
    try {
      const start = provider === 'google' ? startGoogle : startApple
      const { createdSessionId, setActive: clerkSetActive } = await start({ redirectUrl })
      if (createdSessionId) {
        await clerkSetActive?.({ session: createdSessionId })
        router.replace('/')
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? `Failed to sign in with ${provider}.`)
    }
  }

  // UI
  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} className="flex-1 bg-secondary dark:bg-neutral-950">
      <View className="flex-1 px-6 pt-16">
        <Text className="text-3xl font-bold text-neutral-900 dark:text-white">Welcome back</Text>
        <Text className="mt-1 text-base text-gray-500 dark:text-neutral-400">Sign in to continue</Text>

        {!!error && (
          <View className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-3 py-2">
            <Text className="text-red-600 dark:text-red-400">{error}</Text>
          </View>
        )}

  // Email sign in form
        {!pendingVerification ? (
          <>
            <View className="mt-8">
              <Text className="mb-2 text-sm font-medium text-white dark:text-neutral-300">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                className="h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-gray-300"
              />
            </View>

            <TouchableOpacity
              onPress={handleEmailStart}
              disabled={loading || !email.trim()}
              className="mt-4 h-12 rounded-xl bg-neutral-900 dark:bg-primary items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white dark:text-neutral-900 font-semibold">Continue with Email</Text>
              )}
            </TouchableOpacity>

            <View className="my-6 flex-row items-center">
              <View className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
              <Text className="mx-3 text-neutral-500 dark:text-neutral-400">or</Text>
              <View className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
            </View>

            <View className="gap-3">
              <TouchableOpacity
                onPress={() => handleOAuth('google')}
                className="h-12 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-row items-center justify-center"
              >
                <Ionicons name="logo-google" size={18} color="#EA4335" style={{ marginRight: 8 }} />
                <Text className="text-neutral-900 dark:text-neutral-100 font-semibold">Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleOAuth('apple')}
                className="h-12 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-row items-center justify-center"
              >
                <Ionicons name="logo-apple" size={20} color="#000" style={{ marginRight: 8 }} />
                <Text className="text-neutral-900 dark:text-neutral-100 font-semibold">Continue with Apple</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // Verify code form
          <>
            <View className="mt-8">
              <Text className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Enter the 6-digit code we sent to
              </Text>
              <Text className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{email}</Text>

              <TextInput
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="123456"
                placeholderTextColor="#9CA3AF"
                className="mt-4 h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 tracking-widest text-center"
              />
            </View>

            <TouchableOpacity
              onPress={handleVerifyCode}
              disabled={loading || code.trim().length < 6}
              className="mt-4 h-12 rounded-xl bg-neutral-900 dark:bg-white items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white dark:text-neutral-900 font-semibold">Verify and Continue</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setPendingVerification(false); setCode('') }} className="mt-4 items-center">
              <Text className="text-neutral-500 dark:text-neutral-400">Use a different email</Text>
            </TouchableOpacity>
          </>
        )}

      </View>
    </KeyboardAvoidingView>
  )
}
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function Dashboard() {
  const { signOut } = useAuth()

  const [children] = React.useState<Array<{ id: string; name: string }>>([])

  return (
    <SafeAreaView className="flex-1 bg-secondary dark:bg-neutral-950">
      <View className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-white">Dashboard</Text>

          <Link href="/add-child/page" asChild>
            <TouchableOpacity className="flex-row items-center px-3 py-2 rounded-xl bg-primary">
              <Ionicons name="add-circle-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text className="text-white font-semibold">Add Child</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Content */}
        {children.length === 0 ? (
          <View className="flex-1 items-center justify-center px-2">
            <View className="w-full rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 items-center">
              <Text className="text-5xl mb-3">👶</Text>
              <Text className="text-lg font-semibold text-neutral-900 dark:text-white">
                No child to display
              </Text>
              <Text className="mt-2 text-neutral-500 dark:text-neutral-400 text-center">
                Add your first child to start tracking vaccinations and reminders.
              </Text>

              <Link href="/add-child/page" asChild>
                <TouchableOpacity className="mt-5 h-12 px-5 rounded-xl bg-primary items-center justify-center">
                  <Text className="text-white font-semibold">Add Child</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ) : (
          <View className="mt-6">
            <Text className="text-neutral-700 dark:text-neutral-300 mb-3">Your children</Text>
            {children.map((c) => (
              <View
                key={c.id}
                className="mb-3 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
              >
                <Text className="text-neutral-900 dark:text-neutral-100 font-semibold">{c.name}</Text>
                <Text className="text-neutral-500 dark:text-neutral-400 text-sm">Tap to view details</Text>
              </View>
            ))}
          </View>
        )}

        {/* Sign out */}
        <TouchableOpacity
          className="mt-auto mb-6 h-12 rounded-xl bg-neutral-900 dark:bg-white items-center justify-center"
          onPress={() => signOut()}
        >
          <Text className="text-white dark:text-black font-semibold">Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
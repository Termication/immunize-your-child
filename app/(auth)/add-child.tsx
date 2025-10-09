import React from 'react'
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { useRouter } from 'expo-router'

export default function AddChild() {
  const router = useRouter()
  const [name, setName] = React.useState('')
  const [dob, setDob] = React.useState('') // e.g., 2022-04-09

  const onSave = () => {
    if (!name.trim()) {
      Alert.alert('Please enter a name')
      return
    }
    // TODO: Persist to your backend/DB
    // For now, just go back to dashboard
    router.replace('/')
  }

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} className="flex-1 bg-secondary px-6 pt-16">
      <Text className="text-3xl font-bold text-neutral-900 dark:text-white">Add Child</Text>

      <View className="mt-6">
        <Text className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Thandi"
          placeholderTextColor="#9CA3AF"
          className="h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
        />
      </View>

      <View className="mt-4">
        <Text className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">Date of Birth (YYYY-MM-DD)</Text>
        <TextInput
          value={dob}
          onChangeText={setDob}
          keyboardType="numbers-and-punctuation"
          placeholder="2019-06-15"
          placeholderTextColor="#9CA3AF"
          className="h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
        />
      </View>

      <TouchableOpacity
        onPress={onSave}
        className="mt-6 h-12 rounded-xl bg-primary items-center justify-center"
      >
        <Text className="text-white font-semibold">Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        className="mt-3 h-12 rounded-xl border border-neutral-300 dark:border-neutral-800 items-center justify-center"
      >
        <Text className="text-neutral-700 dark:text-neutral-200 font-semibold">Cancel</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}
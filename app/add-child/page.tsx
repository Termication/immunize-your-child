import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AddChild() {
  const router = useRouter()
  const { getToken, userId } = useAuth()

  // Parent info
  const [motherName, setMotherName] = React.useState('')
  const [fatherName, setFatherName] = React.useState('')

  // Child info
  const [childFirstName, setChildFirstName] = React.useState('')
  const [childSurname, setChildSurname] = React.useState('')
  const [dob, setDob] = React.useState('')                 // YYYY-MM-DD
  const [idNumber, setIdNumber] = React.useState('')       // optional
  const [weightKg, setWeightKg] = React.useState('')       // numeric string
  const [location, setLocation] = React.useState('')
  const [birthOrder, setBirthOrder] = React.useState<'1' | '2' | '3'>('1')
  const [placeOfBirth, setPlaceOfBirth] = React.useState('') // e.g. Hospital/Clinic/Home

  const [submitting, setSubmitting] = React.useState(false)

  const validate = () => {
    if (!motherName.trim() || !fatherName.trim()) {
      Alert.alert('Missing info', 'Please enter both parents\' names.')
      return false
    }
    if (!childFirstName.trim() || !childSurname.trim()) {
      Alert.alert('Missing info', 'Please enter the child\'s first name and surname.')
      return false
    }
    if (!dob.trim()) {
      Alert.alert('Missing info', 'Please enter date of birth (YYYY-MM-DD).')
      return false
    }
    
    // Validate date format
    const dobDate = new Date(dob)
    if (isNaN(dobDate.getTime())) {
      Alert.alert('Invalid Date', 'Please enter a valid date in YYYY-MM-DD format.')
      return false
    }
    
    if (weightKg && isNaN(Number(weightKg))) {
      Alert.alert('Check weight', 'Weight must be a number, e.g. 3.2')
      return false
    }
    return true
  }

  const onSave = async () => {
    if (!validate()) return
    setSubmitting(true)

    try {
      const baseUrl = process.env.EXPO_PUBLIC_API_URL
      if (!baseUrl) {
        throw new Error('API URL not configured')
      }

      if (!userId) {
        throw new Error('User not authenticated')
      }

      const token = await getToken()

      const payload = {
        mother_name: motherName.trim(),
        father_name: fatherName.trim(),
        child_first_name: childFirstName.trim(),
        child_surname: childSurname.trim(),
        dob: dob.trim(),
        id_number: idNumber.trim() || null,
        weight_kg: weightKg ? Number(weightKg) : null,
        location: location.trim() || null,
        birth_order: Number(birthOrder),
        place_of_birth: placeOfBirth.trim() || null,
      }

      const res = await fetch(`${baseUrl}/api/children`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || `Request failed with ${res.status}`)
      }

      Alert.alert('Success', 'Child saved successfully!')
      router.back()
    } catch (err: any) {
      console.error('Save error:', err)
      Alert.alert('Error', err?.message ?? 'Failed to save child. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-secondary dark:bg-neutral-950">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-6 pt-4">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-white">Add Child</Text>

          {/* Parents */}
          <Text className="mt-6 mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Parents</Text>
          <View className="gap-3">
            <TextInput 
              value={motherName} 
              onChangeText={setMotherName} 
              placeholder="Mother's full name" 
              placeholderTextColor="#9CA3AF" 
              className="h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100" 
            />
            <TextInput 
              value={fatherName} 
              onChangeText={setFatherName} 
              placeholder="Father's full name" 
              placeholderTextColor="#9CA3AF" 
              className="h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100" 
            />
          </View>

          {/* Child */}
          <Text className="mt-6 mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Child</Text>
          <View className="gap-3">
            <TextInput 
              value={childFirstName} 
              onChangeText={setChildFirstName} 
              placeholder="Child's first name" 
              placeholderTextColor="#9CA3AF" 
              className="h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100" 
            />
            <TextInput 
              value={childSurname} 
              onChangeText={setChildSurname} 
              placeholder="Child's surname" 
              placeholderTextColor="#9CA3AF" 
              className="h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100" 
            />
            <TextInput 
              value={dob} 
              onChangeText={setDob} 
              placeholder="Date of birth (YYYY-MM-DD)" 
              placeholderTextColor="#9CA3AF" 
              autoCapitalize="none" 
              className="h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100" 
            />
            <TextInput 
              value={idNumber} 
              onChangeText={setIdNumber} 
              placeholder="ID number (optional)" 
              placeholderTextColor="#9CA3AF" 
              keyboardType="number-pad" 
              className="h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100" 
            />
            <TextInput 
              value={weightKg} 
              onChangeText={setWeightKg} 
              placeholder="Weight (kg), e.g. 3.2" 
              placeholderTextColor="#9CA3AF" 
              keyboardType="decimal-pad" 
              className="h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100" 
            />
            <TextInput 
              value={location} 
              onChangeText={setLocation} 
              placeholder="Location (City/Suburb)" 
              placeholderTextColor="#9CA3AF" 
              className="h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100" 
            />

            {/* Birth order quick-select */}
            <View className="mt-1">
              <Text className="mb-2 text-sm text-neutral-600 dark:text-neutral-400">Birth order</Text>
              <View className="flex-row gap-2">
                {(['1', '2', '3'] as const).map((n) => {
                  const selected = birthOrder === n
                  return (
                    <TouchableOpacity 
                      key={n} 
                      onPress={() => setBirthOrder(n)} 
                      className={`px-4 h-10 rounded-lg items-center justify-center border ${
                        selected ? 'bg-primary border-primary' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                      }`}
                    >
                      <Text className={selected ? 'text-white font-semibold' : 'text-neutral-800 dark:text-neutral-200'}>
                        {n === '1' ? 'First' : n === '2' ? 'Second' : 'Third'}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <TextInput 
              value={placeOfBirth} 
              onChangeText={setPlaceOfBirth} 
              placeholder="Place of birth (Hospital/Clinic/Home)" 
              placeholderTextColor="#9CA3AF" 
              className="mt-3 h-12 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100" 
            />
          </View>

          {/* Actions */}
          <TouchableOpacity 
            onPress={onSave} 
            disabled={submitting} 
            className="mt-6 h-12 rounded-xl bg-primary items-center justify-center disabled:opacity-60"
          >
            <Text className="text-white font-semibold">
              {submitting ? 'Saving…' : 'Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.back()} 
            className="mt-3 h-12 rounded-xl border border-neutral-300 dark:border-neutral-800 items-center justify-center"
          >
            <Text className="text-neutral-700 dark:text-neutral-200 font-semibold">Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
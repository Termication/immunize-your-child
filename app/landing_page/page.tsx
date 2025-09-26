import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function LandingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-secondary">
      {/* ScrollView allows the content to be scrollable on smaller screens */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="items-center p-6 pt-2">

        <Image
        source={require('../../assets/images/logo_letters.png')}
        style={{
            width: 200,
            height: 200,
            resizeMode: 'contain',
            marginTop: -10
        }}
        className="mb-6"
        />

          {/* Hero Description */}
          <Text className="text-base text-gray-600 text-center my-4
          ">
            A simple way for South African parents to track vaccinations, get reminders, and keep their children protected.
          </Text>

          {/* Get Started Button */}
          <TouchableOpacity
            className="bg-primary w-full items-center py-3 rounded-lg mt-4 shadow-md"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold">
              Get Started
            </Text>
          </TouchableOpacity>

          {/* Features Section */}
          <View className="w-full mt-10">
            {/* Feature Card 1 */}
            <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800">📅 Vaccination Schedule</Text>
              <Text className="text-sm text-gray-600 mt-1">
                Keep track of all required vaccines by age.
              </Text>
            </View>

            {/* Feature Card 2 */}
            <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800">🔔 Smart Reminders</Text>
              <Text className="text-sm text-gray-600 mt-1">
                Get notified before your child’s next vaccination.
              </Text>
            </View>

            {/* Feature Card 3 */}
            <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800">🧾 Digital Records</Text>
              <Text className="text-sm text-gray-600 mt-1">
                Access and store all records securely in one place.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <Text className="text-xs text-gray-500 mt-8">
            © 2025 Immunize Your Child — Built for South Africa
          </Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


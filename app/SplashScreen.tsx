import React, { useEffect } from 'react';
import { View, Image, ActivityIndicator, Text } from 'react-native';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    // Simulate loading — 2.5 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#040720',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Logo */}
      <Image
        source={require('../assets/images/logo_icon.png')}
        style={{
            width: 180,
            height: 180,
            resizeMode: 'contain',
            marginBottom: 20,
        }}
        />

      {/* Small “loading” indicator */}
      <ActivityIndicator size="large" color="#1e90ff" />

      {/* App tagline (light subtle text) */}
      <Text style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
        Preparing your child’s protection...
      </Text>
    </View>
  );
}
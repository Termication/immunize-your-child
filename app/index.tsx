import React, { useState } from 'react';
import { View } from 'react-native';
import LandingScreen from "./landing_page/page";
import SplashScreen from "./SplashScreen";

export default function Index() {
  const [loading, setLoading] = useState(true);

  // Render the landing screen or the splash screen
  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <SplashScreen onFinish={() => setLoading(false)} />
      ) : (
        <LandingScreen />
      )}
    </View>
  );
}
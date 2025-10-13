import { Stack } from "expo-router";
import "./globals.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

const tokenCache = {
  getToken: (key: string) => SecureStore.getItemAsync(key),
  saveToken: (key: string, value: string) => SecureStore.setItemAsync(key, value),
};

// Root layout must render a navigator immediately
export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}
    >
      <Stack initialRouteName="SplashScreen" screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}
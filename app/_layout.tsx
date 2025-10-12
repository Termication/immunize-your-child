import { Stack, useRootNavigationState } from "expo-router";
import "../app/globals.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

const tokenCache = {
  getToken: (key: string) => SecureStore.getItemAsync(key),
  saveToken: (key: string, value: string) => SecureStore.setItemAsync(key, value),
};

// This is the root layout for the app
export default function RootLayout() {
  const nav = useRootNavigationState()
  if (!nav) return null
  
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}
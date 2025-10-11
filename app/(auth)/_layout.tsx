import { Stack, Redirect, useRootNavigationState } from "expo-router";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

export default function AuthLayout() {
  const nav = useRootNavigationState()
  if (!nav) return null
  
  return (
    <>
      <SignedIn>
        <Redirect href="/dashboard/page" />
      </SignedIn>
      <SignedOut>
        <Stack screenOptions={{ headerShown: false }} />
      </SignedOut>
    </>
  );
}
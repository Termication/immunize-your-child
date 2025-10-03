import { Stack, Redirect } from "expo-router";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

export default function AuthLayout() {
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
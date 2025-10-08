import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export default function Dashboard() {
  const { signOut } = useAuth();

  // TODO: Add a list of vaccines that the child has received
  // TODO: Add a list of vaccines that the child is due for
  // TODO: Add a list of vaccines that the child is overdue for
  // TODO: Add a list of vaccines that the child is due for next
  // TODO: Add a list of vaccines that the child is overdue for next
  // TODO: Add a list of vaccines that the child is due for next
  return (
    <View className="flex-1 bg-secondary dark:bg-neutral-950 px-6 pt-16">
      <Text className="text-3xl font-bold text-neutral-900 dark:text-white">Dashboard</Text>
      <Text className="mt-2 text-neutral-500 dark:text-neutral-400">You’re signed in 🎉</Text>

      <TouchableOpacity
        className="mt-8 h-12 rounded-xl bg-grey-900 dark:bg-white items-center justify-center"
        onPress={() => signOut()}
      >
        <Text className="text-white dark:text-black font-semibold">Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
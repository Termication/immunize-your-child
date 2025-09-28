import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const onSignInPress = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/');
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
                alert('Sign in failed. Please check your credentials.'); // Provide user feedback
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            alert(err.errors?.[0]?.message || 'An error occurred during sign in.'); // Provide user-friendly error
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-secondary">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 justify-center items-center p-6">
                    <Image
                        source={{ uri: 'https://placehold.co/150x150/800000/FFFFFF?text=Logo' }}
                        style={{ width: 150, height: 150, resizeMode: 'contain' }}
                        className="mb-8"
                    />

                    <Text className="text-3xl font-bold text-gray-800 mb-6">Welcome Back</Text>

                    <View className="w-full">
                        <TextInput
                            autoCapitalize="none"
                            value={emailAddress}
                            placeholder="Email Address"
                            onChangeText={(email) => setEmailAddress(email)}
                            className="bg-white text-base p-4 w-full rounded-lg border border-gray-200 mb-4"
                            keyboardType="email-address"
                        />
                        <TextInput
                            value={password}
                            placeholder="Password"
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password)}
                            className="bg-white text-base p-4 w-full rounded-lg border border-gray-200"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={onSignInPress}
                        disabled={loading}
                        className={`w-full items-center py-3 rounded-lg mt-6 shadow-md ${loading ? 'bg-gray-400' : 'bg-primary'}`}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className="text-white text-lg font-semibold">Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <View className="flex-row gap-1 mt-6">
                        <Text className="text-gray-600">Don't have an account?</Text>
                        <Link href="/sign-up" asChild>
                            <TouchableOpacity>
                                <Text className="text-primary font-semibold">Sign up</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


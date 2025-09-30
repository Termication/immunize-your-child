import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define the OAuth strategy type for clarity
type OAuthStrategy = 'oauth_google' | 'oauth_apple';

export default function SignInScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState<OAuthStrategy | 'password' | false>(false);

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
        if (!isLoaded) return;
        setLoading('password');

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
                alert('Sign in failed. Please check your credentials.');
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            alert(err.errors?.[0]?.message || 'An error occurred during sign in.');
        } finally {
            setLoading(false);
        }
    };

    // Handle the social sign-in press
    const onSocialPress = async (strategy: OAuthStrategy) => {
        if (!isLoaded) return;
        setLoading(strategy);

        try {
            // This initiates the OAuth flow provided by Clerk.
            const { createdSessionId, signIn, signUp } = await signIn.create({
              strategy: strategy,
            });
      

            if (createdSessionId) {
              await setActive({ session: createdSessionId });
              router.replace('/');
            }
        } catch (err) {
            console.error('OAuth error', JSON.stringify(err, null, 2));
            alert('An error occurred during social sign in.');
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
                        // IMPORTANT: Replace this with your actual local logo file
                        source={{ uri: 'https://placehold.co/150x150/800000/FFFFFF?text=Logo' }}
                        className="w-36 h-36 mb-8"
                        resizeMode="contain"
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
                        disabled={!!loading}
                        className={`w-full items-center py-3 rounded-lg mt-6 shadow-md ${loading ? 'bg-gray-400' : 'bg-primary'}`}
                    >
                        {loading === 'password' ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className="text-white text-lg font-semibold">Sign In</Text>
                        )}
                    </TouchableOpacity>
                    
                    {/* Divider */}
                    <View className="flex-row items-center my-6 w-full">
                        <View className="flex-1 h-px bg-gray-300" />
                        <Text className="mx-4 text-gray-500">or continue with</Text>
                        <View className="flex-1 h-px bg-gray-300" />
                    </View>

                    {/* Social Logins */}
                    <TouchableOpacity
                        onPress={() => onSocialPress('oauth_google')}
                        disabled={!!loading}
                        className="w-full bg-white flex-row justify-center items-center py-3 rounded-lg shadow-md border border-gray-200"
                    >
                         {loading === 'oauth_google' ? (
                            <ActivityIndicator className="mr-2" />
                        ) : (
                            <Image source={{uri: 'https://img.icons8.com/color/48/google-logo.png'}} className="w-6 h-6 mr-2" />
                        )}
                        <Text className="text-gray-800 text-lg font-semibold">Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => onSocialPress('oauth_apple')}
                        disabled={!!loading}
                        className="w-full bg-black flex-row justify-center items-center py-3 rounded-lg shadow-md mt-4"
                    >
                        {loading === 'oauth_apple' ? (
                            <ActivityIndicator color="#ffffff" className="mr-2" />
                        ) : (
                             <Image source={{uri: 'https://img.icons8.com/ios-filled/50/ffffff/mac-os.png'}} className="w-6 h-6 mr-2" />
                        )}
                        <Text className="text-white text-lg font-semibold">Apple</Text>
                    </TouchableOpacity>

                    <View className="flex-row gap-1 mt-8">
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


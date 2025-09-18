import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View, ActivityIndicator, ScrollView } from "react-native";
import { ScreenContainer, Title, Button, Subtitle, colors } from "../../components/ui";
import { useRouter } from "expo-router";
import { useToast } from "../../context/ToastContext";
import { useOnboarding } from "../../context/OnboardingContext";
import { useAuth } from "../../context/AuthContext";
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"

// android : 746039886902-5vlmhjn76mgoopgfru5l7q51t6c0j7ep.apps.googleusercontent.com
// ios : 746039886902-nh57ar0unrl0a1bnc7ktj363855oljh9.apps.googleusercontent.com

WebBrowser.maybeCompleteAuthSession();

export default function Register() {
    const router = useRouter();
    const { showToast } = useToast();
    const { answers } = useOnboarding();
    const { register, loginWithGoogle, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: "746039886902-nh57ar0unrl0a1bnc7ktj363855oljh9.apps.googleusercontent.com",
        androidClientId: "746039886902-5vlmhjn76mgoopgfru5l7q51t6c0j7ep.apps.googleusercontent.com",
        webClientId: "746039886902-86q24v8m81r1fg2hp2l3j386b2iplad7.apps.googleusercontent.com",
        // expoClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        scopes: ["profile", "email"],
    });

    const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
    const passwordValid = password.length >= 6;
    const passwordsMatch = password === confirm && confirm.length > 0;
    const canSubmit = emailValid && passwordValid && passwordsMatch && !isLoading;

    const onSubmit = async () => {
        if (!canSubmit) {
            if (!emailValid) showToast("Please enter a valid email address", "error");
            else if (!passwordValid) showToast("Password must be at least 6 characters", "error");
            else if (!passwordsMatch) showToast("Passwords do not match", "error");
            return;
        }

        const result = await register(email, password, answers);

        if (result.success) {
            showToast("Account created successfully! Welcome to ZenFlow! 🌟", "success");
            router.replace("/(tabs)");
        } else {
            showToast(result.error || "Failed to create account", "error");
        }
    };

    useEffect(() => {
        const handleGoogle = async () => {
            if (response?.type === 'success' && response.authentication?.idToken) {
                const result = await loginWithGoogle(response.authentication.idToken);
                if (result.success) {
                    showToast("Account created successfully! Welcome to ZenFlow! 🌟", "success");
                    router.replace("/(tabs)");
                } else {
                    showToast(result.error || "Google sign-in failed", "error");
                }
            } else if (response?.type === 'error') {
                showToast("Google sign-in cancelled or failed", "error");
            }
        };
        handleGoogle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);

    const onGooglePress = async () => {
        try {
            await promptAsync();
        } catch (e) {
            showToast("Unable to start Google sign-in", "error");
        }
    };

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <ScreenContainer>
                <View style={{ alignItems: 'center', marginBottom: 32 }}>
                    <Text style={{ fontSize: 40, marginBottom: 8 }}>🌟</Text>
                    <Title>Create Your Account</Title>
                    <Subtitle>Join thousands of people building better habits</Subtitle>
                </View>

                <View style={{ gap: 16 }}>
                    {/* Email Input */}
                    <View>
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 8, color: '#374151' }}>Email Address</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={{
                                backgroundColor: colors.primary,
                                borderRadius: 12,
                                padding: 16,
                                fontSize: 16,
                                fontFamily: 'Poppins_400Regular',
                                borderWidth: emailValid ? 2 : 0,
                                borderColor: emailValid ? colors.mint : 'transparent'
                            }}
                        />
                        {email.length > 0 && !emailValid && (
                            <Text style={{ color: '#EF4444', fontSize: 14, marginTop: 4, fontFamily: 'Poppins_400Regular' }}>
                                Please enter a valid email address
                            </Text>
                        )}
                    </View>

                    {/* Password Input */}
                    <View>
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 8, color: '#374151' }}>Password</Text>
                        <View style={{ position: 'relative' }}>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Create a strong password"
                                secureTextEntry={!showPass}
                                style={{
                                    backgroundColor: colors.primary,
                                    borderRadius: 12,
                                    padding: 16,
                                    paddingRight: 60,
                                    fontSize: 16,
                                    fontFamily: 'Poppins_400Regular',
                                    borderWidth: passwordValid ? 2 : 0,
                                    borderColor: passwordValid ? colors.mint : 'transparent'
                                }}
                            />
                            <Pressable
                                onPress={() => setShowPass(s => !s)}
                                style={{ position: 'absolute', right: 16, top: 16 }}
                            >
                                <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>
                                    {showPass ? 'Hide' : 'Show'}
                                </Text>
                            </Pressable>
                        </View>
                        {password.length > 0 && !passwordValid && (
                            <Text style={{ color: '#EF4444', fontSize: 14, marginTop: 4, fontFamily: 'Poppins_400Regular' }}>
                                Password must be at least 6 characters
                            </Text>
                        )}
                    </View>

                    {/* Confirm Password Input */}
                    <View>
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 8, color: '#374151' }}>Confirm Password</Text>
                        <View style={{ position: 'relative' }}>
                            <TextInput
                                value={confirm}
                                onChangeText={setConfirm}
                                placeholder="Confirm your password"
                                secureTextEntry={!showConfirmPass}
                                style={{
                                    backgroundColor: colors.primary,
                                    borderRadius: 12,
                                    padding: 16,
                                    paddingRight: 60,
                                    fontSize: 16,
                                    fontFamily: 'Poppins_400Regular',
                                    borderWidth: passwordsMatch ? 2 : 0,
                                    borderColor: passwordsMatch ? colors.mint : 'transparent'
                                }}
                            />
                            <Pressable
                                onPress={() => setShowConfirmPass(s => !s)}
                                style={{ position: 'absolute', right: 16, top: 16 }}
                            >
                                <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>
                                    {showConfirmPass ? 'Hide' : 'Show'}
                                </Text>
                            </Pressable>
                        </View>
                        {confirm.length > 0 && !passwordsMatch && (
                            <Text style={{ color: '#EF4444', fontSize: 14, marginTop: 4, fontFamily: 'Poppins_400Regular' }}>
                                Passwords do not match
                            </Text>
                        )}
                    </View>
                </View>

                <View style={{ height: 24 }} />

                <Button onPress={onSubmit} disabled={!canSubmit}>
                    {isLoading ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <ActivityIndicator size="small" color="white" />
                            <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                                Creating Account...
                            </Text>
                        </View>
                    ) : (
                        'Create Account'
                    )}
                </Button>

                <View style={{ marginVertical: 16, alignItems: 'center' }}>
                    <Text style={{ color: '#9CA3AF', fontFamily: 'Poppins_400Regular' }}>or</Text>
                </View>

                <Button onPress={onGooglePress} disabled={isLoading || !request}>
                    {isLoading ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <ActivityIndicator size="small" color="white" />
                            <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                                Connecting Google...
                            </Text>
                        </View>
                    ) : (
                        'Continue with Google'
                    )}
                </Button>

                <View style={{ marginTop: 24, alignItems: 'center' }}>
                    <Text style={{ color: '#6B7280', fontSize: 14, fontFamily: 'Poppins_400Regular', marginBottom: 8 }}>
                        Already have an account?
                    </Text>
                    <Pressable onPress={() => router.replace("/(auth)/login")}>
                        <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                            Sign In Instead
                        </Text>
                    </Pressable>
                </View>
            </ScreenContainer>
        </ScrollView>
    );
}
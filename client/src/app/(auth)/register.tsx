import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View, ActivityIndicator, ScrollView, StatusBar } from "react-native";
import { ScreenContainer, Title, Button, Subtitle, colors, SocialButton, Input } from "../../components/ui";
import { useRouter } from "expo-router";
import { useToast } from "../../context/ToastContext";
import { useOnboarding } from "../../context/OnboardingContext";
import { useAuth } from "../../context/AuthContext";
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import { makeRedirectUri } from "expo-auth-session"
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

export default function Register() {
    const router = useRouter();
    const { showToast } = useToast();
    const { answers } = useOnboarding();
    const { register, loginWithGoogle, loginWithApple, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const redirectUri = makeRedirectUri({ useProxy: false });
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: "746039886902-nh57ar0unrl0a1bnc7ktj363855oljh9.apps.googleusercontent.com",
        androidClientId: "746039886902-5vlmhjn76mgoopgfru5l7q51t6c0j7ep.apps.googleusercontent.com",
        webClientId: "746039886902-86q24v8m81r1fg2hp2l3j386b2iplad7.apps.googleusercontent.com",
        scopes: ["profile", "email"],
        responseType: "id_token",
        redirectUri,
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
            const idToken = (response as any)?.authentication?.idToken || (response as any)?.params?.id_token;
            if (response?.type === 'success' && idToken) {
                const result = await loginWithGoogle(idToken);
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
            await promptAsync({ useProxy: false, redirectUri });
        } catch (e) {
            showToast("Unable to start Google sign-in", "error");
        }
    };

    const onApplePress = async () => {
        try {
            if (Platform.OS !== 'ios') {
                showToast("Apple Sign-In is only available on iOS", "error");
                return;
            }

            const rawNonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
                nonce: rawNonce,
            });

            if (credential.identityToken) {
                const result = await loginWithApple(
                    credential.identityToken,
                    rawNonce,
                    credential.fullName?.givenName,
                    credential.fullName?.familyName,
                    credential.email
                );

                if (result.success) {
                    showToast("Account created successfully! Welcome to ZenFlow! 🌟", "success");
                    router.replace("/(tabs)");
                } else {
                    showToast(result.error || "Apple sign-in failed", "error");
                }
            }
        } catch (e: any) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
                showToast("Apple sign-in cancelled", "error");
            } else {
                showToast("Unable to start Apple sign-in", "error");
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 24 }}>
                    {/* Header */}
                    <View style={{ alignItems: 'center', marginBottom: 40 }}>
                        <View style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: colors.purple,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 24,
                            shadowColor: colors.purple,
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.3,
                            shadowRadius: 16,
                            elevation: 8
                        }}>
                            <Text style={{ fontSize: 36 }}>🌟</Text>
                        </View>
                        <Title style={{ textAlign: 'center', marginBottom: 8 }}>Create Your Account</Title>
                        <Subtitle style={{ textAlign: 'center', fontSize: 16 }}>Join thousands of people building better habits</Subtitle>
                    </View>

                    {/* Form */}
                    <View style={{ gap: 20, marginBottom: 24 }}>
                        {/* Email Input */}
                        <View>
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 8, color: '#374151' }}>
                                Email Address
                            </Text>
                            <Input
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                valid={emailValid}
                                error={email.length > 0 && !emailValid ? "Please enter a valid email address" : undefined}
                            />
                        </View>

                        {/* Password Input */}
                        <View>
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 8, color: '#374151' }}>
                                Password
                            </Text>
                            <Input
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Create a strong password"
                                secureTextEntry={!showPass}
                                valid={passwordValid}
                                error={password.length > 0 && !passwordValid ? "Password must be at least 6 characters" : undefined}
                                showPasswordToggle={true}
                                onTogglePassword={() => setShowPass(s => !s)}
                            />
                        </View>

                        {/* Confirm Password Input */}
                        <View>
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 8, color: '#374151' }}>
                                Confirm Password
                            </Text>
                            <Input
                                value={confirm}
                                onChangeText={setConfirm}
                                placeholder="Confirm your password"
                                secureTextEntry={!showConfirmPass}
                                valid={passwordsMatch}
                                error={confirm.length > 0 && !passwordsMatch ? "Passwords do not match" : undefined}
                                showPasswordToggle={true}
                                onTogglePassword={() => setShowConfirmPass(s => !s)}
                            />
                        </View>
                    </View>

                    {/* Create Account Button */}
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

                    {/* Divider */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 32 }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
                        <Text style={{ color: '#9CA3AF', fontFamily: 'Poppins_400Regular', marginHorizontal: 16 }}>
                            or continue with
                        </Text>
                        <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
                    </View>

                    {/* Social Login Buttons */}
                    <View style={{ gap: 12, marginBottom: 32 }}>
                        <SocialButton
                            variant="google"
                            onPress={onGooglePress}
                            disabled={isLoading || !request}
                            loading={isLoading}
                        >
                            Continue with Google
                        </SocialButton>

                        {Platform.OS === 'ios' && (
                            <SocialButton
                                variant="apple"
                                onPress={onApplePress}
                                disabled={isLoading}
                                loading={isLoading}
                            >
                                Continue with Apple
                            </SocialButton>
                        )}
                    </View>

                    {/* Sign In Link */}
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: '#6B7280', fontSize: 14, fontFamily: 'Poppins_400Regular', marginBottom: 8 }}>
                            Already have an account?
                        </Text>
                        <Pressable onPress={() => router.replace("/(auth)/login")}>
                            <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                                Sign In Instead
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View, ActivityIndicator, ScrollView, StatusBar } from "react-native";
import { ScreenContainer, Title, Button, Subtitle, colors, SocialButton } from "../../components/ui";
import { useRouter } from "expo-router";
import { useToast } from "../../context/ToastContext";
import { useOnboarding } from "../../context/OnboardingContext";
import { useAuth } from "../../context/AuthContext";
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import { makeRedirectUri } from "expo-auth-session"
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

export default function Register() {
    const router = useRouter();
    const { showToast } = useToast();
    const { answers } = useOnboarding();
    const { register, loginWithGoogle, loginWithApple, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const redirectUri = makeRedirectUri();
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
    const canSubmit = emailValid && passwordValid && agreeToTerms && !isLoading;

    const onSubmit = async () => {
        if (!canSubmit) {
            if (!emailValid) showToast("Please enter a valid email address", "error");
            else if (!passwordValid) showToast("Password must be at least 6 characters", "error");
            else if (!agreeToTerms) showToast("Please agree to the Terms & Conditions and Privacy Policy", "error");
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
            await promptAsync();
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
                    credential.fullName?.givenName || undefined,
                    credential.fullName?.familyName || undefined,
                    credential.email || undefined
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
        <LinearGradient
            colors={['#FFF9F0', '#E8E4F3', '#FFF9F0']}
            style={{ flex: 1 }}
        >
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 60 }}>
                    {/* Back Button */}
                    <Pressable
                        onPress={() => router.back()}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 40
                        }}
                    >
                        <Ionicons name="chevron-back-outline" size={20} color="#6B7280" />
                    </Pressable>

                    {/* Title */}
                    <View style={{ alignItems: 'center', marginBottom: 40 }}>
                        <Text style={{
                            fontFamily: 'Poppins_700Bold',
                            fontSize: 28,
                            color: '#111827',
                            textAlign: 'center',
                            marginBottom: 20
                        }}>
                            Let's create your Perfect Day!
                        </Text>
                    </View>

                    {/* Input Fields */}
                    <View style={{ gap: 20, marginBottom: 30 }}>
                        {/* Email Input */}
                        <View>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Email"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 16,
                                    padding: 20,
                                    fontSize: 16,
                                    fontFamily: 'Poppins_400Regular',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 4
                                }}
                            />
                            {email.length > 0 && !emailValid && (
                                <Text style={{ color: '#EF4444', fontSize: 14, marginTop: 8, fontFamily: 'Poppins_400Regular' }}>
                                    Please enter a valid email address
                                </Text>
                            )}
                        </View>

                        {/* Password Input */}
                        <View>
                            <View style={{ position: 'relative' }}>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Password"
                                    secureTextEntry={!showPass}
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: 16,
                                        padding: 20,
                                        paddingRight: 60,
                                        fontSize: 16,
                                        fontFamily: 'Poppins_400Regular',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 4
                                    }}
                                />
                                <Pressable
                                    onPress={() => setShowPass(s => !s)}
                                    style={{ position: 'absolute', right: 20, top: 20 }}
                                >
                                    <Ionicons
                                        name={showPass ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#6B7280"
                                    />
                                </Pressable>
                            </View>
                            {password.length > 0 && !passwordValid && (
                                <Text style={{ color: '#EF4444', fontSize: 14, marginTop: 8, fontFamily: 'Poppins_400Regular' }}>
                                    Password must be at least 6 characters
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Terms Agreement */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 30 }}>
                        <Pressable
                            onPress={() => setAgreeToTerms(!agreeToTerms)}
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: 4,
                                borderWidth: 2,
                                borderColor: agreeToTerms ? '#6B46C1' : '#D1D5DB',
                                backgroundColor: agreeToTerms ? '#6B46C1' : 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 12,
                                marginTop: 2
                            }}
                        >
                            {agreeToTerms && (
                                <Ionicons name="checkmark" size={12} color="white" />
                            )}
                        </Pressable>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#111827', lineHeight: 20 }}>
                                I agree to the{' '}
                                <Pressable onPress={() => router.push('/(settings)/terms')}>
                                    <Text style={{ color: '#6B46C1', fontFamily: 'Poppins_600SemiBold' }}>Terms & Conditions</Text>
                                </Pressable>
                                {' '}and{' '}
                                <Pressable onPress={() => router.push('/(settings)/privacy')}>
                                    <Text style={{ color: '#6B46C1', fontFamily: 'Poppins_600SemiBold' }}>Privacy Policy</Text>
                                </Pressable>
                            </Text>
                        </View>
                    </View>

                    {/* Create Account Button */}
                    <Pressable
                        onPress={onSubmit}
                        disabled={!canSubmit}
                        style={{
                            backgroundColor: canSubmit ? '#111827' : '#9CA3AF',
                            borderRadius: 16,
                            padding: 20,
                            alignItems: 'center',
                            marginBottom: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 4
                        }}
                    >
                        {isLoading ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <ActivityIndicator size="small" color="white" />
                                <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                                    Creating Account...
                                </Text>
                            </View>
                        ) : (
                            <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                                Create Account
                            </Text>
                        )}
                    </Pressable>

                    {/* Google Button */}
                    <SocialButton
                        variant="google"
                        onPress={onGooglePress}
                        disabled={isLoading || !request}
                        loading={isLoading}
                    >
                        Continue with Google
                    </SocialButton>

                    {/* Apple Button (iOS only) */}
                    {Platform.OS === 'ios' && (
                        <>
                            <View style={{ marginVertical: 16, alignItems: 'center' }}>
                                <Text style={{ color: '#9CA3AF', fontFamily: 'Poppins_400Regular' }}>or</Text>
                            </View>
                            <SocialButton
                                variant="apple"
                                onPress={onApplePress}
                                disabled={isLoading}
                                loading={isLoading}
                            >
                                Continue with Apple
                            </SocialButton>
                        </>
                    )}

                    {/* Login Link */}
                    <View style={{ alignItems: 'center', marginBottom: 30 }}>
                        <Text style={{ color: '#6B7280', fontSize: 14, fontFamily: 'Poppins_400Regular', marginBottom: 8 }}>
                            Already have an account?
                        </Text>
                        <Pressable onPress={() => router.replace("/(auth)/login")}>
                            <Text style={{ color: '#6B46C1', fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                                Log In
                            </Text>
                        </Pressable>
                    </View>

                    {/* Footer Links */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20 }}>
                        <Pressable onPress={() => router.push('/(settings)/terms')}>
                            <Text style={{ color: '#9CA3AF', fontSize: 12, fontFamily: 'Poppins_400Regular' }}>
                                Terms & Conditions
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => router.push('/(settings)/privacy')}>
                            <Text style={{ color: '#9CA3AF', fontSize: 12, fontFamily: 'Poppins_400Regular' }}>
                                Privacy Policy
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}
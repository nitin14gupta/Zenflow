import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View, ActivityIndicator, ScrollView } from "react-native";
import { ScreenContainer, Title, Button, Subtitle, colors, SocialButton } from "../../components/ui";
import { useRouter } from "expo-router";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    const router = useRouter();
    const { showToast } = useToast();
    const { login, loginWithGoogle, loginWithApple, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

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
    const canSubmit = emailValid && passwordValid && !isLoading;

    const onSubmit = async () => {
        if (!canSubmit) {
            if (!emailValid) showToast("Please enter a valid email address", "error");
            else if (!passwordValid) showToast("Password must be at least 6 characters", "error");
            return;
        }

        const result = await login(email, password);

        if (result.success) {
            showToast("Welcome back! 🎉", "success");
            router.replace("/(tabs)");
        } else {
            showToast(result.error || "Invalid credentials", "error");
        }
    };

    useEffect(() => {
        const handleGoogle = async () => {
            const idToken = (response as any)?.authentication?.idToken || (response as any)?.params?.id_token;
            if (response?.type === 'success' && idToken) {
                const result = await loginWithGoogle(idToken);
                if (result.success) {
                    showToast("Welcome back! 🎉", "success");
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
                    showToast("Welcome back! 🎉", "success");
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
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <ScreenContainer>
                <View style={{ alignItems: 'center', marginBottom: 32 }}>
                    <Text style={{ fontSize: 40, marginBottom: 8 }}>👋</Text>
                    <Title>Welcome Back</Title>
                    <Subtitle>Sign in to continue your journey</Subtitle>
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
                                placeholder="Enter your password"
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
                </View>

                <View style={{ marginTop: 16, alignItems: 'flex-end' }}>
                    <Pressable onPress={() => router.push("/(auth)/forgot")}>
                        <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>
                            Forgot Password?
                        </Text>
                    </Pressable>
                </View>

                <View style={{ height: 24 }} />

                <Button onPress={onSubmit} disabled={!canSubmit}>
                    {isLoading ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <ActivityIndicator size="small" color="white" />
                            <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                                Signing In...
                            </Text>
                        </View>
                    ) : (
                        'Sign In'
                    )}
                </Button>

                <View style={{ marginVertical: 16, alignItems: 'center' }}>
                    <Text style={{ color: '#9CA3AF', fontFamily: 'Poppins_400Regular' }}>or</Text>
                </View>

                <SocialButton
                    variant="google"
                    onPress={onGooglePress}
                    disabled={isLoading || !request}
                    loading={isLoading}
                >
                    Continue with Google
                </SocialButton>

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

                <View style={{ marginTop: 24, alignItems: 'center' }}>
                    <Text style={{ color: '#6B7280', fontSize: 14, fontFamily: 'Poppins_400Regular', marginBottom: 8 }}>
                        Don't have an account?
                    </Text>
                    <Pressable onPress={() => router.replace("/(onboarding)/age")}>
                        <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                            Create Account
                        </Text>
                    </Pressable>
                </View>
            </ScreenContainer>
        </ScrollView>
    );
}
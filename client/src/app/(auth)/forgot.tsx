import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View, ActivityIndicator, ScrollView } from "react-native";
import { ScreenContainer, Title, Button, Subtitle, colors } from "../../components/ui";
import { useRouter } from "expo-router";
import { useToast } from "../../context/ToastContext";
import apiService from "../../api/apiService";

export default function Forgot() {
    const router = useRouter();
    const { showToast } = useToast();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
    const canSubmit = emailValid && !isLoading;

    const onSubmit = async () => {
        if (!canSubmit) {
            if (!emailValid) showToast("Please enter a valid email address", "error");
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiService.forgotPassword(email);

            if (response.success) {
                setEmailSent(true);
                showToast("Reset link sent to your email! 📧", "success");
            } else {
                showToast(response.error || "Failed to send reset link", "error");
            }
        } catch (error) {
            showToast("Network error. Please check your connection.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <ScreenContainer>
                    <View style={{ alignItems: 'center', marginBottom: 32 }}>
                        <Text style={{ fontSize: 60, marginBottom: 16 }}>📧</Text>
                        <Title>Check Your Email</Title>
                        <Subtitle>We've sent a password reset link to {email}</Subtitle>
                    </View>

                    <View style={{ backgroundColor: colors.mint, padding: 20, borderRadius: 12, marginBottom: 24 }}>
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: '#374151', marginBottom: 8 }}>
                            What's Next?
                        </Text>
                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#374151', lineHeight: 20 }}>
                            1. Check your email inbox (and spam folder){'\n'}
                            2. Click the reset link in the email{'\n'}
                            3. Create a new password{'\n'}
                            4. Sign in with your new password
                        </Text>
                    </View>

                    <Button onPress={() => router.replace("/(auth)/login")}>
                        Back to Sign In
                    </Button>

                    <View style={{ marginTop: 16, alignItems: 'center' }}>
                        <Pressable onPress={() => setEmailSent(false)}>
                            <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>
                                Try Different Email
                            </Text>
                        </Pressable>
                    </View>
                </ScreenContainer>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <ScreenContainer>
                <View style={{ alignItems: 'center', marginBottom: 32 }}>
                    <Text style={{ fontSize: 40, marginBottom: 8 }}>🔐</Text>
                    <Title>Reset Password</Title>
                    <Subtitle>Enter your email and we'll send you a reset link</Subtitle>
                </View>

                <View>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 8, color: '#374151' }}>Email Address</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email address"
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

                <View style={{ height: 24 }} />

                <Button onPress={onSubmit} disabled={!canSubmit}>
                    {isLoading ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <ActivityIndicator size="small" color="white" />
                            <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                                Sending...
                            </Text>
                        </View>
                    ) : (
                        'Send Reset Link'
                    )}
                </Button>

                <View style={{ marginTop: 24, alignItems: 'center' }}>
                    <Text style={{ color: '#6B7280', fontSize: 14, fontFamily: 'Poppins_400Regular', marginBottom: 8 }}>
                        Remember your password?
                    </Text>
                    <Pressable onPress={() => router.replace("/(auth)/login")}>
                        <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                            Back to Sign In
                        </Text>
                    </Pressable>
                </View>
            </ScreenContainer>
        </ScrollView>
    );
}



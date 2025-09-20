import React, { useMemo, useState } from "react";
import { Pressable, Text, View, ActivityIndicator, ScrollView, StatusBar } from "react-native";
import { ScreenContainer, Title, Button, Subtitle, colors, Input } from "../../components/ui";
import { useRouter } from "expo-router";
import { useToast } from "../../context/ToastContext";
import apiService from "../../api/apiService";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Forgot() {
    const router = useRouter();
    const { showToast } = useToast();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1=email, 2=code, 3=new password
    const [code, setCode] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [newPassword, setNewPassword] = useState("");

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
                setStep(2);
                showToast("Verification code sent to your email! 📧", "success");
            } else {
                showToast(response.error || "Failed to send reset link", "error");
            }
        } catch (error) {
            showToast("Network error. Please check your connection.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const onVerifyCode = () => {
        if (code.trim().length !== 6) {
            showToast("Please enter the 6-digit code", "error");
            return;
        }
        setStep(3);
    };

    const onResetPassword = async () => {
        if (newPassword.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }
        setIsLoading(true);
        try {
            const response = await apiService.resetPasswordWithCode(email, code.trim(), newPassword);
            if (response.success) {
                showToast("Password reset successfully", "success");
                router.replace("/(auth)/login");
            } else {
                showToast(response.error || "Failed to reset password", "error");
            }
        } catch (error) {
            showToast("Network error. Please check your connection.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
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
                                <Text style={{ fontSize: 36 }}>📧</Text>
                            </View>
                            <Title>
                                {step === 2 ? 'Enter Verification Code' : 'Set New Password'}
                            </Title>
                            <Subtitle>
                                {step === 2 ? `We sent a 6-digit code to ${email}` : 'Enter a new password for your account'}
                            </Subtitle>
                        </View>

                        {step === 2 && (
                            <View style={{ marginBottom: 24 }}>
                                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 8, color: '#374151' }}>
                                    Verification Code
                                </Text>
                                <Input
                                    value={code}
                                    onChangeText={setCode}
                                    placeholder="Enter 6-digit code"
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    style={{ marginBottom: 24 }}
                                />
                                <Button onPress={onVerifyCode}>Continue</Button>
                            </View>
                        )}

                        {step === 3 && (
                            <View style={{ marginBottom: 24 }}>
                                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 8, color: '#374151' }}>
                                    New Password
                                </Text>
                                <Input
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    placeholder="Enter new password"
                                    secureTextEntry
                                    style={{ marginBottom: 24 }}
                                />
                                <Button onPress={onResetPassword} disabled={isLoading}>
                                    {isLoading ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            <ActivityIndicator size="small" color="white" />
                                            <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                                                Saving...
                                            </Text>
                                        </View>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </Button>
                            </View>
                        )}

                        {/* Action Links */}
                        <View style={{ gap: 16, alignItems: 'center' }}>
                            {step === 2 && (
                                <Pressable onPress={onSubmit}>
                                    <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>
                                        Resend Code
                                    </Text>
                                </Pressable>
                            )}

                            <Pressable onPress={() => setEmailSent(false)}>
                                <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>
                                    Try Different Email
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

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
                            <Text style={{ fontSize: 36 }}>🔐</Text>
                        </View>
                        <Title style={{ textAlign: 'center', marginBottom: 8 }}>Reset Password</Title>
                        <Subtitle style={{ textAlign: 'center', fontSize: 16 }}>Enter your email and we'll send you a reset link</Subtitle>
                    </View>

                    {/* Form */}
                    <View style={{ marginBottom: 32 }}>
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 8, color: '#374151' }}>
                            Email Address
                        </Text>
                        <Input
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email address"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            valid={emailValid}
                            error={email.length > 0 && !emailValid ? "Please enter a valid email address" : undefined}
                        />
                    </View>

                    {/* Send Reset Link Button */}
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

                    {/* Back to Sign In Link */}
                    <View style={{ marginTop: 32, alignItems: 'center' }}>
                        <Text style={{ color: '#6B7280', fontSize: 14, fontFamily: 'Poppins_400Regular', marginBottom: 8 }}>
                            Remember your password?
                        </Text>
                        <Pressable onPress={() => router.replace("/(auth)/login")}>
                            <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                                Back to Sign In
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}



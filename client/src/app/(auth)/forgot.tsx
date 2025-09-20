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
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <ScreenContainer>
                    <View style={{ alignItems: 'center', marginBottom: 32 }}>
                        <Text style={{ fontSize: 60, marginBottom: 16 }}>📧</Text>
                        <Title>{step === 2 ? 'Enter Verification Code' : 'Set New Password'}</Title>
                        <Subtitle>
                            {step === 2 ? `We sent a 6-digit code to ${email}` : 'Enter a new password for your account'}
                        </Subtitle>
                    </View>

                    {step === 2 && (
                        <View>
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 8, color: '#374151' }}>Verification Code</Text>
                            <TextInput
                                value={code}
                                onChangeText={setCode}
                                placeholder="Enter 6-digit code"
                                keyboardType="number-pad"
                                maxLength={6}
                                style={{
                                    backgroundColor: colors.primary,
                                    borderRadius: 12,
                                    padding: 16,
                                    fontSize: 18,
                                    letterSpacing: 4,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins_600SemiBold'
                                }}
                            />
                            <View style={{ height: 24 }} />
                            <Button onPress={onVerifyCode}>Continue</Button>
                        </View>
                    )}

                    {step === 3 && (
                        <View>
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 8, color: '#374151' }}>New Password</Text>
                            <TextInput
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="Enter new password"
                                secureTextEntry
                                style={{
                                    backgroundColor: colors.primary,
                                    borderRadius: 12,
                                    padding: 16,
                                    fontSize: 16,
                                    fontFamily: 'Poppins_400Regular'
                                }}
                            />
                            <View style={{ height: 24 }} />
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

                    {step === 2 && (
                        <View style={{ marginTop: 16, alignItems: 'center' }}>
                            <Pressable onPress={onSubmit}>
                                <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>
                                    Resend Code
                                </Text>
                            </Pressable>
                        </View>
                    )}

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
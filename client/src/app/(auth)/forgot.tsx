import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { ScreenContainer, Title, Button, Subtitle, colors } from "../../components/ui";
import { useRouter } from "expo-router";
import { useToast } from "../../context/ToastContext";

export default function Forgot() {
    const router = useRouter();
    const { show } = useToast();
    const [email, setEmail] = useState("");
    const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);

    const onSubmit = () => {
        if (!emailValid) return show("Enter a valid email", "error");
        show("Reset link sent!", "success");
        router.replace("/(auth)/login");
    };

    return (
        <ScreenContainer>
            <Title>Reset Password</Title>
            <Subtitle>Enter your email and we'll send you a reset link</Subtitle>
            <View style={{ marginTop: 16 }}>
                <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={{ backgroundColor: colors.primary, borderRadius: 12, padding: 12 }} />
            </View>
            <View style={{ height: 12 }} />
            <Button onPress={onSubmit}>Send Reset Link</Button>
            <View style={{ marginTop: 12, alignItems: 'center' }}>
                <Pressable onPress={() => router.replace("/(auth)/login")}>
                    <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold' }}>Back to Sign In</Text>
                </Pressable>
            </View>
        </ScreenContainer>
    );
}



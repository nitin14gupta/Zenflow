import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { ScreenContainer, Title, Button, colors } from "../../components/ui";
import { useRouter } from "expo-router";
import { useToast } from "../../context/ToastContext";

export default function Login() {
    const router = useRouter();
    const { show } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
    const canSubmit = emailValid && password.length >= 6;

    const onSubmit = () => {
        if (!canSubmit) return show("Invalid credentials", "error");
        show("Signed in!", "success");
        router.replace("/(tabs)");
    };

    return (
        <ScreenContainer>
            <Title>Welcome Back</Title>
            <View style={{ marginTop: 16, gap: 12 }}>
                <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={{ backgroundColor: colors.primary, borderRadius: 12, padding: 12 }} />
                <View style={{ position: 'relative' }}>
                    <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry={!showPass} style={{ backgroundColor: colors.primary, borderRadius: 12, padding: 12, paddingRight: 48 }} />
                    <Pressable onPress={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: 12 }}>
                        <Text style={{ color: colors.purple }}>{showPass ? 'Hide' : 'Show'}</Text>
                    </Pressable>
                </View>
            </View>
            <View style={{ marginTop: 8, alignItems: 'flex-end' }}>
                <Pressable onPress={() => router.push("/")}>
                    <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold' }}>Forgot Password?</Text>
                </Pressable>
            </View>
            <View style={{ height: 12 }} />
            <Button onPress={onSubmit}>Sign In</Button>
            <View style={{ marginTop: 12, alignItems: 'center' }}>
                <Pressable onPress={() => router.replace("/(auth)/register")}>
                    <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold' }}>Don't have an account? Sign Up</Text>
                </Pressable>
            </View>
        </ScreenContainer>
    );
}



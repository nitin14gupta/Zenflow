import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { ScreenContainer, Title, Button, Subtitle, colors } from "../../components/ui";
import { useRouter } from "expo-router";
import { useToast } from "../../context/ToastContext";

export default function Register() {
    const router = useRouter();
    const { show } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPass, setShowPass] = useState(false);

    const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
    const canSubmit = emailValid && password.length >= 6 && password === confirm;

    const onSubmit = () => {
        if (!canSubmit) {
            show("Please fill all fields correctly", "error");
            return;
        }
        show("Account created!", "success");
        router.replace("/(tabs)");
    };

    return (
        <ScreenContainer>
            <Title>Create Your Account</Title>
            <View style={{ marginTop: 16, gap: 12 }}>
                <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={{ backgroundColor: colors.primary, borderRadius: 12, padding: 12 }} />
                <View style={{ position: 'relative' }}>
                    <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry={!showPass} style={{ backgroundColor: colors.primary, borderRadius: 12, padding: 12, paddingRight: 48 }} />
                    <Pressable onPress={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: 12 }}>
                        <Text style={{ color: colors.purple }}>{showPass ? 'Hide' : 'Show'}</Text>
                    </Pressable>
                </View>
                <TextInput value={confirm} onChangeText={setConfirm} placeholder="Confirm Password" secureTextEntry={!showPass} style={{ backgroundColor: colors.primary, borderRadius: 12, padding: 12 }} />
            </View>
            <View style={{ height: 16 }} />
            <Button onPress={onSubmit}>Create Account</Button>
            <View style={{ marginTop: 12, alignItems: 'center' }}>
                <Pressable onPress={() => router.replace("/(auth)/login")}><Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold' }}>Already have an account? Sign In</Text></Pressable>
            </View>
        </ScreenContainer>
    );
}



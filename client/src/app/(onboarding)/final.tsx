import React, { useEffect, useRef } from "react";
import { Text, View, Pressable } from "react-native";
import { Button, ProgressBar, ScreenContainer, Title, Subtitle, colors } from "../../components/ui";
import ConfettiCannon from "react-native-confetti-cannon";
import { useRouter } from "expo-router";

export default function Final() {
    const router = useRouter();
    const confettiRef = useRef<ConfettiCannon | null>(null);
    useEffect(() => {
        const t = setTimeout(() => {
            // Navigate to signup after 3 seconds if no interaction
            router.replace("/(auth)/register");
        }, 3000);
        setTimeout(() => confettiRef.current?.start?.(), 100);
        return () => clearTimeout(t);
    }, [router]);

    return (
        <ScreenContainer>
            <ProgressBar progress={19 / 19} />
            <View style={{ alignItems: 'center', marginTop: 16 }}>
                <Text style={{ fontSize: 48, marginBottom: 8 }}>🎉</Text>
                <Title>You’re all set!</Title>
                <Subtitle>Create your account to save progress and unlock your plan.</Subtitle>
            </View>
            <View style={{ flex: 1 }} />
            <View style={{ gap: 12 }}>
                <Button onPress={() => router.replace("/(auth)/register")}>Create Account</Button>
                <Button variant="secondary" onPress={() => router.replace("/(auth)/login")}>I already have an account</Button>
            </View>
            <ConfettiCannon ref={confettiRef as any} count={150} origin={{ x: 0, y: 0 }} fadeOut autoStart={false} />
        </ScreenContainer>
    );
}



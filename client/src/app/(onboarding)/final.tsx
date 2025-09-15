import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { Button, ProgressBar, ScreenContainer, Title } from "../../components/ui";
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
            <View style={{ alignItems: 'center', marginTop: 24 }}>
                <Title>Are you ready?</Title>
            </View>
            <View style={{ flex: 1 }} />
            <Button onPress={() => router.replace("/(auth)/register")}>Let's Go!</Button>
            <ConfettiCannon ref={confettiRef as any} count={150} origin={{ x: 0, y: 0 }} fadeOut autoStart={false} />
        </ScreenContainer>
    );
}



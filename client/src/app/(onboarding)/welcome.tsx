import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { Button, ProgressBar, ScreenContainer, Subtitle, Title } from "../../components/ui";
import { useRouter } from "expo-router";

export default function Welcome() {
    const router = useRouter();
    const bounce = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounce, { toValue: -6, duration: 500, useNativeDriver: true }),
                Animated.timing(bounce, { toValue: 0, duration: 500, useNativeDriver: true }),
            ])
        ).start();
    }, [bounce]);

    return (
        <ScreenContainer>
            <ProgressBar progress={3 / 19} />
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <Animated.Text style={{ transform: [{ translateY: bounce }], fontSize: 40 }}>😇</Animated.Text>
            </View>
            <Title>Yay, glad you are here!</Title>
            <Subtitle>We'll help you with self-growth. First, let's dive into your personality and tailor your personal plan.</Subtitle>
            <View style={{ flex: 1 }} />
            <Button onPress={() => router.push("/(onboarding)/sleep")}>Continue</Button>
        </ScreenContainer>
    );
}



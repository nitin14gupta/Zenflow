import React from "react";
import { Image, Text, View } from "react-native";
import { Button, ProgressBar, ScreenContainer, Subtitle, Title } from "../../components/ui";
import { useRouter } from "expo-router";

export default function Statistics() {
    const router = useRouter();
    return (
        <ScreenContainer>
            <ProgressBar progress={12 / 19} />
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <Image source={require("../../../assets/images/favicon.png")} style={{ width: 40, height: 40, borderRadius: 8, marginBottom: 8 }} />
            </View>
            <Title>Build Good Habits and Have More Great Days!</Title>
            <Subtitle>Good habits will help you reach your goals, develop both personally and professionally, and feel fulfilled. According to statistics, 86% of ZenFlow users responded that building good habits makes them happier and have more great days.</Subtitle>
            <View style={{ flex: 1 }} />
            <Button onPress={() => router.push("/(onboarding)/desires")}>Continue</Button>
        </ScreenContainer>
    );
}



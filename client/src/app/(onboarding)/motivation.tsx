import React from "react";
import { Image, Text, View } from "react-native";
import { Button, ProgressBar, ScreenContainer, Subtitle, Title } from "../../components/ui";
import { useRouter } from "expo-router";

export default function Motivation() {
    const router = useRouter();
    return (
        <ScreenContainer>
            <ProgressBar progress={9 / 19} />
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View style={{ width: '100%', height: 160, backgroundColor: '#E5E7EB', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Poppins_400Regular', color: '#6B7280' }}>Chart Placeholder</Text>
                </View>
            </View>
            <Title>Motivation is your key to success!</Title>
            <Subtitle>You're twice as motivated when you see your goals clearly. So use your growth plan to keep them in focus even when the going gets tough.</Subtitle>
            <View style={{ flex: 1 }} />
            <Button onPress={() => router.push("/(onboarding)/distractions")}>Continue</Button>
        </ScreenContainer>
    );
}



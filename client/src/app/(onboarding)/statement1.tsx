import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { ProgressBar, ScreenContainer, Subtitle, Title } from "../../components/ui";
import { useRouter } from "expo-router";

export default function Statement1() {
    const router = useRouter();
    useEffect(() => {
        const t = setTimeout(() => router.push("/(onboarding)/statement2"), 1500);
        return () => clearTimeout(t);
    }, [router]);
    return (
        <ScreenContainer>
            <ProgressBar progress={14 / 19} />
            <Title>Do you relate to this statement?</Title>
            <Subtitle>😰 I feel anxious when I have a lot to do and don't know where to start.</Subtitle>
            <View style={{ flex: 1 }} />
        </ScreenContainer>
    );
}



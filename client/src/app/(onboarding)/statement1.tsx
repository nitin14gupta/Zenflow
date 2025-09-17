import React from "react";
import { Text, View } from "react-native";
import { Button, ProgressBar, ScreenContainer, Subtitle, Title } from "../../components/ui";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../context/OnboardingContext";

export default function Statement1() {
    const router = useRouter();
    const { setAnswer, answers } = useOnboarding();
    const onPick = (yes: boolean) => {
        const next = { ...(answers.statements || {}), s1: yes };
        setAnswer("statements", next);
        router.push("/(onboarding)/statement2");
    };
    return (
        <ScreenContainer>
            <ProgressBar progress={14 / 19} />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ alignItems: 'center', paddingHorizontal: 8 }}>
                    <Title>Do you relate to this statement?</Title>
                    <Subtitle>😰 I feel anxious when I have a lot to do and don't know where to start.</Subtitle>
                </View>
            </View>
            <View style={{ gap: 12 }}>
                <Button variant="secondary" onPress={() => onPick(false)}>No</Button>
                <Button onPress={() => onPick(true)}>Yes</Button>
            </View>
        </ScreenContainer>
    );
}



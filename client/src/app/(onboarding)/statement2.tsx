import React from "react";
import { View } from "react-native";
import { Button, ProgressBar, ScreenContainer, Subtitle, Title } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";

export default function Statement2() {
    const router = useRouter();
    const { setAnswer, answers } = useOnboarding();
    const onPick = (yes: boolean) => {
        const next = { ...(answers.statements || {}), s2: yes };
        setAnswer("statements", next);
        router.push("/(onboarding)/statement3");
    };
    return (
        <ScreenContainer>
            <ProgressBar progress={15 / 19} />
            <Title>Do you relate to this statement?</Title>
            <Subtitle>😪 I always feel like there is not enough time</Subtitle>
            <View style={{ flex: 1 }} />
            <View style={{ gap: 12 }}>
                <Button variant="secondary" onPress={() => onPick(false)}>No</Button>
                <Button onPress={() => onPick(true)}>Yes</Button>
            </View>
        </ScreenContainer>
    );
}



import React from "react";
import { View } from "react-native";
import { Button, ProgressBar, ScreenContainer, Subtitle, Title } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";

export default function Statement4() {
    const router = useRouter();
    const { setAnswer, answers } = useOnboarding();
    const onPick = (yes: boolean) => {
        const next = { ...(answers.statements || {}), s4: yes };
        setAnswer("statements", next);
        router.push("/(onboarding)/ready");
    };
    return (
        <ScreenContainer>
            <ProgressBar progress={17 / 19} />
            <Title>Do you relate to this statement?</Title>
            <Subtitle>😥 At the end of the day, I regret that I could have done more things</Subtitle>
            <View style={{ flex: 1 }} />
            <View style={{ gap: 12 }}>
                <Button variant="secondary" onPress={() => onPick(false)}>No</Button>
                <Button onPress={() => onPick(true)}>Yes</Button>
            </View>
        </ScreenContainer>
    );
}



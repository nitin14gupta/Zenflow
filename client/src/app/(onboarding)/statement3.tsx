import React from "react";
import { View } from "react-native";
import { Button, ProgressBar, ScreenContainer, Subtitle, Title } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";

export default function Statement3() {
    const router = useRouter();
    const { setAnswer, answers } = useOnboarding();
    const onPick = (yes: boolean) => {
        const next = { ...(answers.statements || {}), s3: yes };
        setAnswer("statements", next);
        router.push("/(onboarding)/statement4");
    };
    return (
        <ScreenContainer>
            <ProgressBar progress={16 / 19} />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ alignItems: 'center', paddingHorizontal: 8 }}>
                    <Title>Do you relate to this statement?</Title>
                    <Subtitle>🫣 I have trouble concentrating on one thing. There's always something else to distract me</Subtitle>
                </View>
            </View>
            <View style={{ gap: 12 }}>
                <Button variant="secondary" onPress={() => onPick(false)}>No</Button>
                <Button onPress={() => onPick(true)}>Yes</Button>
            </View>
        </ScreenContainer>
    );
}



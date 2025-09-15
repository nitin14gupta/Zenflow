import React, { useState } from "react";
import { View } from "react-native";
import { Button, CardOption, ProgressBar, ScreenContainer, Title } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";

const OPTIONS = ["Less than 6 hours", "6-8 hours", "8-10 hours", "More than 10 hours"];

export default function Sleep() {
    const { setAnswer, answers } = useOnboarding();
    const [selected, setSelected] = useState<string | undefined>(answers.sleep);
    const router = useRouter();
    const onNext = () => {
        if (!selected) return;
        setAnswer("sleep", selected);
        router.push("/(onboarding)/morning");
    };
    return (
        <ScreenContainer>
            <ProgressBar progress={4 / 19} />
            <Title>How long do you usually sleep at night?</Title>
            <View style={{ marginTop: 16 }}>
                {OPTIONS.map(o => (
                    <CardOption key={o} label={o} selected={selected === o} onPress={() => setSelected(o)} />
                ))}
            </View>
            <View style={{ flex: 1 }} />
            <Button onPress={onNext}>Continue</Button>
        </ScreenContainer>
    );
}



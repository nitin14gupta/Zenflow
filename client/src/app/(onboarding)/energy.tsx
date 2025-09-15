import React, { useState } from "react";
import { View } from "react-native";
import { Button, CardOption, ProgressBar, ScreenContainer, Title } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";

const OPTIONS = [
    "🌻 High - full of energy during the day",
    "🌾 Medium - My energy weakens over time",
    "🥀 Low - I need help increasing my energy",
];

export default function Energy() {
    const { setAnswer, answers } = useOnboarding();
    const [selected, setSelected] = useState<string | undefined>(answers.energy);
    const router = useRouter();
    const onNext = () => {
        if (!selected) return;
        setAnswer("energy", selected);
        router.push("/(onboarding)/lifestyle");
    };
    return (
        <ScreenContainer>
            <ProgressBar progress={6 / 19} />
            <Title>How do you feel your energy during the day?</Title>
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



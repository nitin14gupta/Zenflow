import React, { useState } from "react";
import { View } from "react-native";
import { Button, CardOption, ProgressBar, ScreenContainer, Title } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";

const OPTIONS = [
    "✌️ I easily keep up with my schedule",
    "🗓️ I procrastinate from time to time",
    "👊 Yes, and I want to change it",
];

export default function Procrastination() {
    const { setAnswer, answers } = useOnboarding();
    const [selected, setSelected] = useState<string | undefined>(answers.procrastination);
    const router = useRouter();
    const onNext = () => {
        if (!selected) return;
        setAnswer("procrastination", selected);
        router.push("/(onboarding)/statistics");
    };
    return (
        <ScreenContainer>
            <ProgressBar progress={11 / 19} />
            <Title>How often do you procrastinate?</Title>
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



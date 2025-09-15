import React, { useState } from "react";
import { View } from "react-native";
import { Button, CardOption, ProgressBar, ScreenContainer, Title } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";

const OPTIONS = ["🕐 0-10 minutes", "🕐 10-20 minutes", "🕐 20-30 minutes", "🕐 More than 30 minutes"];

export default function Morning() {
    const { setAnswer, answers } = useOnboarding();
    const [selected, setSelected] = useState<string | undefined>(answers.morning);
    const router = useRouter();
    const onNext = () => {
        if (!selected) return;
        setAnswer("morning", selected);
        router.push("/(onboarding)/energy");
    };
    return (
        <ScreenContainer>
            <ProgressBar progress={5 / 19} />
            <Title>How long do you usually need to get up from bed?</Title>
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



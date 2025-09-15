import React, { useState } from "react";
import { View } from "react-native";
import { Button, CardOption, ProgressBar, ScreenContainer, Title } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";

const OPTIONS = [
    "🥳 Completely - I'm very active and productive",
    "😔 Slightly - I'd like to see some improvement",
    "😥 Not at all - I expect to see a major change",
];

export default function Lifestyle() {
    const { setAnswer, answers } = useOnboarding();
    const [selected, setSelected] = useState<string | undefined>(answers.lifestyle);
    const router = useRouter();
    const onNext = () => {
        if (!selected) return;
        setAnswer("lifestyle", selected);
        router.push("/(onboarding)/goals");
    };
    return (
        <ScreenContainer>
            <ProgressBar progress={7 / 19} />
            <Title>How satisfied are you with your current lifestyle?</Title>
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



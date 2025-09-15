import React, { useState } from "react";
import { View } from "react-native";
import { Button, CardOption, ProgressBar, ScreenContainer, Title } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";

const OPTIONS = [
    "🥷 Focus master",
    "😎 Typically on track",
    "🤔 Sometimes sidetracked",
    "🎈 Easily distracted",
];

export default function Distractions() {
    const { setAnswer, answers } = useOnboarding();
    const [selected, setSelected] = useState<string | undefined>(answers.distractions);
    const router = useRouter();
    const onNext = () => {
        if (!selected) return;
        setAnswer("distractions", selected);
        router.push("/(onboarding)/procrastination");
    };
    return (
        <ScreenContainer>
            <ProgressBar progress={10 / 19} />
            <Title>How do you deal with distractions?</Title>
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



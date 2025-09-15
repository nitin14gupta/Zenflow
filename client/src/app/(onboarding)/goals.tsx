import React, { useState } from "react";
import { View } from "react-native";
import { Button, CardOption, ProgressBar, ScreenContainer, Title, Subtitle } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";

const OPTIONS = [
    "💡 More productive",
    "👟 More active",
    "🔨 More disciplined",
    "🌱 More mindful",
];

export default function Goals() {
    const { setAnswer, answers } = useOnboarding();
    const [selected, setSelected] = useState<string[]>(answers.goals ?? []);
    const router = useRouter();
    const toggle = (o: string) => {
        setSelected(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);
    };
    const onNext = () => {
        if (!selected.length) return;
        setAnswer("goals", selected);
        router.push("/(onboarding)/motivation");
    };
    return (
        <ScreenContainer>
            <ProgressBar progress={8 / 19} />
            <Title>I would like to be...</Title>
            <Subtitle>Select all that apply</Subtitle>
            <View style={{ marginTop: 16 }}>
                {OPTIONS.map(o => (
                    <CardOption key={o} label={o} selected={selected.includes(o)} onPress={() => toggle(o)} />
                ))}
            </View>
            <View style={{ flex: 1 }} />
            <Button onPress={onNext}>Continue</Button>
        </ScreenContainer>
    );
}



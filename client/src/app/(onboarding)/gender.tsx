import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button, CardOption, ProgressBar, ScreenContainer, Title } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";

const OPTIONS = [
    { label: "Female", emoji: "👩" },
    { label: "Male", emoji: "👨" },
    { label: "Other", emoji: "😊" },
];

export default function Gender() {
    const { setAnswer, answers } = useOnboarding();
    const [selected, setSelected] = useState<string | undefined>(answers.gender);
    const router = useRouter();
    const onNext = () => {
        if (!selected) return;
        setAnswer("gender", selected);
        router.push("/(onboarding)/welcome");
    };

    return (
        <ScreenContainer>
            <ProgressBar progress={2 / 19} />
            <Title>What is your gender?</Title>
            <View style={{ marginTop: 16 }}>
                {OPTIONS.map(o => (
                    <CardOption key={o.label} label={`${o.label}`} emoji={o.emoji} selected={selected === o.label} onPress={() => setSelected(o.label)} />
                ))}
            </View>
            <View style={{ flex: 1 }} />
            <Button onPress={onNext}>Continue</Button>
        </ScreenContainer>
    );
}



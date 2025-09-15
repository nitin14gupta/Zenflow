import React, { useState } from "react";
import { View } from "react-native";
import { Button, CardOption, ProgressBar, ScreenContainer, Title } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";

const OPTIONS = [
    "😶‍🌫️ Managing ADHD",
    "🧘‍♂️ Reducing stress and anxiety",
    "🏡 Improving work-life balance",
    "🔝 Boosting productivity and success",
    "🚀 Nothing—I'm naturally driven",
];

export default function Desires() {
    const { setAnswer, answers } = useOnboarding();
    const [selected, setSelected] = useState<string | undefined>(answers.desires);
    const router = useRouter();
    const onNext = () => {
        if (!selected) return;
        setAnswer("desires", selected);
        router.push("/(onboarding)/statement1");
    };
    return (
        <ScreenContainer>
            <ProgressBar progress={13 / 19} />
            <Title>What drives you to form good habits?</Title>
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



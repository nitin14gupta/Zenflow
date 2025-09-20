import React, { useState } from "react";
import { View } from "react-native";
import { Button, CardOption, ProgressBar, ScreenContainer, Title } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";
import { GradientBackground, FloatingElements, EntranceAnimation, StaggeredAnimation } from "../../components/AnimationComponents";

const OPTIONS = ["Less than 6 hours", "6-8 hours", "8-10 hours", "More than 10 hours"];

const floatingElements = [
    { emoji: "😴", position: { top: 0.1, left: 0.05 }, size: 24, opacity: 0.2, duration: 3000 },
    { emoji: "🌙", position: { top: 0.2, right: 0.08 }, size: 20, opacity: 0.3, duration: 2500 },
    { emoji: "⭐", position: { top: 0.7, left: 0.1 }, size: 22, opacity: 0.25, duration: 2200 },
    { emoji: "🌙", position: { top: 0.4, right: 0.12 }, size: 18, opacity: 0.2, duration: 2800 },
];

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
        <GradientBackground colors={['#FFF9F0', '#B8D8E7', '#FFE5B4']}>
            <ScreenContainer style={{ backgroundColor: 'transparent' }}>
                <ProgressBar progress={4 / 19} />

                <FloatingElements elements={floatingElements} />

                <EntranceAnimation type="combined" delay={0}>
                    <Title>How long do you usually sleep at night?</Title>
                </EntranceAnimation>

                <View style={{ marginTop: 24 }}>
                    <StaggeredAnimation staggerDelay={120}>
                        {OPTIONS.map(option => (
                            <CardOption
                                key={option}
                                label={option}
                                selected={selected === option}
                                onPress={() => setSelected(option)}
                            />
                        ))}
                    </StaggeredAnimation>
                </View>

                <View style={{ flex: 1 }} />

                <EntranceAnimation type="slide" delay={600}>
                    <Button onPress={onNext}>Continue</Button>
                </EntranceAnimation>
            </ScreenContainer>
        </GradientBackground>
    );
}



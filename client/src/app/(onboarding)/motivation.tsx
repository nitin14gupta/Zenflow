import React from "react";
import { Image, Text, View } from "react-native";
import { Button, ProgressBar, ScreenContainer, Subtitle, Title, colors } from "../../components/ui";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useRouter } from "expo-router";
import { GradientBackground, FloatingElements, EntranceAnimation, BounceAnimation, PulseAnimation } from "../../components/AnimationComponents";

const floatingElements = [
    { emoji: "🎯", position: { top: 0.08, left: 0.05 }, size: 20, opacity: 0.2, duration: 3000 },
    { emoji: "💪", position: { top: 0.15, right: 0.08 }, size: 18, opacity: 0.3, duration: 2500 },
    { emoji: "🚀", position: { bottom: 0.35, left: 0.1 }, size: 22, opacity: 0.25, duration: 2200 },
    { emoji: "⭐", position: { top: 0.3, right: 0.12 }, size: 16, opacity: 0.2, duration: 2800 },
];

export default function Motivation() {
    const router = useRouter();
    const bar1 = useRef(new Animated.Value(20)).current;
    const bar2 = useRef(new Animated.Value(50)).current;
    const bar3 = useRef(new Animated.Value(10)).current;

    useEffect(() => {
        Animated.stagger(200, [
            Animated.spring(bar1, { toValue: 80, useNativeDriver: false }),
            Animated.spring(bar2, { toValue: 120, useNativeDriver: false }),
            Animated.spring(bar3, { toValue: 60, useNativeDriver: false }),
        ]).start();
    }, [bar1, bar2, bar3]);

    return (
        <GradientBackground colors={['#FFF9F0', '#FFE5B4', '#B8D8E7']}>
            <ScreenContainer style={{ backgroundColor: 'transparent' }}>
                <ProgressBar progress={9 / 19} />

                <FloatingElements elements={floatingElements} />

                <EntranceAnimation type="combined" delay={0}>
                    <View style={{ alignItems: 'center', marginBottom: 24 }}>
                        <BounceAnimation amplitude={12} duration={800}>
                            <PulseAnimation scale={1.1} duration={1200}>
                                <Text style={{
                                    fontSize: 48,
                                    marginBottom: 16,
                                    textShadowColor: 'rgba(0,0,0,0.1)',
                                    textShadowOffset: { width: 0, height: 2 },
                                    textShadowRadius: 4
                                }}>🎯</Text>
                            </PulseAnimation>
                        </BounceAnimation>

                        <View style={{
                            width: '100%',
                            height: 180,
                            backgroundColor: 'rgba(243, 244, 246, 0.8)',
                            borderRadius: 16,
                            padding: 20,
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            justifyContent: 'space-around',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 4
                        }}>
                            <Animated.View style={{
                                width: 28,
                                height: bar1,
                                backgroundColor: colors.mint,
                                borderRadius: 12,
                                shadowColor: colors.mint,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 4
                            }} />
                            <Animated.View style={{
                                width: 28,
                                height: bar2,
                                backgroundColor: colors.blue,
                                borderRadius: 12,
                                shadowColor: colors.blue,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 4
                            }} />
                            <Animated.View style={{
                                width: 28,
                                height: bar3,
                                backgroundColor: colors.coral,
                                borderRadius: 12,
                                shadowColor: colors.coral,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 4
                            }} />
                        </View>
                    </View>
                </EntranceAnimation>

                <EntranceAnimation type="slide" delay={400}>
                    <Title>Motivation is your key to success!</Title>
                    <Subtitle>You're twice as motivated when you see your goals clearly. So use your growth plan to keep them in focus even when the going gets tough.</Subtitle>
                </EntranceAnimation>

                <View style={{ flex: 1 }} />

                <EntranceAnimation type="slide" delay={800}>
                    <Button onPress={() => router.push("/(onboarding)/distractions")}>Continue</Button>
                </EntranceAnimation>
            </ScreenContainer>
        </GradientBackground>
    );
}



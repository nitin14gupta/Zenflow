import React, { useState, useEffect, useRef } from "react";
import { View, Animated, Dimensions, Text } from "react-native";
import { Button, CardOption, ProgressBar, ScreenContainer, Title, Subtitle } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
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

    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;
    const scale = useRef(new Animated.Value(0.9)).current;
    const floating1 = useRef(new Animated.Value(0)).current;
    const floating2 = useRef(new Animated.Value(0)).current;
    const floating3 = useRef(new Animated.Value(0)).current;
    const floating4 = useRef(new Animated.Value(0)).current;
    const optionAnimations = useRef(OPTIONS.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        // Main entrance animations
        Animated.parallel([
            Animated.timing(fadeIn, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(slideUp, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
        ]).start();

        // Staggered option animations
        const staggerDelay = 150;
        optionAnimations.forEach((anim, index) => {
            setTimeout(() => {
                Animated.spring(anim, {
                    toValue: 1,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }).start();
            }, index * staggerDelay);
        });

        // Floating background elements with different patterns
        Animated.loop(
            Animated.sequence([
                Animated.timing(floating1, { toValue: -12, duration: 2800, useNativeDriver: true }),
                Animated.timing(floating1, { toValue: 12, duration: 2800, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floating2, { toValue: 15, duration: 3200, useNativeDriver: true }),
                Animated.timing(floating2, { toValue: -15, duration: 3200, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floating3, { toValue: -10, duration: 2400, useNativeDriver: true }),
                Animated.timing(floating3, { toValue: 10, duration: 2400, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floating4, { toValue: 8, duration: 2600, useNativeDriver: true }),
                Animated.timing(floating4, { toValue: -8, duration: 2600, useNativeDriver: true }),
            ])
        ).start();
    }, [fadeIn, slideUp, scale, floating1, floating2, floating3, floating4, optionAnimations]);

    const toggle = (o: string) => {
        setSelected(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);
    };

    const onNext = () => {
        if (!selected.length) return;
        setAnswer("goals", selected);
        router.push("/(onboarding)/motivation");
    };

    return (
        <LinearGradient
            colors={['#FFF9F0', '#FFE5B4', '#B8D8E7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <ScreenContainer style={{ backgroundColor: 'transparent' }}>
                <ProgressBar progress={8 / 19} />

                {/* Floating background elements */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: height * 0.1,
                        left: width * 0.05,
                        transform: [{ translateY: floating1 }]
                    }}
                >
                    <Text style={{ fontSize: 24, opacity: 0.2 }}>💡</Text>
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        top: height * 0.15,
                        right: width * 0.08,
                        transform: [{ translateY: floating2 }]
                    }}
                >
                    <Text style={{ fontSize: 20, opacity: 0.3 }}>👟</Text>
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        bottom: height * 0.35,
                        left: width * 0.1,
                        transform: [{ translateY: floating3 }]
                    }}
                >
                    <Text style={{ fontSize: 22, opacity: 0.25 }}>🔨</Text>
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        top: height * 0.3,
                        right: width * 0.12,
                        transform: [{ translateY: floating4 }]
                    }}
                >
                    <Text style={{ fontSize: 26, opacity: 0.2 }}>🌱</Text>
                </Animated.View>

                <Animated.View style={{
                    opacity: fadeIn,
                    transform: [
                        { translateY: slideUp },
                        { scale: scale }
                    ]
                }}>
                    <Title>I would like to be...</Title>
                    <Subtitle>Select all that apply</Subtitle>
                </Animated.View>

                <View style={{ marginTop: 24 }}>
                    {OPTIONS.map((option, index) => (
                        <Animated.View
                            key={option}
                            style={{
                                opacity: optionAnimations[index],
                                transform: [
                                    {
                                        translateY: optionAnimations[index].interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [40, 0]
                                        })
                                    },
                                    {
                                        scale: optionAnimations[index]
                                    }
                                ]
                            }}
                        >
                            <CardOption
                                label={option}
                                selected={selected.includes(option)}
                                onPress={() => toggle(option)}
                            />
                        </Animated.View>
                    ))}
                </View>

                <View style={{ flex: 1 }} />

                <Animated.View style={{
                    opacity: fadeIn,
                    transform: [{ translateY: slideUp }]
                }}>
                    <Button onPress={onNext}>Continue</Button>
                </Animated.View>
            </ScreenContainer>
        </LinearGradient>
    );
}



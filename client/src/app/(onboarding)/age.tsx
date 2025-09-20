import React, { useState, useEffect, useRef } from "react";
import { Text, View, Pressable, Animated, Dimensions } from "react-native";
import { Button, CardOption, ProgressBar, ScreenContainer, Title, colors } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const OPTIONS = ["18-24", "25-34", "35-44", "45+"];

export default function Age() {
    const { setAnswer, answers } = useOnboarding();
    const [selected, setSelected] = useState<string | undefined>(answers.age);
    const router = useRouter();

    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;
    const scale = useRef(new Animated.Value(0.9)).current;
    const floating1 = useRef(new Animated.Value(0)).current;
    const floating2 = useRef(new Animated.Value(0)).current;
    const floating3 = useRef(new Animated.Value(0)).current;
    const optionAnimations = useRef(OPTIONS.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        // Main entrance animations
        Animated.parallel([
            Animated.timing(fadeIn, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(slideUp, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
        ]).start();

        // Staggered option animations
        const staggerDelay = 100;
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

        // Floating background elements
        Animated.loop(
            Animated.sequence([
                Animated.timing(floating1, { toValue: -15, duration: 3000, useNativeDriver: true }),
                Animated.timing(floating1, { toValue: 15, duration: 3000, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floating2, { toValue: 12, duration: 2500, useNativeDriver: true }),
                Animated.timing(floating2, { toValue: -12, duration: 2500, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floating3, { toValue: -10, duration: 2200, useNativeDriver: true }),
                Animated.timing(floating3, { toValue: 10, duration: 2200, useNativeDriver: true }),
            ])
        ).start();
    }, [fadeIn, slideUp, scale, floating1, floating2, floating3, optionAnimations]);

    const onNext = () => {
        if (!selected) return;
        setAnswer("age", selected);
        router.push("/(onboarding)/gender");
    };

    return (
        <LinearGradient
            colors={['#FFF9F0', '#B8D8E7', '#FFE5B4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <ScreenContainer style={{ backgroundColor: 'transparent' }}>
                <ProgressBar progress={1 / 19} />

                {/* Floating background elements */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: height * 0.12,
                        left: width * 0.05,
                        transform: [{ translateY: floating1 }]
                    }}
                >
                    <Text style={{ fontSize: 22, opacity: 0.2 }}>🎂</Text>
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        top: height * 0.2,
                        right: width * 0.08,
                        transform: [{ translateY: floating2 }]
                    }}
                >
                    <Text style={{ fontSize: 18, opacity: 0.3 }}>⏰</Text>
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        bottom: height * 0.3,
                        left: width * 0.1,
                        transform: [{ translateY: floating3 }]
                    }}
                >
                    <Text style={{ fontSize: 25, opacity: 0.25 }}>📅</Text>
                </Animated.View>

                <Animated.View style={{
                    opacity: fadeIn,
                    transform: [
                        { translateY: slideUp },
                        { scale: scale }
                    ]
                }}>
                    <Title>What is your age?</Title>
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
                                            outputRange: [30, 0]
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
                                selected={selected === option}
                                onPress={() => setSelected(option)}
                            />
                        </Animated.View>
                    ))}
                </View>

                <View style={{ flex: 1 }} />

                <Animated.View style={{
                    opacity: fadeIn,
                    transform: [{ translateY: slideUp }]
                }}>
                    <Button onPress={onNext}>
                        Continue
                    </Button>
                </Animated.View>

                <Animated.View style={{
                    alignItems: "center",
                    marginTop: 16,
                    opacity: fadeIn,
                    transform: [{ translateY: slideUp }]
                }}>
                    <Text style={{
                        color: "#6B7280",
                        fontSize: 14,
                        fontFamily: "Poppins_400Regular",
                        marginBottom: 8
                    }}>
                        or
                    </Text>
                    <Pressable onPress={() => router.replace("/(auth)/login")}>
                        <Text style={{
                            color: colors.purple,
                            fontFamily: "Poppins_600SemiBold",
                            fontSize: 16
                        }}>
                            Log In
                        </Text>
                    </Pressable>
                </Animated.View>
            </ScreenContainer>
        </LinearGradient>
    );
}



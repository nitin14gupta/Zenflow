import React, { useEffect, useRef } from "react";
import { Text, View, Pressable, Animated, Dimensions } from "react-native";
import { Button, ProgressBar, ScreenContainer, Title, Subtitle, colors } from "../../components/ui";
import ConfettiCannon from "react-native-confetti-cannon";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Final() {
    const router = useRouter();
    const confettiRef = useRef<ConfettiCannon | null>(null);

    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(50)).current;
    const scale = useRef(new Animated.Value(0.8)).current;
    const bounce = useRef(new Animated.Value(0)).current;
    const rotate = useRef(new Animated.Value(0)).current;
    const pulse = useRef(new Animated.Value(1)).current;
    const floating1 = useRef(new Animated.Value(0)).current;
    const floating2 = useRef(new Animated.Value(0)).current;
    const floating3 = useRef(new Animated.Value(0)).current;
    const floating4 = useRef(new Animated.Value(0)).current;
    const floating5 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Main entrance animations
        Animated.parallel([
            Animated.timing(fadeIn, { toValue: 1, duration: 1000, useNativeDriver: true }),
            Animated.spring(slideUp, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
        ]).start();

        // Celebration bounce animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounce, { toValue: -15, duration: 600, useNativeDriver: true }),
                Animated.timing(bounce, { toValue: 0, duration: 600, useNativeDriver: true }),
            ])
        ).start();

        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();

        // Rotation animation
        Animated.loop(
            Animated.timing(rotate, { toValue: 1, duration: 15000, useNativeDriver: true })
        ).start();

        // Multiple floating animations
        Animated.loop(
            Animated.sequence([
                Animated.timing(floating1, { toValue: -20, duration: 2000, useNativeDriver: true }),
                Animated.timing(floating1, { toValue: 20, duration: 2000, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floating2, { toValue: 25, duration: 2500, useNativeDriver: true }),
                Animated.timing(floating2, { toValue: -25, duration: 2500, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floating3, { toValue: -18, duration: 1800, useNativeDriver: true }),
                Animated.timing(floating3, { toValue: 18, duration: 1800, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floating4, { toValue: 22, duration: 2200, useNativeDriver: true }),
                Animated.timing(floating4, { toValue: -22, duration: 2200, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floating5, { toValue: -16, duration: 1900, useNativeDriver: true }),
                Animated.timing(floating5, { toValue: 16, duration: 1900, useNativeDriver: true }),
            ])
        ).start();

        const t = setTimeout(() => {
            router.replace("/(auth)/register");
        }, 2000);

        setTimeout(() => confettiRef.current?.start?.(), 500);

        return () => clearTimeout(t);
    }, [router, fadeIn, slideUp, scale, bounce, pulse, rotate, floating1, floating2, floating3, floating4, floating5]);

    const spin = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <LinearGradient
            colors={['#FFB5A7', '#B8D8E7', '#FFE5B4', '#D4A5A5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <ScreenContainer style={{ backgroundColor: 'transparent' }}>
                <ProgressBar progress={19 / 19} />

                {/* Floating celebration elements */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: height * 0.08,
                        left: width * 0.05,
                        transform: [{ translateY: floating1 }]
                    }}
                >
                    <Text style={{ fontSize: 28, opacity: 0.4 }}>🎊</Text>
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        top: height * 0.12,
                        right: width * 0.08,
                        transform: [{ translateY: floating2 }]
                    }}
                >
                    <Text style={{ fontSize: 24, opacity: 0.5 }}>🎈</Text>
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        bottom: height * 0.4,
                        left: width * 0.1,
                        transform: [{ translateY: floating3 }]
                    }}
                >
                    <Text style={{ fontSize: 30, opacity: 0.3 }}>✨</Text>
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        top: height * 0.25,
                        right: width * 0.12,
                        transform: [{ translateY: floating4 }]
                    }}
                >
                    <Text style={{ fontSize: 22, opacity: 0.4 }}>🌟</Text>
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        bottom: height * 0.3,
                        right: width * 0.15,
                        transform: [{ translateY: floating5 }]
                    }}
                >
                    <Text style={{ fontSize: 26, opacity: 0.35 }}>🎉</Text>
                </Animated.View>

                <Animated.View style={{
                    alignItems: 'center',
                    marginTop: 32,
                    opacity: fadeIn,
                    transform: [
                        { translateY: slideUp },
                        { scale: scale }
                    ]
                }}>
                    <Animated.View style={{
                        transform: [
                            { translateY: bounce },
                            { scale: pulse },
                            { rotate: spin }
                        ]
                    }}>
                        <Text style={{
                            fontSize: 64,
                            marginBottom: 16,
                            textShadowColor: 'rgba(0,0,0,0.2)',
                            textShadowOffset: { width: 0, height: 4 },
                            textShadowRadius: 8
                        }}>
                            🎉
                        </Text>
                    </Animated.View>

                    <Animated.View style={{
                        opacity: fadeIn,
                        transform: [{ translateY: slideUp }]
                    }}>
                        <Title>You're all set!</Title>
                        <Subtitle>Create your account to save progress and unlock your plan.</Subtitle>
                    </Animated.View>
                </Animated.View>

                <View style={{ flex: 1 }} />

                {/* <Animated.View style={{
                    gap: 16,
                    opacity: fadeIn,
                    transform: [{ translateY: slideUp }]
                }}>
                    <Button onPress={() => router.replace("/(auth)/register")}>
                        Create Account
                    </Button>
                    <Button variant="secondary" onPress={() => router.replace("/(auth)/login")}>
                        I already have an account
                    </Button>
                </Animated.View> */}

                <ConfettiCannon
                    ref={confettiRef as any}
                    count={200}
                    origin={{ x: width / 2, y: 0 }}
                    fadeOut
                    autoStart={false}
                    explosionSpeed={500}
                    fallSpeed={2000}
                />
            </ScreenContainer>
        </LinearGradient>
    );
}



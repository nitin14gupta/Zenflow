import React, { useEffect, useRef } from "react";
import { Animated, Image, Text, View, Dimensions } from "react-native";
import { Button, ProgressBar, ScreenContainer, Subtitle, Title } from "../../components/ui";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
    const router = useRouter();
    const bounce = useRef(new Animated.Value(0)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;
    const scale = useRef(new Animated.Value(0.8)).current;
    const floating1 = useRef(new Animated.Value(0)).current;
    const floating2 = useRef(new Animated.Value(0)).current;
    const floating3 = useRef(new Animated.Value(0)).current;
    const imageScale = useRef(new Animated.Value(0.9)).current;
    const imageRotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Main entrance animations
        Animated.parallel([
            Animated.timing(fadeIn, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(slideUp, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
            Animated.spring(imageScale, { toValue: 1, tension: 40, friction: 6, useNativeDriver: true }),
        ]).start();

        // Continuous floating animations
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounce, { toValue: -8, duration: 600, useNativeDriver: true }),
                Animated.timing(bounce, { toValue: 0, duration: 600, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floating1, { toValue: -12, duration: 3000, useNativeDriver: true }),
                Animated.timing(floating1, { toValue: 12, duration: 3000, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floating2, { toValue: 15, duration: 2500, useNativeDriver: true }),
                Animated.timing(floating2, { toValue: -15, duration: 2500, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floating3, { toValue: -10, duration: 2200, useNativeDriver: true }),
                Animated.timing(floating3, { toValue: 10, duration: 2200, useNativeDriver: true }),
            ])
        ).start();

        // Image rotation
        // Animated.loop(
        //     Animated.timing(imageRotate, { toValue: 1, duration: 20000, useNativeDriver: true })
        // ).start();
    }, [bounce, fadeIn, slideUp, scale, floating1, floating2, floating3, imageScale, imageRotate]);

    const rotate = imageRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <LinearGradient
            colors={['#FFF9F0', '#FFE5B4', '#FFB5A7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <ScreenContainer style={{ backgroundColor: 'transparent' }}>
                <ProgressBar progress={3 / 19} />

                {/* Floating background elements */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: height * 0.15,
                        left: width * 0.05,
                        transform: [{ translateY: floating1 }]
                    }}
                >
                    <Text style={{ fontSize: 24, opacity: 0.2 }}>🌟</Text>
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        top: height * 0.25,
                        right: width * 0.08,
                        transform: [{ translateY: floating2 }]
                    }}
                >
                    <Text style={{ fontSize: 20, opacity: 0.3 }}>💫</Text>
                </Animated.View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        bottom: height * 0.4,
                        left: width * 0.1,
                        transform: [{ translateY: floating3 }]
                    }}
                >
                    <Text style={{ fontSize: 28, opacity: 0.25 }}>✨</Text>
                </Animated.View>

                <Animated.View style={{
                    alignItems: 'center',
                    marginBottom: 24,
                    opacity: fadeIn,
                    transform: [
                        { translateY: slideUp },
                        { scale: scale }
                    ]
                }}>
                    <Animated.Text style={{
                        transform: [{ translateY: bounce }],
                        fontSize: 48,
                        textShadowColor: 'rgba(0,0,0,0.1)',
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 4
                    }}>
                        😇
                    </Animated.Text>
                </Animated.View>

                <Animated.View style={{
                    opacity: fadeIn,
                    transform: [{ translateY: slideUp }]
                }}>
                    <Title>Yay, glad you are here!</Title>
                    <Subtitle>We'll help you with self-growth. First, let's dive into your personality and tailor your personal plan.</Subtitle>
                </Animated.View>

                <Animated.View style={{
                    alignItems: 'center',
                    marginVertical: 24,
                    opacity: fadeIn,
                    transform: [
                        { scale: imageScale },
                        { rotate: rotate }
                    ]
                }}>
                    <Image
                        source={{ uri: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80&auto=format&fit=crop" }}
                        style={{
                            width: '100%',
                            height: 200,
                            borderRadius: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.2,
                            shadowRadius: 16
                        }}
                    />
                </Animated.View>

                <View style={{ flex: 1 }} />

                <Animated.View style={{
                    opacity: fadeIn,
                    transform: [{ translateY: slideUp }]
                }}>
                    <Button onPress={() => router.push("/(onboarding)/sleep")}>Continue</Button>
                </Animated.View>
            </ScreenContainer>
        </LinearGradient>
    );
}



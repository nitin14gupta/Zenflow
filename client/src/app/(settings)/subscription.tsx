import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, Dimensions, StatusBar, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../components/ui';

const { width } = Dimensions.get('window');

const images = [
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop'
];

export default function Subscription() {
    const router = useRouter();
    const scrollRef = useRef<ScrollView>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const { showToast } = useToast();
    const { user, refreshUser } = useAuth();

    // Create infinite scroll data by duplicating images
    const infiniteImages = [...images, ...images, ...images];
    const imageWidth = width - 32;

    useEffect(() => {
        const startInfiniteScroll = () => {
            scrollRef.current?.scrollTo({ x: images.length * imageWidth, animated: false });
        };

        const scrollListener = scrollX.addListener(({ value }) => {
            const currentIndex = Math.round(value / imageWidth);

            // Reset to middle when reaching edges
            if (currentIndex >= images.length * 2) {
                scrollRef.current?.scrollTo({ x: images.length * imageWidth, animated: false });
            } else if (currentIndex <= 0) {
                scrollRef.current?.scrollTo({ x: images.length * imageWidth, animated: false });
            }
        });

        startInfiniteScroll();

        return () => {
            scrollX.removeListener(scrollListener);
        };
    }, []);

    useEffect(() => {
        const autoScroll = setInterval(() => {
            const currentX = (scrollX as any)._value || 0;
            scrollRef.current?.scrollTo({
                x: currentX + imageWidth,
                animated: true
            });
        }, 3000);

        return () => clearInterval(autoScroll);
    }, []);

    const purchase = (plan: 'weekly' | 'yearly') => {
        showToast('Payments are temporarily disabled. Please try again later.', 'info');
    };

    const isExpired = () => {
        const exp = (user as any)?.subscription_expires_at;
        if (!exp) return true;
        const dt = new Date(exp);
        return dt.getTime() <= Date.now();
    };

    const isPremium = Boolean((user as any)?.is_premium) && !isExpired();

    const formatExpiry = () => {
        const exp = (user as any)?.subscription_expires_at;
        if (!exp) return '';
        try {
            const dt = new Date(exp);
            return dt.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return String(exp);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F5FAFF' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5FAFF" />
            {false && <View />}

            {/* Header */}
            <View style={{ paddingTop: 15, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 18, color: '#6B7280' }}>✕</Text>
                </Pressable>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 22, color: '#111827' }}>Choose Your Plan</Text>
            </View>

            <ScrollView style={{ flex: 1 }}>
                {/* Premium Image carousel with infinite scroll */}
                <View style={{ height: 280, marginBottom: 20 }}>
                    <ScrollView
                        ref={scrollRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                        style={{ paddingHorizontal: 16 }}
                    >
                        {infiniteImages.map((uri, i) => (
                            <View key={i} style={{ width: imageWidth, alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={{ uri }}
                                    style={{
                                        width: imageWidth - 32,
                                        height: 240,
                                        borderRadius: 20,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 12
                                    }}
                                />
                                <View style={{
                                    position: 'absolute',
                                    bottom: 20,
                                    left: 20,
                                    right: 20,
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    borderRadius: 12,
                                    padding: 12
                                }}>
                                    <Text style={{
                                        color: 'white',
                                        fontFamily: 'Poppins_600SemiBold',
                                        fontSize: 16,
                                        textAlign: 'center'
                                    }}>
                                        Transform Your Life
                                    </Text>
                                    <Text style={{
                                        color: 'rgba(255,255,255,0.8)',
                                        fontFamily: 'Poppins_400Regular',
                                        fontSize: 12,
                                        textAlign: 'center',
                                        marginTop: 4
                                    }}>
                                        Join thousands building better habits
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: '#111827', textAlign: 'center', marginBottom: 8 }}>
                        {isPremium ? 'You are User Premium 🎉' : 'Discover your Perfect Day!'}
                    </Text>
                    {!isPremium ? (
                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 20 }}>
                            Visualize your ideal day. Effortless start with a Library of 100+ Habits.
                        </Text>
                    ) : (
                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 20 }}>
                            Active until {formatExpiry()}. Extend your plan below.
                        </Text>
                    )}

                    {/* Premium Pricing options */}
                    {!isPremium ? (
                        <View style={{ marginBottom: 30 }}>
                            {/* Most Popular Badge */}
                            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                                <View style={{
                                    backgroundColor: colors.purple,
                                    paddingHorizontal: 20,
                                    paddingVertical: 8,
                                    borderRadius: 20,
                                    shadowColor: colors.purple,
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 8,
                                    elevation: 4
                                }}>
                                    <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>
                                        ⭐ Most Popular
                                    </Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
                                {/* Yearly Plan - Featured */}
                                <View style={{
                                    flex: 1,
                                    backgroundColor: 'white',
                                    borderRadius: 20,
                                    padding: 20,
                                    borderWidth: 3,
                                    borderColor: colors.purple,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 8 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 16,
                                    elevation: 8
                                }}>
                                    <View style={{
                                        position: 'absolute',
                                        top: -10,
                                        right: 20,
                                        backgroundColor: colors.purple,
                                        paddingHorizontal: 12,
                                        paddingVertical: 4,
                                        borderRadius: 12
                                    }}>
                                        <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 10 }}>
                                            SAVE 50%
                                        </Text>
                                    </View>

                                    <View style={{ alignItems: 'center', marginBottom: 16 }}>
                                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 36, color: colors.purple, marginBottom: 4 }}>12</Text>
                                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#6B7280' }}>Months</Text>
                                    </View>

                                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827' }}>₹3,550</Text>
                                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280' }}>per year</Text>
                                    </View>

                                    <Pressable
                                        onPress={() => purchase('yearly')}
                                        style={{
                                            backgroundColor: colors.purple,
                                            borderRadius: 12,
                                            paddingVertical: 14,
                                            alignItems: 'center',
                                            shadowColor: colors.purple,
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 8,
                                            elevation: 4
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                                            Choose Yearly
                                        </Text>
                                    </Pressable>
                                </View>

                                {/* Weekly Plan */}
                                <View style={{
                                    flex: 1,
                                    backgroundColor: 'white',
                                    borderRadius: 20,
                                    padding: 20,
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 8,
                                    elevation: 4
                                }}>
                                    <View style={{ alignItems: 'center', marginBottom: 16 }}>
                                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 36, color: '#111827', marginBottom: 4 }}>1</Text>
                                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#6B7280' }}>Week</Text>
                                    </View>

                                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827' }}>₹700</Text>
                                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280' }}>per week</Text>
                                    </View>

                                    <Pressable
                                        onPress={() => purchase('weekly')}
                                        style={{
                                            backgroundColor: '#111827',
                                            borderRadius: 12,
                                            paddingVertical: 14,
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                                            Choose Weekly
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>

                            {/* Features List */}
                            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827', marginBottom: 16, textAlign: 'center' }}>
                                    What You Get
                                </Text>
                                <View style={{ gap: 12 }}>
                                    {[
                                        '🎯 Unlimited habit tracking',
                                        '📊 Advanced analytics & insights',
                                        '🎨 100+ premium habit templates',
                                        '🔔 Smart notifications',
                                        '☁️ Cloud sync across devices',
                                        '🎁 Exclusive content & tips'
                                    ].map((feature, index) => (
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#111827' }}>
                                                {feature}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={{
                            backgroundColor: 'white',
                            borderRadius: 20,
                            padding: 24,
                            borderWidth: 2,
                            borderColor: colors.purple,
                            marginBottom: 20,
                            shadowColor: colors.purple,
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.2,
                            shadowRadius: 16,
                            elevation: 8
                        }}>
                            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                <Text style={{ fontSize: 40, marginBottom: 8 }}>🎉</Text>
                                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: colors.purple, marginBottom: 8 }}>
                                    You're Premium!
                                </Text>
                                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
                                    Active until {formatExpiry()}. Extend your plan below.
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <Pressable
                                    onPress={() => purchase('weekly')}
                                    style={{
                                        flex: 1,
                                        backgroundColor: colors.purple,
                                        borderRadius: 12,
                                        paddingVertical: 14,
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                                        Extend Weekly
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => purchase('yearly')}
                                    style={{
                                        flex: 1,
                                        backgroundColor: '#111827',
                                        borderRadius: 12,
                                        paddingVertical: 14,
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                                        Extend Yearly
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    )}

                    {/* Trust indicators */}
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <View style={{
                            backgroundColor: 'rgba(107, 70, 193, 0.1)',
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 20,
                            marginBottom: 12
                        }}>
                            <Text style={{
                                color: colors.purple,
                                fontFamily: 'Poppins_600SemiBold',
                                fontSize: 12
                            }}>
                                🔒 Secure & Cancel Anytime
                            </Text>
                        </View>
                    </View>

                    {/* Footer links */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginBottom: 32,
                        paddingTop: 20,
                        borderTopWidth: 1,
                        borderTopColor: '#E5E7EB'
                    }}>
                        <Pressable onPress={() => router.push('/(settings)/terms')}>
                            <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 12 }}>
                                Terms & Conditions
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => router.push('/(settings)/privacy')}>
                            <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 12 }}>
                                Privacy Policy
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => router.push('/(settings)')}>
                            <Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 12 }}>
                                Settings
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
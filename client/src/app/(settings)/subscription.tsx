import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../components/ui';

const { width } = Dimensions.get('window');

const images = [
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop'
];

export default function Subscription() {
    const router = useRouter();
    const scrollRef = useRef<ScrollView>(null);
    const [index, setIndex] = useState(0);
    const { showToast } = useToast();
    const { user, refreshUser } = useAuth();

    useEffect(() => {
        const id = setInterval(() => {
            const next = (index + 1) % images.length;
            setIndex(next);
            scrollRef.current?.scrollTo({ x: next * (width - 32), animated: true });
        }, 2500);
        return () => clearInterval(id);
    }, [index]);

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
                {/* Image carousel */}
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    style={{ paddingHorizontal: 16 }}
                >
                    {images.map((uri, i) => (
                        <Image key={i} source={{ uri }} style={{ width: 100, height: 220, borderRadius: 16, marginRight: 12 }} />
                    ))}
                </ScrollView>

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

                    {/* Pricing options / Extend options or Premium card */}
                    {!isPremium ? (
                        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
                            <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 2, borderColor: '#111827' }}>
                                <Text style={{ alignSelf: 'flex-start', backgroundColor: '#111827', color: 'white', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, fontFamily: 'Poppins_600SemiBold', fontSize: 12, marginBottom: 8 }}>Save 50 %</Text>
                                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 28, color: '#111827', marginBottom: 6 }}>12</Text>
                                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Months</Text>
                                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#111827' }}>₹3,550.00 / first year</Text>
                                <Pressable onPress={() => purchase('yearly')} style={{ marginTop: 12, backgroundColor: '#111827', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold' }}>Choose Yearly</Text>
                                </Pressable>
                            </View>

                            <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' }}>
                                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 28, color: '#111827', marginBottom: 6 }}>1</Text>
                                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Week</Text>
                                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#111827' }}>₹700.00 / first week</Text>
                                <Pressable onPress={() => purchase('weekly')} style={{ marginTop: 12, backgroundColor: '#111827', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold' }}>Choose Weekly</Text>
                                </Pressable>
                            </View>
                        </View>
                    ) : (
                        <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 }}>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827', marginBottom: 6 }}>You’re Premium 🎉</Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: '#6B7280', marginBottom: 12 }}>Enjoy unlimited access to ZenFlow features. Manage your plan or extend below.</Text>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <Pressable onPress={() => purchase('weekly')} style={{ flex: 1, backgroundColor: '#111827', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold' }}>Extend Weekly</Text>
                                </Pressable>
                                <Pressable onPress={() => purchase('yearly')} style={{ flex: 1, backgroundColor: '#111827', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold' }}>Extend Yearly</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}

                    <View />

                    {/* <View style={{ alignItems: 'center', marginBottom: 12 }}>
                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#6B7280' }}>Cancel anytime</Text>
                    </View> */}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 32 }}>
                        <Pressable onPress={() => router.push('/(settings)/terms')}><Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 12 }}>Terms & Conditions</Text></Pressable>
                        <Pressable onPress={() => router.push('/(settings)/privacy')}><Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 12 }}>Privacy Policy</Text></Pressable>
                        <Pressable onPress={() => router.push('/(settings)')}><Text style={{ color: colors.purple, fontFamily: 'Poppins_600SemiBold', fontSize: 12 }}>Setting Screen</Text></Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
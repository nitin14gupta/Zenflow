import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StatusBar, ImageBackground, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '../../api/apiService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SafeAreaView } from 'react-native-safe-area-context';

// Packs shown as large image cards
// Images reference app assets; replace with real artwork when available

type HabitItem = { id: string; title: string; emoji?: string; duration?: string };
type HabitPack = {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: any; // require() reference to local asset or {uri}
    habits: HabitItem[];
};

const habitPacks: HabitPack[] = [
    {
        id: 'pack-1',
        title: 'My Perfect Morning',
        subtitle: 'Start the day with joy',
        description:
            'A perfect morning routine is a great way to help you start your day with joy and balance.',
        image: { uri: 'https://images.unsplash.com/photo-1633876841461-772d2b0b0e39?q=80&w=831&auto=format&fit=crop' },
        habits: [
            { id: 'h-1', title: 'Wake up early', emoji: '⏰' },
            { id: 'h-2', title: 'Drink a glass of water', emoji: '🥛' },
            { id: 'h-3', title: '15 minutes meditation', emoji: '🧘‍♀️' },
            { id: 'h-4', title: 'Exercise', emoji: '🏋️' },
            { id: 'h-5', title: 'Have a healthy breakfast', emoji: '🍳' },
            { id: 'h-6', title: 'Read a book for 30 minutes', emoji: '📚' },
            { id: 'h-7', title: 'Set goals for the day', emoji: '🎯' },
        ],
    },
    {
        id: 'pack-2',
        title: 'Digital Detox',
        subtitle: 'Unplug from devices',
        description: 'Reduce screen time and reclaim your focus throughout the day.',
        image: { uri: 'https://images.unsplash.com/photo-1633876841461-772d2b0b0e39?q=80&w=831&auto=format&fit=crop' },
        habits: [
            { id: 'h-8', title: 'No phone for first hour', emoji: '📵' },
            { id: 'h-9', title: 'Disable non‑essential notifications', emoji: '🔕' },
            { id: 'h-10', title: 'Schedule two focus blocks', emoji: '⏱️' },
        ],
    },
    {
        id: 'pack-3',
        title: 'Clean Home, Clean Mind',
        subtitle: 'Create a consistent routine',
        description: 'Simple chores to keep your space tidy and your mind calm.',
        image: { uri: 'https://images.unsplash.com/photo-1633876841461-772d2b0b0e39?q=80&w=831&auto=format&fit=crop' },
        habits: [
            { id: 'h-11', title: 'Tidy desk', emoji: '🧹' },
            { id: 'h-12', title: 'Quick vacuum', emoji: '🧼' },
            { id: 'h-13', title: 'Wipe counters', emoji: '🧽' },
        ],
    },
    // New packs (Unsplash images)
    {
        id: 'pack-4',
        title: 'Get In Shape & Feel Great',
        subtitle: 'Exercise and food habits',
        description: 'Build momentum with simple everyday moves and smart nutrition.',
        image: { uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop' },
        habits: [
            { id: 'h-14', title: '10,000 steps', emoji: '🚶‍♂️' },
            { id: 'h-15', title: 'Stretch for 10 minutes', emoji: '🤸‍♀️' },
            { id: 'h-16', title: 'Track protein intake', emoji: '🥗' },
        ],
    },
    {
        id: 'pack-5',
        title: 'Skin Care Day',
        subtitle: 'Take care of yourself',
        description: 'Gentle routines for healthy skin and self‑care.',
        image: { uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop' },
        habits: [
            { id: 'h-17', title: 'Cleanse and moisturize', emoji: '🧴' },
            { id: 'h-18', title: 'Sunscreen daily', emoji: '🌞' },
            { id: 'h-19', title: 'Hydration check', emoji: '💧' },
        ],
    },
    {
        id: 'pack-6',
        title: 'Mastering ADHD',
        subtitle: 'Structured Focus',
        description: 'Reduce friction with small, reliable routines that boost focus.',
        image: { uri: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1200&auto=format&fit=crop' },
        habits: [
            { id: 'h-20', title: 'Plan the day in 5 minutes', emoji: '📝' },
            { id: 'h-21', title: 'Single‑task focus block', emoji: '🎯' },
            { id: 'h-22', title: 'Declutter one small area', emoji: '🧺' },
        ],
    },
];

export default function HabitLibrary() {
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [selectedPack, setSelectedPack] = useState<HabitPack | null>(null);
    const [isAddingAll, setIsAddingAll] = useState(false);

    const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);

    const handleOpenPack = (pack: HabitPack) => setSelectedPack(pack);
    const handleClosePack = () => setSelectedPack(null);

    const handleAddAllHabits = async () => {
        if (!user) return;
        // Gate: only premium users can add all from library
        if (!(user as any).is_premium) {
            router.push('/(settings)/subscription');
            return;
        }
        if (!selectedPack) return;
        try {
            setIsAddingAll(true);
            for (const habit of selectedPack.habits) {
                await apiService.createPlan({
                    name: habit.title,
                    color: '#DEEDF4',
                    emoji: habit.emoji || '🌟',
                    duration_minutes: 60,
                    start_time: null,
                    end_time: null,
                    scheduled_date: todayIso,
                    is_anytime: true,
                    repeat_type: 'daily',
                    reminder_at_start: true,
                    reminder_at_end: false,
                    reminder_before_minutes: 0,
                    checklist: [],
                    notes: ''
                });
            }
            showToast('All habits added!', 'success');
            setSelectedPack(null);
            router.push('/(tabs)');
        } catch (e) {
            showToast('Failed to add habits', 'error');
        } finally {
            setIsAddingAll(false);
        }
    };

    const handleHabitSelect = (habit: HabitItem) => {
        router.push({ pathname: '/(hobbies)/details', params: { planName: habit.title } });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F9FF' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F0F9FF" />

            {/* Header */}
            <View style={{
                paddingTop: 10,
                paddingHorizontal: 20,
                paddingBottom: 20,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Pressable
                    onPress={() => router.back()}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16
                    }}
                >
                    <Text style={{ fontSize: 18, color: '#6B7280' }}>✕</Text>
                </Pressable>
                <Text style={{
                    fontFamily: 'Poppins_700Bold',
                    fontSize: 24,
                    color: '#111827',
                    flex: 1
                }}>
                    Habit Library
                </Text>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                {/* Card grid */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {habitPacks.map((pack) => (
                        <Pressable
                            key={pack.id}
                            onPress={() => handleOpenPack(pack)}
                            style={{ width: '48%', borderRadius: 16, overflow: 'hidden', backgroundColor: 'white', marginBottom: 16 }}
                        >
                            <ImageBackground
                                source={pack.image}
                                resizeMode="cover"
                                style={{ height: 200, justifyContent: 'flex-end' }}
                            >
                                <View style={{ padding: 12 }}>
                                    <Text style={{ color: 'white', fontFamily: 'Poppins_700Bold', fontSize: 18 }}>{pack.title}</Text>
                                    <Text style={{ color: 'white', fontFamily: 'Poppins_400Regular', fontSize: 12 }}>{pack.subtitle}</Text>
                                </View>
                            </ImageBackground>
                        </Pressable>
                    ))}
                </View>

                {/* Footer CTA */}
                <Pressable
                    onPress={() => router.push('/(hobbies)/create')}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        paddingVertical: 18,
                        paddingHorizontal: 16,
                        alignItems: 'center',
                        marginTop: 12,
                        marginBottom: 28,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 2
                    }}
                >
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: '#111827' }}>Browse all habits →</Text>
                </Pressable>
            </ScrollView>

            {/* Pack Overlay */}
            <Modal visible={!!selectedPack} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ flex: 1, backgroundColor: '#fff' }}>
                        {/* Top hero */}
                        <ImageBackground
                            source={selectedPack?.image}
                            resizeMode="cover"
                            style={{ height: 320, paddingTop: 40, paddingHorizontal: 20, justifyContent: 'flex-end' }}
                        >
                            <Pressable onPress={handleClosePack} style={{ position: 'absolute', top: 40, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 18, color: '#374151' }}>✕</Text>
                            </Pressable>
                            <Text style={{ color: 'white', fontFamily: 'Poppins_700Bold', fontSize: 32 }}>{selectedPack?.title}</Text>
                            <Text style={{ color: 'white', fontFamily: 'Poppins_400Regular', fontSize: 16, marginBottom: 12 }}>{selectedPack?.subtitle}</Text>
                            <Pressable
                                disabled={isAddingAll}
                                onPress={handleAddAllHabits}
                                style={{ backgroundColor: 'white', borderRadius: 24, paddingVertical: 12, alignItems: 'center', marginBottom: 16 }}
                            >
                                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: '#111827' }}>{isAddingAll ? 'Adding...' : ((user as any)?.is_premium ? 'Add all habits' : 'Unlock with Premium')}</Text>
                            </Pressable>
                            <Text style={{ color: 'white', fontFamily: 'Poppins_400Regular', fontSize: 12, marginBottom: 12, opacity: 0.9 }}>{selectedPack?.description}</Text>
                        </ImageBackground>

                        {/* Habits list */}
                        <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }}>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827', marginBottom: 12 }}>Daily</Text>
                            {selectedPack?.habits.map((habit) => (
                                <Pressable
                                    key={habit.id}
                                    onPress={() => handleHabitSelect(habit)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                        borderRadius: 24,
                                        paddingVertical: 16,
                                        paddingHorizontal: 16,
                                        marginBottom: 12,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 2,
                                        elevation: 1
                                    }}
                                >
                                    <Text style={{ fontSize: 22, marginRight: 12 }}>{habit.emoji || '🌟'}</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: '#111827' }}>{habit.title}</Text>
                                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280' }}>Repeats Daily</Text>
                                    </View>
                                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 18, color: '#6B7280' }}>+</Text>
                                    </View>
                                </Pressable>
                            ))}
                            <View style={{ height: 32 }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

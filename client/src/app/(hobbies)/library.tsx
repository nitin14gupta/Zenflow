import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StatusBar, ImageBackground, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '../../api/apiService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, AntDesign } from '@expo/vector-icons';

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
        image: require('../../../assets/images/habitLib1.png'),
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
        image: require('../../../assets/images/habitLib2.png'),
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
        image: require('../../../assets/images/habitLib3.png'),
        habits: [
            { id: 'h-11', title: 'Tidy desk', emoji: '🧹' },
            { id: 'h-12', title: 'Quick vacuum', emoji: '🧼' },
            { id: 'h-13', title: 'Wipe counters', emoji: '🧽' },
        ],
    },
    {
        id: 'pack-4',
        title: 'Get In Shape & Feel Great',
        subtitle: 'Exercise and food habits',
        description: 'Build momentum with simple everyday moves and smart nutrition.',
        image: require('../../../assets/images/habitLib4.png'),
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
        image: require('../../../assets/images/habitLib5.png'),
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
        image: require('../../../assets/images/habitLib6.png'),
        habits: [
            { id: 'h-20', title: 'Plan the day in 5 minutes', emoji: '📝' },
            { id: 'h-21', title: 'Single‑task focus block', emoji: '🎯' },
            { id: 'h-22', title: 'Declutter one small area', emoji: '🧺' },
        ],
    },
    // {
    //     id: 'pack-7',
    //     title: 'Better Sleep Tonight',
    //     subtitle: 'Wind down the right way',
    //     description: 'Habits to calm your body and mind for restful sleep.',
    //     image: require('../../../assets/images/habitLib4.png'),
    //     habits: [
    //         { id: 'h-23', title: 'No caffeine after 6 PM', emoji: '☕' },
    //         { id: 'h-24', title: 'Digital sunset (no screens 1 hr before bed)', emoji: '📴' },
    //         { id: 'h-25', title: 'Read or journal before bed', emoji: '📖' },
    //     ],
    // },
    // {
    //     id: 'pack-8',
    //     title: 'Mindful Living',
    //     subtitle: 'Be present every day',
    //     description: 'Small steps to slow down and enjoy the moment.',
    //     image: require('../../../assets/images/habitLib3.png'),
    //     habits: [
    //         { id: 'h-26', title: '5-minute deep breathing', emoji: '🌬️' },
    //         { id: 'h-27', title: 'Gratitude journaling', emoji: '🙏' },
    //         { id: 'h-28', title: 'Eat one meal mindfully', emoji: '🥢' },
    //     ],
    // },
    // {
    //     id: 'pack-9',
    //     title: 'Money Matters',
    //     subtitle: 'Financial discipline',
    //     description: 'Simple financial habits to build long-term security.',
    //     image: require('../../../assets/images/habitLib2.png'),
    //     habits: [
    //         { id: 'h-29', title: 'Track daily expenses', emoji: '💸' },
    //         { id: 'h-30', title: 'Save spare change', emoji: '🏦' },
    //         { id: 'h-31', title: 'Review budget weekly', emoji: '📊' },
    //     ],
    // },
    // {
    //     id: 'pack-10',
    //     title: 'Boost Productivity',
    //     subtitle: 'Work smarter, not harder',
    //     description: 'Habits to stay sharp and focused at work or study.',
    //     image: require('../../../assets/images/habitLib1.png'),
    //     habits: [
    //         { id: 'h-32', title: 'Use a priority list', emoji: '🗂️' },
    //         { id: 'h-33', title: 'Pomodoro technique (25/5)', emoji: '⏲️' },
    //         { id: 'h-34', title: 'End the day with recap', emoji: '📋' },
    //     ],
    // },
    // {
    //     id: 'pack-11',
    //     title: 'Creative Mindset',
    //     subtitle: 'Spark inspiration daily',
    //     description: 'Build habits that keep your creativity flowing.',
    //     image: require('../../../assets/images/habitLib1.png'),
    //     habits: [
    //         { id: 'h-35', title: 'Sketch or doodle daily', emoji: '✏️' },
    //         { id: 'h-36', title: 'Capture one new idea', emoji: '💡' },
    //         { id: 'h-37', title: 'Listen to new music', emoji: '🎧' },
    //     ],
    // },
    // {
    //     id: 'pack-12',
    //     title: 'Strong Relationships',
    //     subtitle: 'Stay connected',
    //     description: 'Simple habits to strengthen bonds with family and friends.',
    //     image: require('../../../assets/images/habitLib2.png'),
    //     habits: [
    //         { id: 'h-38', title: 'Send a kind message', emoji: '💌' },
    //         { id: 'h-39', title: 'Call a loved one', emoji: '📞' },
    //         { id: 'h-40', title: 'Plan quality time', emoji: '👨‍👩‍👧‍👦' },
    //     ],
    // },
    // {
    //     id: 'pack-13',
    //     title: 'Career Growth',
    //     subtitle: 'Level up professionally',
    //     description: 'Habits to grow skills and move your career forward.',
    //     image: require('../../../assets/images/habitLib3.png'),
    //     habits: [
    //         { id: 'h-41', title: 'Read industry news', emoji: '📰' },
    //         { id: 'h-42', title: 'Learn one new skill', emoji: '🛠️' },
    //         { id: 'h-43', title: 'Update your LinkedIn', emoji: '💼' },
    //     ],
    // },
    // {
    //     id: 'pack-14',
    //     title: 'Healthy Eating',
    //     subtitle: 'Fuel your body right',
    //     description: 'Nutrition habits to feel energized and balanced.',
    //     image: require('../../../assets/images/habitLib4.png'),
    //     habits: [
    //         { id: 'h-44', title: 'Eat 5 servings of fruits & veggies', emoji: '🥦' },
    //         { id: 'h-45', title: 'Limit added sugar', emoji: '🍬' },
    //         { id: 'h-46', title: 'Cook one healthy meal', emoji: '🍲' },
    //     ],
    // },
    // {
    //     id: 'pack-15',
    //     title: 'Student Success',
    //     subtitle: 'Study smarter',
    //     description: 'Habits for focus, learning, and academic success.',
    //     image: require('../../../assets/images/habitLib5.png'),
    //     habits: [
    //         { id: 'h-47', title: 'Review notes daily', emoji: '📒' },
    //         { id: 'h-48', title: 'Practice active recall', emoji: '🧠' },
    //         { id: 'h-49', title: 'Stay consistent with schedule', emoji: '📅' },
    //     ],
    // },
    // {
    //     id: 'pack-16',
    //     title: 'Self-Love Routine',
    //     subtitle: 'Care for yourself',
    //     description: 'Daily habits to nurture confidence and kindness to yourself.',
    //     image: require('../../../assets/images/habitLib6.png'),
    //     habits: [
    //         { id: 'h-50', title: 'Positive affirmations', emoji: '🌸' },
    //         { id: 'h-51', title: 'Treat yourself kindly', emoji: '🍫' },
    //         { id: 'h-52', title: 'Reflect on wins of the day', emoji: '🏆' },
    //     ],
    // },
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
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Header */}
            <View style={{
                paddingTop: 10,
                paddingHorizontal: 24,
                paddingBottom: 14,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB'
            }}>
                <Pressable
                    onPress={() => router.back()}
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: '#F3F4F6',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16
                    }}
                >
                    <Ionicons name="arrow-back-outline" size={20} color="#6B7280" />
                </Pressable>
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontFamily: 'Poppins_700Bold',
                        fontSize: 28,
                        color: '#111827',
                    }}>
                        Habit Library
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: '#6B7280'
                    }}>
                        Choose from 100+ pre-made habits
                    </Text>
                </View>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
                {/* Stats Section */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 20,
                    marginTop: 20,
                    marginBottom: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: '#111827' }}>6</Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280' }}>Packs</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: '#111827' }}>22</Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280' }}>Habits</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24, color: '#111827' }}>100+</Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280' }}>Total</Text>
                        </View>
                    </View>
                </View>

                {/* Card grid */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 }}>
                    {habitPacks.map((pack, index) => (
                        <Pressable
                            key={pack.id}
                            onPress={() => handleOpenPack(pack)}
                            style={{
                                width: '48%',
                                borderRadius: 20,
                                overflow: 'hidden',
                                backgroundColor: 'white',
                                marginBottom: 16,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 4
                            }}
                        >
                            <ImageBackground
                                source={pack.image}
                                resizeMode="cover"
                                style={{ height: 300, justifyContent: 'flex-end' }}
                            >
                                <View style={{
                                    padding: 16,
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20
                                }}>
                                    <Text style={{ color: 'white', fontFamily: 'Poppins_700Bold', fontSize: 16, marginBottom: 4 }}>
                                        {pack.title}
                                    </Text>
                                    <Text style={{ color: 'white', fontFamily: 'Poppins_400Regular', fontSize: 12, opacity: 0.9 }}>
                                        {pack.subtitle}
                                    </Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 8
                                    }}>
                                        <Text style={{ color: 'white', fontFamily: 'Poppins_600SemiBold', fontSize: 12 }}>
                                            {pack.habits.length} habits
                                        </Text>
                                        <Text style={{ color: 'white', marginHorizontal: 8 }}>•</Text>
                                        <Text style={{ color: 'white', fontFamily: 'Poppins_400Regular', fontSize: 12 }}>
                                            Daily
                                        </Text>
                                    </View>
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
                        borderRadius: 20,
                        paddingVertical: 20,
                        paddingHorizontal: 24,
                        alignItems: 'center',
                        marginBottom: 32,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 4,
                        borderWidth: 2,
                        borderColor: '#F3F4F6'
                    }}
                >
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: '#111827', marginBottom: 4 }}>
                        Create Custom Habit
                    </Text>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#6B7280' }}>
                        Build your own personalized routine
                    </Text>
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
                            style={{ height: 400, paddingHorizontal: 24, justifyContent: 'flex-end' }}
                        >
                            <Pressable onPress={handleClosePack} style={{
                                position: 'absolute',
                                top: 50,
                                left: 24,
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 4
                            }}>
                                <Text style={{ fontSize: 20, color: '#374151' }}>✕</Text>
                            </Pressable>

                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ color: 'white', fontFamily: 'Poppins_700Bold', fontSize: 32, marginBottom: 8 }}>
                                    {selectedPack?.title}
                                </Text>
                                <Text style={{ color: 'white', fontFamily: 'Poppins_400Regular', fontSize: 16, marginBottom: 16, opacity: 0.9 }}>
                                    {selectedPack?.subtitle}
                                </Text>

                                <View style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: 16,
                                    padding: 16,
                                    marginBottom: 16,
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <Text style={{ color: 'white', fontFamily: 'Poppins_400Regular', fontSize: 14, lineHeight: 20 }}>
                                        {selectedPack?.description}
                                    </Text>
                                </View>

                                <Pressable
                                    disabled={isAddingAll}
                                    onPress={handleAddAllHabits}
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: 16,
                                        paddingVertical: 16,
                                        alignItems: 'center',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 8,
                                        elevation: 4
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: 'Poppins_600SemiBold',
                                        fontSize: 16,
                                        color: '#111827'
                                    }}>
                                        {isAddingAll ? 'Adding...' : ((user as any)?.is_premium ? 'Add All Habits' : 'Unlock with Premium')}
                                    </Text>
                                </Pressable>
                            </View>
                        </ImageBackground>

                        {/* Habits list */}
                        <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 20
                            }}>
                                <Text style={{
                                    fontFamily: 'Poppins_700Bold',
                                    fontSize: 20,
                                    color: '#111827',
                                    flex: 1
                                }}>
                                    Daily Habits
                                </Text>
                                <View style={{
                                    backgroundColor: '#F3F4F6',
                                    borderRadius: 12,
                                    paddingHorizontal: 12,
                                    paddingVertical: 6
                                }}>
                                    <Text style={{
                                        fontFamily: 'Poppins_600SemiBold',
                                        fontSize: 12,
                                        color: '#6B7280'
                                    }}>
                                        {selectedPack?.habits.length} habits
                                    </Text>
                                </View>
                            </View>

                            {selectedPack?.habits.map((habit, index) => (
                                <Pressable
                                    key={habit.id}
                                    onPress={() => handleHabitSelect(habit)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                        borderRadius: 16,
                                        paddingVertical: 16,
                                        paddingHorizontal: 16,
                                        marginBottom: 12,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 4,
                                        elevation: 2,
                                        borderWidth: 1,
                                        borderColor: '#F3F4F6'
                                    }}
                                >
                                    <View style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 24,
                                        backgroundColor: '#F8FAFC',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 16
                                    }}>
                                        <Text style={{ fontSize: 24 }}>{habit.emoji || '🌟'}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{
                                            fontFamily: 'Poppins_600SemiBold',
                                            fontSize: 16,
                                            color: '#111827',
                                            marginBottom: 4
                                        }}>
                                            {habit.title}
                                        </Text>
                                        <Text style={{
                                            fontFamily: 'Poppins_400Regular',
                                            fontSize: 12,
                                            color: '#6B7280'
                                        }}>
                                            Repeats Daily • {habit.duration || '1h'}
                                        </Text>
                                    </View>
                                    <View style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 18,
                                        backgroundColor: '#F3F4F6',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{ fontSize: 18, color: '#6B7280' }}>+</Text>
                                    </View>
                                </Pressable>
                            ))}
                            <View style={{ height: 40 }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    );
}

import React from 'react';
import { View, Text, Pressable, ScrollView, StatusBar } from 'react-native';
import { colors } from '../../components/ui';
import { useRouter } from 'expo-router';

const habitCategories = [
    {
        id: '1',
        title: 'Health & Fitness',
        habits: [
            { id: '1', emoji: '🏃‍♀️', title: 'Morning Run', duration: '30m' },
            { id: '2', emoji: '💪', title: 'Workout', duration: '1h' },
            { id: '3', emoji: '🧘‍♀️', title: 'Meditation', duration: '15m' },
            { id: '4', emoji: '🥗', title: 'Healthy Meal Prep', duration: '1h' }
        ]
    },
    {
        id: '2',
        title: 'Productivity',
        habits: [
            { id: '5', emoji: '📚', title: 'Read 30 pages', duration: '45m' },
            { id: '6', emoji: '📝', title: 'Journal Writing', duration: '20m' },
            { id: '7', emoji: '🎯', title: 'Goal Planning', duration: '30m' },
            { id: '8', emoji: '📧', title: 'Email Management', duration: '15m' }
        ]
    },
    {
        id: '3',
        title: 'Home & Organization',
        habits: [
            { id: '9', emoji: '🧹', title: 'Deep Clean Room', duration: '1h' },
            { id: '10', emoji: '👗', title: 'Organize Wardrobe', duration: '30m' },
            { id: '11', emoji: '🪟', title: 'Wash Windows', duration: '45m' },
            { id: '12', emoji: '🛋️', title: 'Vacuum Sofa', duration: '20m' }
        ]
    },
    {
        id: '4',
        title: 'Personal Growth',
        habits: [
            { id: '13', emoji: '💡', title: 'Mentor Someone', duration: '1h' },
            { id: '14', emoji: '💖', title: 'Random Act of Kindness', duration: '15m' },
            { id: '15', emoji: '❤️', title: 'Donate to Charity', duration: '10m' },
            { id: '16', emoji: '🎨', title: 'Creative Project', duration: '2h' }
        ]
    }
];

export default function HabitLibrary() {
    const router = useRouter();

    const handleHabitSelect = (habit: any) => {
        router.push({
            pathname: '/(hobbies)/details',
            params: { planName: habit.title }
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F0F9FF' }}>
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
                {habitCategories.map((category) => (
                    <View key={category.id} style={{ marginBottom: 32 }}>
                        <Text style={{
                            fontFamily: 'Poppins_700Bold',
                            fontSize: 18,
                            color: '#111827',
                            marginBottom: 16
                        }}>
                            {category.title}
                        </Text>

                        <View style={{ gap: 12 }}>
                            {category.habits.map((habit) => (
                                <Pressable
                                    key={habit.id}
                                    onPress={() => handleHabitSelect(habit)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                        borderRadius: 12,
                                        padding: 16,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 2,
                                        elevation: 2
                                    }}
                                >
                                    <Text style={{ fontSize: 24, marginRight: 16 }}>{habit.emoji}</Text>
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
                                            fontSize: 14,
                                            color: '#6B7280'
                                        }}>
                                            {habit.duration}
                                        </Text>
                                    </View>
                                    <Pressable style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                        backgroundColor: '#F3F4F6',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{ fontSize: 16, color: '#6B7280' }}>+</Text>
                                    </Pressable>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

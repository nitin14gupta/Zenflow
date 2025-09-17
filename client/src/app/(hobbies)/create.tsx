import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, StatusBar } from 'react-native';
// import { colors } from '../../components/ui';
import { useRouter } from 'expo-router';

const suggestions = [
    { id: '1', emoji: '👗', title: 'Organize wardrobe' },
    { id: '2', emoji: '🪟', title: 'Wash windows' },
    { id: '3', emoji: '💡', title: 'Mentor Someone' },
    { id: '4', emoji: '🛋️', title: 'Vacuum sofa' },
    { id: '5', emoji: '💖', title: 'Do a random act of kindness' },
    { id: '6', emoji: '❤️', title: 'Donate to a Charity' }
];

export default function CreatePlan() {
    const router = useRouter();
    const [planName, setPlanName] = useState('Take a hot bubble bath');

    const handleSuggestionPress = (suggestion: any) => {
        setPlanName(suggestion.title);
    };

    const handleContinue = () => {
        router.push({
            pathname: '/(hobbies)/details',
            params: { planName }
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
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                {/* Input Field */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4
                }}>
                    <TextInput
                        value={planName}
                        onChangeText={setPlanName}
                        placeholder="Enter your plan..."
                        style={{
                            fontFamily: 'Poppins_400Regular',
                            fontSize: 16,
                            color: '#111827',
                            minHeight: 40
                        }}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Suggestions */}
                <Text style={{
                    fontFamily: 'Poppins_700Bold',
                    fontSize: 16,
                    color: '#111827',
                    marginBottom: 16
                }}>
                    SUGGESTIONS
                </Text>

                <View style={{ gap: 12, marginBottom: 40 }}>
                    {suggestions.map((suggestion) => (
                        <Pressable
                            key={suggestion.id}
                            onPress={() => handleSuggestionPress(suggestion)}
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
                            <Text style={{ fontSize: 24, marginRight: 16 }}>{suggestion.emoji}</Text>
                            <Text style={{
                                fontFamily: 'Poppins_400Regular',
                                fontSize: 16,
                                color: '#111827',
                                flex: 1
                            }}>
                                {suggestion.title}
                            </Text>
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

                {/* Continue Button */}
                <Pressable
                    onPress={handleContinue}
                    style={{
                        backgroundColor: '#374151',
                        borderRadius: 12,
                        paddingVertical: 16,
                        alignItems: 'center',
                        marginBottom: 40,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 4
                    }}
                >
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                        color: 'white'
                    }}>
                        Continue
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

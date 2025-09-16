import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, StatusBar, Modal } from 'react-native';
import { colors } from '../../components/ui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { apiService } from '../../api/apiService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const colorOptions = [
    { id: '1', color: '#E8E4F3', name: 'Lavender' },
    { id: '2', color: '#B8D8E7', name: 'Blue' },
    { id: '3', color: '#FFB5A7', name: 'Coral' },
    { id: '4', color: '#FF8A65', name: 'Orange' },
    { id: '5', color: '#A8E6CF', name: 'Mint' },
    { id: '6', color: '#FFD93D', name: 'Yellow' }
];

const durationOptions = [
    { id: '1', label: '5m', value: 5 },
    { id: '2', label: '15m', value: 15 },
    { id: '3', label: '30m', value: 30 },
    { id: '4', label: '45m', value: 45 },
    { id: '5', label: '1h', value: 60 },
    { id: '6', label: '1h 30m', value: 90 },
    { id: '7', label: '2h', value: 120 },
    { id: '8', label: '3h', value: 180 },
    { id: '9', label: '4h', value: 240 }
];

const emojiOptions = [
    '🧘‍♀️', '🏃‍♀️', '📚', '🎨', '🍳', '🧹', '💪', '🎵',
    '🌱', '☕', '🛁', '🎯', '📝', '🎪', '🏠', '🌟',
    '💡', '❤️', '🎭', '🏃‍♂️', '🧘‍♂️', '🎨', '📖', '🎯'
];

const repeatOptions = [
    { id: '1', label: 'Once', value: 'once' },
    { id: '2', label: 'Daily', value: 'daily' },
    { id: '3', label: 'Weekdays', value: 'weekdays' },
    { id: '4', label: 'Weekends', value: 'weekends' },
    { id: '5', label: 'Weekly', value: 'weekly' },
    { id: '6', label: 'Every second week', value: 'biweekly' },
    { id: '7', label: 'Monthly', value: 'monthly' },
    { id: '8', label: 'Custom', value: 'custom' }
];

type ChecklistItem = {
    id: string;
    text: string;
    completed: boolean;
};

export default function PlanDetails() {
    const router = useRouter();
    const { planName } = useLocalSearchParams();
    const { user } = useAuth();
    const { showToast } = useToast();

    // State
    const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
    const [selectedDuration, setSelectedDuration] = useState(durationOptions[4]); // 1h default
    const [selectedEmoji, setSelectedEmoji] = useState('🧘‍♀️');
    const [selectedRepeat, setSelectedRepeat] = useState(repeatOptions[4]); // Weekly default
    const [startTimeText, setStartTimeText] = useState<string>('6:00');
    const [startPeriod, setStartPeriod] = useState<'AM' | 'PM'>('PM');
    const [endTimeText, setEndTimeText] = useState<string>('8:00');
    const [endPeriod, setEndPeriod] = useState<'AM' | 'PM'>('PM');
    const [isAnytime, setIsAnytime] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reminders, setReminders] = useState({
        atStart: true,
        atEnd: false,
        beforeStart: false
    });
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [notes, setNotes] = useState('');

    // Modal states
    const [showDurationModal, setShowDurationModal] = useState(false);
    const [showRepeatModal, setShowRepeatModal] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [showEmojiModal, setShowEmojiModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);

    const getCurrentDate = () => {
        return selectedDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getCurrentTime = () => {
        return selectedDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleAddChecklist = () => {
        setChecklist([...checklist, { id: Date.now().toString(), text: '', completed: false }]);
    };

    const handleRemoveChecklist = (id: string) => {
        setChecklist(checklist.filter(item => item.id !== id));
    };

    const handleUpdateChecklist = (id: string, text: string) => {
        setChecklist(checklist.map(item =>
            item.id === id ? { ...item, text } : item
        ));
    };

    const handleSave = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const planData = {
                name: planName,
                color: selectedColor.color,
                emoji: selectedEmoji,
                duration_minutes: selectedDuration.value,
                start_time: isAnytime ? null : `${startTimeText} ${startPeriod}`,
                end_time: isAnytime ? null : `${endTimeText} ${endPeriod}`,
                scheduled_date: selectedDate.toISOString().split('T')[0],
                is_anytime: isAnytime,
                repeat_type: selectedRepeat.value,
                reminder_at_start: reminders.atStart,
                reminder_at_end: reminders.atEnd,
                reminder_before_minutes: reminders.beforeStart ? 5 : 0,
                checklist: checklist,
                notes: notes
            };

            const response = await apiService.createPlan(planData);
            if (response.success) {
                showToast('Plan created successfully!', 'success');
                router.push('/(tabs)');
            } else {
                showToast(response.error || 'Failed to create plan', 'error');
            }
        } catch (error) {
            showToast('Failed to create plan', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: selectedColor.color }}>
            <StatusBar barStyle="dark-content" backgroundColor={selectedColor.color} />

            {/* Header */}
            <View style={{
                paddingTop: 10,
                paddingHorizontal: 20,
                paddingBottom: 20,
                flexDirection: 'row',
                alignItems: 'center'
            }}>

                <Pressable
                    onPress={() => router.push('/(tabs)')}
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
                {/* Activity Name */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4
                }}>
                    <TextInput
                        value={planName as string}
                        style={{
                            fontFamily: 'Poppins_600SemiBold',
                            fontSize: 18,
                            color: '#111827'
                        }}
                    />
                </View>

                {/* Color Selection */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4
                }}>
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                        color: '#6B7280',
                        marginBottom: 16
                    }}>
                        Color
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        {colorOptions.map((color) => (
                            <Pressable
                                key={color.id}
                                onPress={() => setSelectedColor(color)}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: color.color,
                                    borderWidth: selectedColor.id === color.id ? 3 : 0,
                                    borderColor: '#10B981'
                                }}
                            />
                        ))}
                    </View>
                </View>

                {/* Duration and Time */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4
                }}>
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                        color: '#6B7280',
                        marginBottom: 16
                    }}>
                        Duration
                    </Text>

                    {/* Duration */}
                    <Pressable
                        onPress={() => setShowDurationModal(true)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#F9FAFB',
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 16
                        }}
                    >
                        <Text style={{ fontSize: 20, marginRight: 12 }}>🕐</Text>
                        <Text style={{
                            fontFamily: 'Poppins_600SemiBold',
                            fontSize: 16,
                            color: '#111827'
                        }}>
                            {selectedDuration.label}
                        </Text>
                    </Pressable>

                    {/* Time */}
                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                        <View style={{
                            flex: 1,
                            backgroundColor: '#F9FAFB',
                            borderRadius: 12,
                            padding: 12,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            opacity: isAnytime ? 0.6 : 1
                        }}>
                            <TextInput
                                editable={!isAnytime}
                                value={startTimeText}
                                onChangeText={setStartTimeText}
                                keyboardType="numbers-and-punctuation"
                                placeholder="6:00"
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins_600SemiBold',
                                    fontSize: 16,
                                    color: '#111827'
                                }}
                            />
                            <Pressable
                                disabled={isAnytime}
                                onPress={() => setStartPeriod(startPeriod === 'AM' ? 'PM' : 'AM')}
                                style={{
                                    marginLeft: 8,
                                    paddingVertical: 6,
                                    paddingHorizontal: 10,
                                    borderRadius: 8,
                                    backgroundColor: '#fff',
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB'
                                }}
                            >
                                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#111827' }}>{startPeriod}</Text>
                            </Pressable>
                        </View>
                        <Text style={{ alignSelf: 'center', fontSize: 16, color: '#6B7280' }}>→</Text>
                        <View style={{
                            flex: 1,
                            backgroundColor: '#F9FAFB',
                            borderRadius: 12,
                            padding: 12,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            opacity: isAnytime ? 0.6 : 1
                        }}>
                            <TextInput
                                editable={!isAnytime}
                                value={endTimeText}
                                onChangeText={setEndTimeText}
                                keyboardType="numbers-and-punctuation"
                                placeholder="8:00"
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins_600SemiBold',
                                    fontSize: 16,
                                    color: '#111827'
                                }}
                            />
                            <Pressable
                                disabled={isAnytime}
                                onPress={() => setEndPeriod(endPeriod === 'AM' ? 'PM' : 'AM')}
                                style={{
                                    marginLeft: 8,
                                    paddingVertical: 6,
                                    paddingHorizontal: 10,
                                    borderRadius: 8,
                                    backgroundColor: '#fff',
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB'
                                }}
                            >
                                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#111827' }}>{endPeriod}</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Date */}
                    <Pressable onPress={() => setShowDateModal(true)} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#F9FAFB',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 12
                    }}>
                        <Text style={{ fontSize: 20, marginRight: 12 }}>📅</Text>
                        <Text style={{
                            fontFamily: 'Poppins_600SemiBold',
                            fontSize: 16,
                            color: '#111827'
                        }}>
                            {getCurrentDate()}
                        </Text>
                    </Pressable>

                    {/* Anytime */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#111827' }}>
                            Anytime
                        </Text>
                        <Pressable
                            onPress={() => setIsAnytime(!isAnytime)}
                            style={{
                                width: 50,
                                height: 30,
                                borderRadius: 15,
                                backgroundColor: isAnytime ? '#10B981' : '#D1D5DB',
                                alignItems: isAnytime ? 'flex-end' : 'flex-start',
                                justifyContent: 'center',
                                paddingHorizontal: 2
                            }}
                        >
                            <View style={{
                                width: 26,
                                height: 26,
                                borderRadius: 13,
                                backgroundColor: 'white'
                            }} />
                        </Pressable>
                    </View>
                </View>

                {/* Emoji Selection */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4
                }}>
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                        color: '#6B7280',
                        marginBottom: 16
                    }}>
                        Emoji
                    </Text>
                    <Pressable
                        onPress={() => setShowEmojiModal(true)}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: '#F9FAFB',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center'
                        }}
                    >
                        <Text style={{ fontSize: 40 }}>{selectedEmoji}</Text>
                    </Pressable>
                </View>

                {/* Repeat Section */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4
                }}>
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                        color: '#6B7280',
                        marginBottom: 16
                    }}>
                        Repeat
                    </Text>
                    <Pressable
                        onPress={() => setShowRepeatModal(true)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#F9FAFB',
                            borderRadius: 12,
                            padding: 16
                        }}
                    >
                        <Text style={{ fontSize: 20, marginRight: 12 }}>🔄</Text>
                        <Text style={{
                            fontFamily: 'Poppins_600SemiBold',
                            fontSize: 16,
                            color: '#111827'
                        }}>
                            {selectedRepeat.label}
                        </Text>
                    </Pressable>
                </View>

                {/* Reminders Section */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4
                }}>
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                        color: '#6B7280',
                        marginBottom: 16
                    }}>
                        Reminders
                    </Text>

                    <View style={{ gap: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#111827' }}>
                                At the start
                            </Text>
                            <Pressable
                                onPress={() => setReminders({ ...reminders, atStart: !reminders.atStart })}
                                style={{
                                    width: 50,
                                    height: 30,
                                    borderRadius: 15,
                                    backgroundColor: reminders.atStart ? '#10B981' : '#D1D5DB',
                                    alignItems: reminders.atStart ? 'flex-end' : 'flex-start',
                                    justifyContent: 'center',
                                    paddingHorizontal: 2
                                }}
                            >
                                <View style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 13,
                                    backgroundColor: 'white'
                                }} />
                            </Pressable>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#111827' }}>
                                At the end
                            </Text>
                            <Pressable
                                onPress={() => setReminders({ ...reminders, atEnd: !reminders.atEnd })}
                                style={{
                                    width: 50,
                                    height: 30,
                                    borderRadius: 15,
                                    backgroundColor: reminders.atEnd ? '#10B981' : '#D1D5DB',
                                    alignItems: reminders.atEnd ? 'flex-end' : 'flex-start',
                                    justifyContent: 'center',
                                    paddingHorizontal: 2
                                }}
                            >
                                <View style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 13,
                                    backgroundColor: 'white'
                                }} />
                            </Pressable>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#111827' }}>
                                5 mins before start
                            </Text>
                            <Pressable
                                onPress={() => setReminders({ ...reminders, beforeStart: !reminders.beforeStart })}
                                style={{
                                    width: 50,
                                    height: 30,
                                    borderRadius: 15,
                                    backgroundColor: reminders.beforeStart ? '#10B981' : '#D1D5DB',
                                    alignItems: reminders.beforeStart ? 'flex-end' : 'flex-start',
                                    justifyContent: 'center',
                                    paddingHorizontal: 2
                                }}
                            >
                                <View style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 13,
                                    backgroundColor: 'white'
                                }} />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Checklist Section */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4
                }}>
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                        color: '#6B7280',
                        marginBottom: 16
                    }}>
                        Checklist
                    </Text>

                    {checklist.map((item) => (
                        <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <View style={{
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: '#D1D5DB',
                                marginRight: 12
                            }} />
                            <TextInput
                                value={item.text}
                                onChangeText={(text) => handleUpdateChecklist(item.id, text)}
                                placeholder="Checklist item"
                                style={{
                                    flex: 1,
                                    fontFamily: 'Poppins_400Regular',
                                    fontSize: 16,
                                    color: '#111827'
                                }}
                            />
                            <Pressable onPress={() => handleRemoveChecklist(item.id)}>
                                <Text style={{ fontSize: 20, color: '#EF4444' }}>🗑️</Text>
                            </Pressable>
                        </View>
                    ))}

                    <Pressable
                        onPress={handleAddChecklist}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#F9FAFB',
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 8
                        }}
                    >
                        <Text style={{ fontSize: 20, marginRight: 12 }}>+</Text>
                        <Text style={{
                            fontFamily: 'Poppins_600SemiBold',
                            fontSize: 16,
                            color: '#111827'
                        }}>
                            Add Checklist
                        </Text>
                    </Pressable>

                    <Pressable style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#F9FAFB',
                        borderRadius: 12,
                        padding: 16
                    }}>
                        <Text style={{ fontSize: 20, marginRight: 12 }}>✨</Text>
                        <Text style={{
                            fontFamily: 'Poppins_600SemiBold',
                            fontSize: 16,
                            color: '#111827'
                        }}>
                            Add with AI magic
                        </Text>
                    </Pressable>
                </View>

                {/* Notes Section */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4
                }}>
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                        color: '#6B7280',
                        marginBottom: 16
                    }}>
                        Notes
                    </Text>
                    <Pressable
                        onPress={() => setShowNotesModal(true)}
                        style={{
                            backgroundColor: '#F9FAFB',
                            borderRadius: 12,
                            padding: 16,
                            minHeight: 100,
                            justifyContent: 'center'
                        }}
                    >
                        <Text style={{
                            fontFamily: 'Poppins_400Regular',
                            fontSize: 16,
                            color: notes ? '#111827' : '#9CA3AF'
                        }}>
                            {notes || 'Add Notes'}
                        </Text>
                    </Pressable>
                </View>

                {/* Add Button */}
                <Pressable
                    onPress={handleSave}
                    disabled={isLoading}
                    style={{
                        backgroundColor: '#111827',
                        borderRadius: 16,
                        paddingVertical: 16,
                        alignItems: 'center',
                        marginBottom: 40,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 4,
                        opacity: isLoading ? 0.7 : 1
                    }}
                >
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                        color: 'white'
                    }}>
                        {isLoading ? 'Adding...' : 'Add'}
                    </Text>
                </Pressable>
            </ScrollView>

            {/* Duration Modal */}
            <Modal visible={showDurationModal} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
                        <View style={{ width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827', marginBottom: 20, textAlign: 'center' }}>
                            Duration {selectedDuration.label}
                        </Text>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                            {durationOptions.map((duration) => (
                                <Pressable
                                    key={duration.id}
                                    onPress={() => setSelectedDuration(duration)}
                                    style={{
                                        width: '30%',
                                        backgroundColor: selectedDuration.id === duration.id ? '#10B981' : '#F9FAFB',
                                        borderRadius: 12,
                                        padding: 16,
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: 'Poppins_600SemiBold',
                                        fontSize: 16,
                                        color: selectedDuration.id === duration.id ? 'white' : '#111827'
                                    }}>
                                        {duration.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <Pressable style={{
                            backgroundColor: '#F9FAFB',
                            borderRadius: 12,
                            padding: 16,
                            alignItems: 'center',
                            marginBottom: 20
                        }}>
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: '#111827' }}>
                                Custom
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setShowDurationModal(false)}
                            style={{
                                backgroundColor: '#111827',
                                borderRadius: 12,
                                padding: 16,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: 'white' }}>
                                Save
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Date Modal */}
            <Modal visible={showDateModal} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
                        <View style={{ width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827', marginBottom: 16, textAlign: 'center' }}>
                            Select Date
                        </Text>

                        <ScrollView style={{ maxHeight: 320 }}>
                            {Array.from({ length: 60 }).map((_, idx) => {
                                const d = new Date();
                                d.setDate(d.getDate() + idx);
                                const isSelected = d.toDateString() === selectedDate.toDateString();
                                return (
                                    <Pressable key={idx} onPress={() => setSelectedDate(new Date(d))} style={{
                                        paddingVertical: 12,
                                        paddingHorizontal: 8,
                                        borderRadius: 10,
                                        backgroundColor: isSelected ? '#F3F4F6' : 'transparent'
                                    }}>
                                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#111827' }}>
                                            {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>

                        <Pressable
                            onPress={() => setShowDateModal(false)}
                            style={{
                                backgroundColor: '#111827',
                                borderRadius: 12,
                                padding: 16,
                                alignItems: 'center',
                                marginTop: 16
                            }}
                        >
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: 'white' }}>
                                Save
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Repeat Modal */}
            <Modal visible={showRepeatModal} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
                        <View style={{ width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827', marginBottom: 20, textAlign: 'center' }}>
                            Repeat
                        </Text>

                        {repeatOptions.map((option, index) => (
                            <Pressable
                                key={option.id}
                                onPress={() => setSelectedRepeat(option)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingVertical: 16,
                                    borderBottomWidth: index < repeatOptions.length - 1 ? 1 : 0,
                                    borderBottomColor: '#E5E7EB'
                                }}
                            >
                                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#111827' }}>
                                    {option.label}
                                </Text>
                                {selectedRepeat.id === option.id && (
                                    <Text style={{ fontSize: 20, color: '#111827' }}>✓</Text>
                                )}
                            </Pressable>
                        ))}

                        <Pressable
                            onPress={() => setShowRepeatModal(false)}
                            style={{
                                backgroundColor: '#F9FAFB',
                                borderRadius: 12,
                                padding: 16,
                                alignItems: 'center',
                                marginTop: 20
                            }}
                        >
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: '#111827' }}>
                                Save
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Notes Modal */}
            <Modal visible={showNotesModal} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
                        <View style={{ width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827', marginBottom: 20, textAlign: 'center' }}>
                            Add Notes
                        </Text>

                        <TextInput
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Add your notes here..."
                            multiline
                            maxLength={200}
                            style={{
                                backgroundColor: '#F9FAFB',
                                borderRadius: 12,
                                padding: 16,
                                minHeight: 120,
                                textAlignVertical: 'top',
                                fontFamily: 'Poppins_400Regular',
                                fontSize: 16,
                                color: '#111827'
                            }}
                        />

                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280', textAlign: 'right', marginTop: 8 }}>
                            {notes.length}/200
                        </Text>

                        <Pressable
                            onPress={() => setShowNotesModal(false)}
                            style={{
                                backgroundColor: '#111827',
                                borderRadius: 12,
                                padding: 16,
                                alignItems: 'center',
                                marginTop: 20
                            }}
                        >
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: 'white' }}>
                                Save
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Emoji Modal */}
            <Modal visible={showEmojiModal} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
                        <View style={{ width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827', marginBottom: 20, textAlign: 'center' }}>
                            Select Emoji
                        </Text>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                            {emojiOptions.map((emoji, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => {
                                        setSelectedEmoji(emoji);
                                        setShowEmojiModal(false);
                                    }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        backgroundColor: selectedEmoji === emoji ? '#10B981' : '#F9FAFB',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text style={{ fontSize: 24 }}>{emoji}</Text>
                                </Pressable>
                            ))}
                        </View>

                        <Pressable
                            onPress={() => setShowEmojiModal(false)}
                            style={{
                                backgroundColor: '#F9FAFB',
                                borderRadius: 12,
                                padding: 16,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: '#111827' }}>
                                Cancel
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
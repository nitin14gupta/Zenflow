import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { apiService } from '../../api/apiService';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyPlans, setDailyPlans] = useState<any[]>([]);
  const [anytimePlans, setAnytimePlans] = useState<any[]>([]);
  const [confettiAt, setConfettiAt] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showDaily, setShowDaily] = useState(true);
  const [showAnytime, setShowAnytime] = useState(true);
  const scrollRef = useRef<ScrollView>(null);
  const [didScrollToToday, setDidScrollToToday] = useState(false);

  const loadPlans = useCallback(async () => {
    if (!user?.id) return;
    const res = await apiService.getUserPlans(user.id);
    if (res.success) {
      const plans = res.data.plans || res.data || [];
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      const todays = plans.filter((p: any) => p.scheduled_date === selectedDateStr && !p.is_anytime);
      const anytimes = plans.filter((p: any) => p.scheduled_date === selectedDateStr && p.is_anytime);
      setDailyPlans(todays);
      setAnytimePlans(anytimes);
    }
  }, [user?.id, selectedDate]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  useFocusEffect(
    useCallback(() => {
      loadPlans();
    }, [loadPlans])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPlans();
    setRefreshing(false);
  }, [loadPlans]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [modalPlan, setModalPlan] = useState<any | null>(null);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTimelineDays = () => {
    const today = new Date();
    const days = [] as any[];

    // 10 days before today and 30 days after today
    for (let i = -10; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: date
      });
    }
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleProfilePress = () => {
    router.push('/(settings)');
  };

  const handleCreatePlan = () => {
    setShowCreateModal(true);
  };

  const handleCreateMyOwn = () => {
    setShowCreateModal(false);
    router.push('/(hobbies)/create');
  };

  const handleHabitLibrary = () => {
    setShowCreateModal(false);
    router.push('/(hobbies)/library');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF9F0' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF9F0" />
      {/* Header */}
      <View style={{
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#FFF9F0'
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20
        }}>
          <Text style={{
            fontFamily: 'Poppins_700Bold',
            fontSize: 20,
            color: '#111827'
          }}>
            {getCurrentDate()}
          </Text>
          <Pressable
            onPress={handleProfilePress}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ fontSize: 20 }}>👤</Text>
          </Pressable>
        </View>

        {/* Timeline */}
        <LinearGradient
          colors={['#B8D8E7', '#FFB5A7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 12,
            padding: 16,
            marginBottom: 20
          }}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
          >
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {getTimelineDays().map((day, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedDate(day.fullDate)}
                  onLayout={(e) => {
                    if (didScrollToToday) return;
                    const isTodayCell = day.fullDate.toDateString() === new Date().toDateString();
                    if (isTodayCell) {
                      const x = e.nativeEvent.layout.x;
                      const offset = Math.max(0, x - 120); // pre-scroll so today is visible with some left context
                      scrollRef.current?.scrollTo({ x: offset, animated: false });
                      setDidScrollToToday(true);
                    }
                  }}
                  style={{
                    alignItems: 'center',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor: isToday(day.fullDate) ? 'rgba(255,255,255,0.3)' : 'transparent'
                  }}
                >
                  <Text style={{
                    fontFamily: 'Poppins_600SemiBold',
                    fontSize: 10,
                    color: '#374151',
                    marginBottom: 2
                  }}>
                    {day.day}
                  </Text>
                  <Text style={{
                    fontFamily: 'Poppins_700Bold',
                    fontSize: 14,
                    color: '#111827',
                    marginBottom: 4
                  }}>
                    {day.date}
                  </Text>
                  <Text style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 8,
                    color: '#6B7280',
                    marginBottom: 6
                  }}>
                    {day.month}
                  </Text>
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: '#374151',
                    backgroundColor: day.fullDate.toDateString() === selectedDate.toDateString() ? '#374151' : 'transparent'
                  }} />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </LinearGradient>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        {/* Daily Plan Section */}
        <View style={{ marginBottom: 24 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10
          }}>
            <Pressable onPress={() => setShowDaily(!showDaily)} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Text style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 18,
                color: '#111827',
                flex: 1
              }}>
                Daily Plan
              </Text>
              <MaterialIcons name={showDaily ? 'keyboard-arrow-down' : 'keyboard-arrow-right'} size={20} color="#6B7280" />
            </Pressable>
          </View>

          {showDaily && (dailyPlans.length > 0 ? (
            <View style={{ gap: 12 }}>
              {dailyPlans.map((plan) => (
                <View key={plan.id} style={{
                  backgroundColor: plan.color || '#FFF9F0',
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#E5E7EB'
                }}>
                  <View style={{ marginRight: 16 }}>
                    <Text style={{
                      fontFamily: 'Poppins_600SemiBold',
                      fontSize: 12,
                      color: '#6B7280'
                    }}>
                      {plan.start_time || '--'}
                    </Text>
                    <View style={{
                      width: 2,
                      height: 20,
                      backgroundColor: '#D1D5DB',
                      marginVertical: 4,
                      alignSelf: 'center'
                    }} />
                    <Text style={{
                      fontFamily: 'Poppins_600SemiBold',
                      fontSize: 12,
                      color: '#6B7280'
                    }}>
                      {plan.end_time || '--'}
                    </Text>
                  </View>

                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Pressable onPress={() => { setModalPlan(plan); setShowPlanModal(true); }} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <Text style={{ fontSize: 24, marginRight: 12 }}>{plan.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontFamily: 'Poppins_600SemiBold',
                          fontSize: 16,
                          color: '#111827',
                          marginBottom: 4,
                          textDecorationLine: plan.is_completed ? 'line-through' : 'none',
                          textDecorationStyle: 'solid'
                        }}>
                          {plan.name}
                        </Text>
                        <Text style={{
                          fontFamily: 'Poppins_400Regular',
                          fontSize: 12,
                          color: '#6B7280'
                        }}>
                          {plan.start_time || '--'}-{plan.end_time || '--'} ({plan.duration_minutes}m)
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={async () => {
                      const res = await apiService.togglePlanCompletion(plan.id);
                      if (res.success) { setConfettiAt(Date.now()); }
                    }} style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: '#D1D5DB',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {plan.is_completed && (
                        <Text style={{ fontSize: 12, color: '#10B981' }}>✓</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={{
              backgroundColor: '#F9FAFB',
              borderRadius: 12,
              padding: 32,
              alignItems: 'center'
            }}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>📅</Text>
              <Text style={{
                fontFamily: 'Poppins_600SemiBold',
                fontSize: 16,
                color: '#6B7280',
                marginBottom: 4
              }}>
                No plans for today
              </Text>
              <Text style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                color: '#9CA3AF'
              }}>
                Tap + to add your first task
              </Text>
            </View>
          ))}
        </View>

        {/* Anytime Section */}
        <View style={{ marginBottom: 24 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10
          }}>
            <Pressable onPress={() => setShowAnytime(!showAnytime)} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Text style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 18,
                color: '#111827',
                flex: 1
              }}>
                Anytime
              </Text>
              <MaterialIcons name={showAnytime ? 'keyboard-arrow-down' : 'keyboard-arrow-right'} size={20} color="#6B7280" />
            </Pressable>
          </View>

          {showAnytime && (anytimePlans.length > 0 ? (
            <View style={{ gap: 12 }}>
              {anytimePlans.map((plan) => (
                <View key={plan.id} style={{
                  backgroundColor: plan.color || '#F9FAFB',
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#E5E7EB'
                }}>
                  <Pressable onPress={() => { setModalPlan(plan); setShowPlanModal(true); }} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 24, marginRight: 12 }}>{plan.emoji}</Text>
                    <Text style={{
                      fontFamily: 'Poppins_600SemiBold',
                      fontSize: 16,
                      color: '#111827',
                      flex: 1,
                      textDecorationLine: plan.is_completed ? 'line-through' : 'none',
                      textDecorationStyle: 'solid'
                    }}>
                      {plan.name}
                    </Text>
                  </Pressable>
                  <Pressable onPress={async () => {
                    const res = await apiService.togglePlanCompletion(plan.id);
                    if (res.success) { setConfettiAt(Date.now()); }
                  }} style={{
                    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {plan.is_completed && (<Text style={{ fontSize: 12, color: '#10B981' }}>✓</Text>)}
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <View style={{
              backgroundColor: '#F9FAFB',
              borderRadius: 12,
              padding: 32,
              alignItems: 'center'
            }}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>⏰</Text>
              <Text style={{
                fontFamily: 'Poppins_600SemiBold',
                fontSize: 16,
                color: '#6B7280',
                marginBottom: 4
              }}>
                No flexible tasks
              </Text>
              <Text style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                color: '#9CA3AF'
              }}>
                Add tasks that can be done anytime
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        onPress={handleCreatePlan}
        style={{
          position: 'absolute',
          bottom: 30,
          alignSelf: 'center',
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: '#374151',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8
        }}
      >
        <Text style={{ fontSize: 40, color: 'white', fontWeight: '300' }}>+</Text>
      </Pressable>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 32,
            width: '80%',
            maxWidth: 300,
            alignItems: 'center'
          }}>
            <Text style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 20,
              color: '#111827',
              marginBottom: 32,
              textAlign: 'center'
            }}>
              Create New Plan
            </Text>

            <Pressable
              onPress={handleCreateMyOwn}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                paddingVertical: 16,
                paddingHorizontal: 20,
                backgroundColor: '#F9FAFB',
                borderRadius: 12,
                marginBottom: 16
              }}
            >
              <Text style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 16,
                color: '#111827',
                flex: 1
              }}>
                Create my own
              </Text>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: '#D1D5DB',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ fontSize: 16, color: '#6B7280' }}>✏️</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleHabitLibrary}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                paddingVertical: 16,
                paddingHorizontal: 20,
                backgroundColor: '#F9FAFB',
                borderRadius: 12,
                marginBottom: 24
              }}
            >
              <Text style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 16,
                color: '#111827',
                flex: 1
              }}>
                Habit Library
              </Text>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: '#D1D5DB',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ fontSize: 16, color: '#6B7280' }}>📚</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setShowCreateModal(false)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#374151',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ fontSize: 20, color: 'white' }}>✕</Text>
            </Pressable>
          </View>
        </View>
      )}
      {confettiAt && (
        <ConfettiCannon key={confettiAt} count={80} origin={{ x: width / 2, y: 0 }} fadeOut fallSpeed={3000} />
      )}

      {/* Plan Details Modal (read-only summary like screenshots) */}
      {showPlanModal && modalPlan && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end'
        }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <View style={{ width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Text style={{ fontSize: 28, marginRight: 10 }}>{modalPlan.emoji}</Text>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#111827', flex: 1 }}>{modalPlan.name}</Text>
              <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#D1D5DB' }} />
            </View>
            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280', marginBottom: 16 }}>
              {modalPlan.start_time || '--'}-{modalPlan.end_time || '--'} ({modalPlan.duration_minutes} min)
            </Text>

            <View style={{ height: 1, backgroundColor: '#E5E7EB', marginBottom: 16 }} />
            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280', marginBottom: 12 }}>Checklist</Text>
            <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, minHeight: 120, padding: 12, marginBottom: 16 }}>
              {(modalPlan.checklist && modalPlan.checklist.length > 0) ? (
                modalPlan.checklist.map((it: any) => (
                  <View key={it.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#D1D5DB', marginRight: 8 }} />
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#111827' }}>{it.text}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#9CA3AF' }}>No checklist</Text>
              )}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Pressable onPress={() => setShowPlanModal(false)} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#374151', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                <Text style={{ fontSize: 18, color: 'white' }}>✕</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
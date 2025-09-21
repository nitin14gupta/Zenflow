import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions, RefreshControl, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, formatTimeTo12h } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { apiService } from '../../api/apiService';
import { MaterialIcons } from '@expo/vector-icons';
import { usePushNotifications } from '../../constants/usePushNotifications';
import { preloadBundledAssetsIfNeeded } from '../../constants/preloadAssets';

const { width } = Dimensions.get('window');

export default function Home() {
  const { user } = useAuth();
  const { expoPushToken } = usePushNotifications();
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
  const fabAnim = useRef(new Animated.Value(0)).current;
  const didSendTestPushRef = useRef(false);
  const didPreloadRef = useRef(false);

  useEffect(() => {
    // Preload bundled assets once at startup for snappy UX
    if (!didPreloadRef.current) {
      didPreloadRef.current = true;
      preloadBundledAssetsIfNeeded();
    }
  }, []);

  const parseISODate = (dateStr?: string) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('-').map((v: string) => parseInt(v, 10));
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffInDays = (a: Date, b: Date) => {
    const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  };

  const isWeekday = (d: Date) => {
    const day = d.getDay();
    return day >= 1 && day <= 5;
  };

  const isWeekend = (d: Date) => {
    const day = d.getDay();
    return day === 0 || day === 6;
  };

  const isPlanCompletedForDate = (plan: any, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];

    // For one-time plans, check the plan's completion status
    if (plan.repeat_type === 'once') {
      return plan.is_completed || false;
    }

    // For recurring plans, check instances
    if (plan.instances && plan.instances.length > 0) {
      const instance = plan.instances.find((inst: any) => inst.instance_date === dateStr);
      return instance ? instance.is_completed : false;
    }

    return false;
  };

  const isPlanSkippedForDate = (plan: any, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];

    // For one-time plans, check the plan's skip status
    if (plan.repeat_type === 'once') {
      return plan.is_skipped || false;
    }

    // For recurring plans, check instances
    if (plan.instances && plan.instances.length > 0) {
      const instance = plan.instances.find((inst: any) => inst.instance_date === dateStr);
      return instance ? instance.is_skipped : false;
    }

    return false;
  };

  const occursOnDate = (plan: any, date: Date) => {
    const start = parseISODate(plan.scheduled_date);
    if (!start) return false;
    const candidate = startOfDay(date);
    const begins = startOfDay(start);

    const type = (plan.repeat_type || 'once') as string;

    if (type === 'once') {
      return isSameDay(candidate, begins);
    }

    // Do not show occurrences before the start date
    if (candidate < begins) return false;

    const days = diffInDays(candidate, begins);

    switch (type) {
      case 'daily':
        return days >= 0;
      case 'weekly':
        return days % 7 === 0;
      case 'biweekly':
        return days % 14 === 0;
      case 'monthly': {
        // Match same day-of-month; if start was 31 and month shorter, show on last day of month
        const targetDom = begins.getDate();
        const lastDayOfMonth = new Date(candidate.getFullYear(), candidate.getMonth() + 1, 0).getDate();
        const expectedDom = Math.min(targetDom, lastDayOfMonth);
        return candidate.getDate() === expectedDom;
      }
      case 'weekdays':
        return isWeekday(candidate);
      case 'weekends':
        return isWeekend(candidate);
      default:
        return false;
    }
  };

  const loadPlans = useCallback(async () => {
    if (!user?.id) return;
    const res = await apiService.getUserPlans(user.id);
    if (res.success) {
      const plans = res.data.plans || res.data || [];
      const todaysAll = plans.filter((p: any) => occursOnDate(p, selectedDate));
      const todays = todaysAll.filter((p: any) => !p.is_anytime);
      const anytimes = todaysAll.filter((p: any) => p.is_anytime);
      setDailyPlans(todays);
      setAnytimePlans(anytimes);
    }
  }, [user?.id, selectedDate]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fabAnim, { toValue: -6, duration: 900, useNativeDriver: true }),
        Animated.timing(fabAnim, { toValue: 0, duration: 900, useNativeDriver: true })
      ])
    ).start();
  }, [fabAnim]);

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
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSkipPlan = async (planId: string) => {
    setIsLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await apiService.skipPlan(planId, dateStr);
      if (res.success) {
        await loadPlans();
        setShowPlanModal(false);
      }
    } catch (error) {
      console.error('Error skipping plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    setIsLoading(true);
    try {
      const res = await apiService.deletePlan(planId);
      if (res.success) {
        await loadPlans();
        setShowPlanModal(false);
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPlan = () => {
    if (modalPlan) {
      setShowPlanModal(false);
      router.push({
        pathname: '/(hobbies)/details',
        params: {
          planName: modalPlan.name,
          planId: modalPlan.id,
          isEdit: 'true'
        }
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF9F0' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF9F0" />
      {/* Header */}
      <View style={{
        paddingTop: 25,
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
                  borderRadius: 50,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#E5E7EB'
                }}>
                  {/* <View style={{ marginRight: 16 }}>
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
                  </View> */}

                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Pressable onPress={() => { setModalPlan(plan); setShowPlanModal(true); }} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <Text style={{ fontSize: 24, marginRight: 12 }}>{plan.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontFamily: 'Poppins_600SemiBold',
                          fontSize: 16,
                          color: isPlanSkippedForDate(plan, selectedDate) ? '#9CA3AF' : '#111827',
                          marginBottom: 4,
                          textDecorationLine: isPlanCompletedForDate(plan, selectedDate) ? 'line-through' : 'none',
                          textDecorationStyle: 'solid'
                        }}>
                          {plan.name}
                          {isPlanSkippedForDate(plan, selectedDate) && ' (Skipped)'}
                        </Text>
                        <Text style={{
                          fontFamily: 'Poppins_400Regular',
                          fontSize: 12,
                          color: isPlanSkippedForDate(plan, selectedDate) ? '#9CA3AF' : '#6B7280'
                        }}>
                          {formatTimeTo12h(plan.start_time)}-{formatTimeTo12h(plan.end_time)} ({plan.duration_minutes}m)
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={async () => {
                      const isCompleted = isPlanCompletedForDate(plan, selectedDate);
                      if (isCompleted) return;
                      const dateStr = selectedDate.toISOString().split('T')[0];
                      const res = await apiService.togglePlanCompletion(plan.id, dateStr);
                      if (res.success) { setConfettiAt(Date.now()); }
                    }} style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: isPlanCompletedForDate(plan, selectedDate) ? '#10B981' : '#D1D5DB',
                      backgroundColor: isPlanCompletedForDate(plan, selectedDate) ? '#10B981' : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: isPlanCompletedForDate(plan, selectedDate) ? 1 : 1
                    }}>
                      {isPlanCompletedForDate(plan, selectedDate) && (
                        <Text style={{ fontSize: 12, color: 'white' }}>✓</Text>
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
                  borderRadius: 50,
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
                      color: isPlanSkippedForDate(plan, selectedDate) ? '#9CA3AF' : '#111827',
                      flex: 1,
                      textDecorationLine: isPlanCompletedForDate(plan, selectedDate) ? 'line-through' : 'none',
                      textDecorationStyle: 'solid'
                    }}>
                      {plan.name}
                      {isPlanSkippedForDate(plan, selectedDate) && ' (Skipped)'}
                    </Text>
                  </Pressable>
                  <Pressable onPress={async () => {
                    const isCompleted = isPlanCompletedForDate(plan, selectedDate);
                    if (isCompleted) return;
                    const dateStr = selectedDate.toISOString().split('T')[0];
                    const res = await apiService.togglePlanCompletion(plan.id, dateStr);
                    if (res.success) { setConfettiAt(Date.now()); }
                  }} style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: isPlanCompletedForDate(plan, selectedDate) ? '#10B981' : '#D1D5DB',
                    backgroundColor: isPlanCompletedForDate(plan, selectedDate) ? '#10B981' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isPlanCompletedForDate(plan, selectedDate) && (<Text style={{ fontSize: 12, color: 'white' }}>✓</Text>)}
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
      <Animated.View style={{ position: 'absolute', bottom: 30, alignSelf: 'center', transform: [{ translateY: fabAnim }] }}>
        <Pressable
          onPress={handleCreatePlan}
          style={{
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
      </Animated.View>

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
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end'
          }}
          onPress={() => setShowPlanModal(false)}
        >
          <Pressable
            style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={{ width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Text style={{ fontSize: 28, marginRight: 10 }}>{modalPlan.emoji}</Text>
              <Text style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 18,
                color: '#111827',
                flex: 1,
                textDecorationLine: isPlanCompletedForDate(modalPlan, selectedDate) ? 'line-through' : 'none',
                textDecorationStyle: 'solid'
              }}>{modalPlan.name}</Text>
              <View style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: isPlanCompletedForDate(modalPlan, selectedDate) ? '#10B981' : '#D1D5DB',
                backgroundColor: isPlanCompletedForDate(modalPlan, selectedDate) ? '#10B981' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isPlanCompletedForDate(modalPlan, selectedDate) && (
                  <Text style={{ fontSize: 12, color: 'white' }}>✓</Text>
                )}
              </View>
            </View>
            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280', marginBottom: 16 }}>
              {formatTimeTo12h(modalPlan.start_time)}-{formatTimeTo12h(modalPlan.end_time)} ({modalPlan.duration_minutes} min)
            </Text>

            {/* Repeat and Reminder Info */}
            <View style={{ flexDirection: 'row', marginBottom: 16, gap: 16 }}>
              <View style={{ flex: 1, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 8, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 10, color: '#6B7280', marginBottom: 2 }}>Repeat</Text>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: '#111827' }}>
                  {modalPlan.repeat_type === 'once' ? 'Once' :
                    modalPlan.repeat_type === 'daily' ? 'Daily' :
                      modalPlan.repeat_type === 'weekly' ? 'Weekly' :
                        modalPlan.repeat_type === 'monthly' ? 'Monthly' : modalPlan.repeat_type}
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 8, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 10, color: '#6B7280', marginBottom: 2 }}>Reminders</Text>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: '#111827' }}>
                  {modalPlan.reminder_at_start ? 'Start' : ''}
                  {modalPlan.reminder_at_start && modalPlan.reminder_at_end ? ', ' : ''}
                  {modalPlan.reminder_at_end ? 'End' : ''}
                  {!modalPlan.reminder_at_start && !modalPlan.reminder_at_end ? 'None' : ''}
                </Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: '#E5E7EB', marginBottom: 16 }} />
            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280', marginBottom: 12 }}>Checklist</Text>
            <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, minHeight: 120, padding: 12, marginBottom: 16 }}>
              {(modalPlan.checklist && modalPlan.checklist.length > 0) ? (
                modalPlan.checklist.map((it: any) => (
                  <View key={it.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: it.completed ? '#10B981' : '#D1D5DB',
                      backgroundColor: it.completed ? '#10B981' : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 8
                    }}>
                      {it.completed && (
                        <Text style={{ fontSize: 10, color: 'white' }}>✓</Text>
                      )}
                    </View>
                    <Text style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 14,
                      color: '#111827',
                      textDecorationLine: it.completed ? 'line-through' : 'none',
                      textDecorationStyle: 'solid'
                    }}>{it.text}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#9CA3AF' }}>No checklist</Text>
              )}
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              {!isPlanCompletedForDate(modalPlan, selectedDate) && (
                <>
                  <Pressable
                    onPress={() => handleSkipPlan(modalPlan.id)}
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: '#F59E0B',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: 'white' }}>
                      {isLoading ? '...' : 'Skip'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleEditPlan}
                    style={{
                      flex: 1,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: '#3B82F6',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: 'white' }}>Edit</Text>
                  </Pressable>
                </>
              )}

              <Pressable
                onPress={() => handleDeletePlan(modalPlan.id)}
                disabled={isLoading}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: '#EF4444',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: 'white' }}>
                  {isLoading ? '...' : 'Delete'}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      )}
    </View>
  );
}
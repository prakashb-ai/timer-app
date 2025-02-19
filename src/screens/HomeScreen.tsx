import React, { useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { useTimerContext } from '../context/TimerContext';
import { CategoryGroup } from '../components/CategoryGroup';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Timer } from '../types';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
const { width } = Dimensions.get('window');

export function HomeScreen({ navigation }: Props) {
  const { state, dispatch } = useTimerContext();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const updateTimer = useCallback((timer: Timer) => {
    dispatch({ type: 'UPDATE_TIMER', payload: timer });
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      state.timers.forEach((timer) => {
        if (timer.status === 'running' && timer.remainingTime > 0) {
          const newRemainingTime = timer.remainingTime - 1;
          const updatedTimer = {
            ...timer,
            remainingTime: newRemainingTime,
          };

          if (newRemainingTime === 0) {
            updatedTimer.status = 'completed';
            updatedTimer.completedAt = new Date().toISOString();
            
            dispatch({
              type: 'ADD_LOG',
              payload: {
                id: Date.now().toString(),
                timerId: timer.id,
                timerName: timer.name,
                category: timer.category,
                completedAt: updatedTimer.completedAt,
                duration: timer.duration,
              },
            });

            Alert.alert(
              ' Timer Completed!',
              `${timer.name} has finished!`,
              [{ text: 'OK', style: 'default' }],
              { cancelable: true }
            );
          } else if (
            timer.halfwayAlert &&
            newRemainingTime === Math.floor(timer.duration / 2)
          ) {
            Alert.alert(
              ' Halfway There!',
              `${timer.name} is at 50%`,
              [{ text: 'OK', style: 'default' }],
              { cancelable: true }
            );
          }

          updateTimer(updatedTimer);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.timers, dispatch, updateTimer]);

  const handleTimerAction = (timerId: string, action: 'start' | 'pause' | 'reset') => {
    const timer = state.timers.find((t) => t.id === timerId);
    if (!timer) return;

    let updatedTimer = { ...timer };

    switch (action) {
      case 'start':
        updatedTimer.status = 'running';
        break;
      case 'pause':
        updatedTimer.status = 'paused';
        break;
      case 'reset':
        updatedTimer.status = 'idle';
        updatedTimer.remainingTime = timer.duration;
        break;
    }

    updateTimer(updatedTimer);
  };

  const handleBulkAction = (category: string, action: 'start' | 'pause' | 'reset') => {
    state.timers
      .filter((timer) => timer.category === category)
      .forEach((timer) => {
        handleTimerAction(timer.id, action);
      });
  };

  const timersByCategory = state.timers.reduce((acc, timer) => {
    if (!acc[timer.category]) {
      acc[timer.category] = [];
    }
    acc[timer.category].push(timer);
    return acc;
  }, {} as Record<string, Timer[]>);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {Object.entries(timersByCategory).length > 0 ? (
            Object.entries(timersByCategory).map(([category, timers]) => (
              <CategoryGroup
                key={category}
                category={category}
                timers={timers}
                onTimerAction={handleTimerAction}
                onBulkAction={(action) => handleBulkAction(category, action)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="timer-outline" size={64} color="#8b5cf6" />
              <Text style={styles.emptyStateTitle}>No Timers Yet</Text>
              <Text style={styles.emptyStateText}>
                Tap the + button below to create your first timer
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTimer')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingVertical: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

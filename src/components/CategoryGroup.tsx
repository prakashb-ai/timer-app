import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Timer } from '../types';
import { TimerCard } from './TimerCard';

interface CategoryGroupProps {
  category: string;
  timers: Timer[];
  onTimerAction: (timerId: string, action: 'start' | 'pause' | 'reset') => void;
  onBulkAction: (action: 'start' | 'pause' | 'reset') => void;
}

export function CategoryGroup({
  category,
  timers,
  onTimerAction,
  onBulkAction,
}: CategoryGroupProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.categoryTitle}>{category}</Text>
        <Text style={styles.expandIcon}>{expanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {expanded && (
        <>
          <View style={styles.bulkActions}>
            <TouchableOpacity
              style={styles.bulkButton}
              onPress={() => onBulkAction('start')}
            >
              <Text style={styles.bulkButtonText}>Start All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bulkButton}
              onPress={() => onBulkAction('pause')}
            >
              <Text style={styles.bulkButtonText}>Pause All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bulkButton}
              onPress={() => onBulkAction('reset')}
            >
              <Text style={styles.bulkButtonText}>Reset All</Text>
            </TouchableOpacity>
          </View>

          {timers.map((timer) => (
            <TimerCard
              key={timer.id}
              timer={timer}
              onStart={() => onTimerAction(timer.id, 'start')}
              onPause={() => onTimerAction(timer.id, 'pause')}
              onReset={() => onTimerAction(timer.id, 'reset')}
            />
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f7ff',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.1)',
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  expandIcon: {
    fontSize: 18,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#faf5ff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.1)',
  },
  bulkButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  bulkButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

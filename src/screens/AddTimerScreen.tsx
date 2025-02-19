import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useTimerContext } from '../context/TimerContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTimer'>;

export function AddTimerScreen({ navigation }: Props) {
  const { state, dispatch } = useTimerContext();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleCreateTimer = () => {
    if (!name || !duration) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const durationInSeconds = parseInt(duration) * 60;
    const selectedCategory = showNewCategory ? newCategory : category;

    if (!selectedCategory) {
      Alert.alert('Error', 'Please select or create a category');
      return;
    }

    const newTimer = {
      id: Date.now().toString(),
      name,
      duration: durationInSeconds,
      remainingTime: durationInSeconds,
      category: selectedCategory,
      status: 'idle' as const,
      createdAt: new Date().toISOString(),
      halfwayAlert: false,
    };

    dispatch({ type: 'ADD_TIMER', payload: newTimer });

    if (showNewCategory && newCategory && !state.categories.includes(newCategory)) {
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Timer Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter timer name"
        />

        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          placeholder="Enter duration in minutes"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Category</Text>
        {!showNewCategory ? (
          <>
            <ScrollView horizontal style={styles.categoryContainer}>
              {state.categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.selectedCategory,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat && styles.selectedCategoryText,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.newCategoryButton}
              onPress={() => setShowNewCategory(true)}
            >
              <Text style={styles.newCategoryButtonText}>+ New Category</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View>
            <TextInput
              style={styles.input}
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="Enter new category name"
            />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowNewCategory(false)}
            >
              <Text style={styles.backButtonText}>Back to Categories</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.createButton} onPress={handleCreateTimer}>
          <Text style={styles.createButtonText}>Create Timer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e4e4e7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#1a1a1a',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    paddingVertical: 8,
  },
  categoryButton: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.1)',
  },
  selectedCategory: {
    backgroundColor: '#8b5cf6',
  },
  categoryButtonText: {
    fontSize: 15,
    color: '#5b21b6',
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  newCategoryButton: {
    paddingVertical: 12,
    marginBottom: 24,
  },
  newCategoryButtonText: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 12,
    marginBottom: 24,
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

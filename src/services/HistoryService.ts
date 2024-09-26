import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const loadHistory = async (setHistory: Function) => {
  const storedHistory = await AsyncStorage.getItem('scanHistory');
  if (storedHistory) {
    setHistory(JSON.parse(storedHistory));
  }
};

export const deleteHistoryItem = async (id: string, history: any[], setHistory: Function, setSelectedItemId: Function) => {
  Alert.alert(
    'Delete Entry',
    'Are you sure you want to delete this entry?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          const updatedHistory = history.filter(item => item.id !== id);
          setHistory(updatedHistory);
          await AsyncStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
          setSelectedItemId(null);
        },
        style: 'destructive',
      },
    ],
    { cancelable: true },
  );
};

export const clearHistory = async (setHistory: Function) => {
  Alert.alert(
    'Clear History',
    'Are you sure you want to clear all history?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        onPress: async () => {
          setHistory([]);
          await AsyncStorage.removeItem('scanHistory');
        },
      },
    ],
    { cancelable: true },
  );
};
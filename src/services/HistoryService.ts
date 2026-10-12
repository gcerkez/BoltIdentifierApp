import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { ScanHistoryItem } from '../types/BoltTypes';

const HISTORY_STORAGE_KEY = 'scanHistory';

/**
 * Loads the full scan history from AsyncStorage.
 */
export const loadHistory = async (
  setHistory: (history: ScanHistoryItem[]) => void,
): Promise<ScanHistoryItem[]> => {
  try {
    const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (storedHistory) {
      const parsed: ScanHistoryItem[] = JSON.parse(storedHistory);
      setHistory(parsed);
      return parsed;
    }
    setHistory([]);
    return [];
  } catch (error) {
    console.error('Failed to load scan history:', error);
    setHistory([]);
    return [];
  }
};

/**
 * Saves a new scan record into AsyncStorage.
 */
export const saveHistoryItem = async (
  itemData: Omit<ScanHistoryItem, 'id' | 'date'>,
): Promise<ScanHistoryItem> => {
  try {
    const newItem: ScanHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      title: itemData.bestMatch ? itemData.bestMatch.designation : 'Bolt Scan',
      ...itemData,
    };

    const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    const history: ScanHistoryItem[] = storedHistory ? JSON.parse(storedHistory) : [];
    // Prepend newer items to the top of the list
    history.unshift(newItem);

    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    return newItem;
  } catch (error) {
    console.error('Failed to save history item:', error);
    throw error;
  }
};

/**
 * Updates an existing history item (e.g. updating custom title or notes).
 */
export const updateHistoryItem = async (
  id: string,
  updates: Partial<ScanHistoryItem>,
  history: ScanHistoryItem[],
  setHistory: (history: ScanHistoryItem[]) => void,
): Promise<void> => {
  const updatedHistory = history.map(item =>
    item.id === id ? { ...item, ...updates } : item,
  );
  setHistory(updatedHistory);
  await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
};

/**
 * Deletes a single history item by id with confirmation.
 */
export const deleteHistoryItem = async (
  id: string,
  history: ScanHistoryItem[],
  setHistory: (history: ScanHistoryItem[]) => void,
  setSelectedItemId?: (id: string | null) => void,
): Promise<void> => {
  Alert.alert(
    'Delete Scan Record',
    'Are you sure you want to delete this scan?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          const updatedHistory = history.filter(item => item.id !== id);
          setHistory(updatedHistory);
          await AsyncStorage.setItem(
            HISTORY_STORAGE_KEY,
            JSON.stringify(updatedHistory),
          );
          if (setSelectedItemId) {
            setSelectedItemId(null);
          }
        },
        style: 'destructive',
      },
    ],
    { cancelable: true },
  );
};

/**
 * Clears all scan history with confirmation dialog.
 */
export const clearHistory = async (
  setHistory: (history: ScanHistoryItem[]) => void,
): Promise<void> => {
  Alert.alert(
    'Clear All History',
    'Are you sure you want to clear all bolt scan history? This action cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        onPress: async () => {
          setHistory([]);
          await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
        },
        style: 'destructive',
      },
    ],
    { cancelable: true },
  );
};

/**
 * Formats a scan history record as a human-readable text summary for sharing or copying.
 */
export const formatScanSummary = (item: ScanHistoryItem): string => {
  const m = item.measurements;
  const match = item.bestMatch;

  return [
    `=== Bolt Specification: ${item.title || 'Bolt Scan'} ===`,
    `Date: ${item.date}`,
    match ? `Best Match: ${match.designation} (${match.confidence}% confidence)` : 'Best Match: None',
    match?.notes ? `Standard: ${match.notes}` : '',
    `Head Type: ${m.headType}`,
    `Thread Spacing (Pitch): ${m.threadSpacing.toFixed(2)} mm`,
    `Shank Diameter: ${m.shankDiameter ? m.shankDiameter.toFixed(2) : '-'} mm`,
    `Total Length: ${m.length.toFixed(2)} mm`,
    `Shank / Thread Length: ${m.shankLength ? m.shankLength.toFixed(2) : '-'} mm`,
    `Socket / Head Size: ${m.socketSize.toFixed(2)} mm`,
    item.notes ? `Notes: ${item.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');
};

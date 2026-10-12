import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { CustomItem } from '../types/BoltTypes';
import { predefinedItems } from '../constants/PredefinedItems';

const CUSTOM_ITEMS_STORAGE_KEY = 'customItems';

/**
 * Loads custom items from AsyncStorage.
 */
export const loadCustomItems = async (
  setCustomItems: (items: CustomItem[]) => void,
): Promise<CustomItem[]> => {
  try {
    const storedItems = await AsyncStorage.getItem(CUSTOM_ITEMS_STORAGE_KEY);
    if (storedItems) {
      const parsed: CustomItem[] = JSON.parse(storedItems);
      setCustomItems(parsed);
      return parsed;
    }
    setCustomItems([]);
    return [];
  } catch (error) {
    console.error('Failed to load custom reference items:', error);
    setCustomItems([]);
    return [];
  }
};

/**
 * Combines predefined items with custom user items.
 */
export const getAllReferenceItems = (customItems: CustomItem[]): CustomItem[] => {
  return [...predefinedItems, ...customItems];
};

/**
 * Adds or updates a custom reference item.
 */
export const addOrUpdateCustomItem = async (
  newItem: Partial<CustomItem>,
  customItems: CustomItem[],
  setCustomItems: (items: CustomItem[]) => void,
  resetForm: () => void,
  editingItemId: string | null = null,
): Promise<boolean> => {
  if (!newItem.name || !newItem.width) {
    Alert.alert('Validation Error', 'Please provide a name and dimensions for the item.');
    return false;
  }

  const widthVal = newItem.width.trim();
  const heightVal = newItem.isRound ? widthVal : (newItem.height ? newItem.height.trim() : widthVal);

  const itemToSave: CustomItem = {
    id: editingItemId || Date.now().toString(),
    name: newItem.name.trim(),
    width: widthVal,
    height: heightVal,
    unit: newItem.unit || 'mm',
    isRound: newItem.isRound ?? (widthVal === heightVal),
    category: 'custom',
    photoUris: newItem.photoUris || [],
  };

  let updatedItems: CustomItem[];
  if (editingItemId) {
    updatedItems = customItems.map(item =>
      item.id === editingItemId ? itemToSave : item,
    );
  } else {
    updatedItems = [...customItems, itemToSave];
  }

  try {
    setCustomItems(updatedItems);
    await AsyncStorage.setItem(CUSTOM_ITEMS_STORAGE_KEY, JSON.stringify(updatedItems));
    resetForm();
    return true;
  } catch (error) {
    console.error('Failed to save custom item:', error);
    Alert.alert('Error', 'Failed to save reference item.');
    return false;
  }
};

/**
 * Deletes a custom reference item.
 */
export const deleteCustomItem = async (
  id: string,
  customItems: CustomItem[],
  setCustomItems: (items: CustomItem[]) => void,
): Promise<void> => {
  const updatedItems = customItems.filter(item => item.id !== id);
  setCustomItems(updatedItems);
  await AsyncStorage.setItem(CUSTOM_ITEMS_STORAGE_KEY, JSON.stringify(updatedItems));
};

/**
 * Confirms deletion of a custom item with an alert dialog.
 */
export const confirmDeleteCustomItem = (
  id: string,
  onDelete: (id: string) => void,
) => {
  Alert.alert(
    'Delete Reference Item',
    'Are you sure you want to delete this custom reference item?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => onDelete(id),
        style: 'destructive',
      },
    ],
    { cancelable: true },
  );
};

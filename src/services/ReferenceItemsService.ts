import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {CustomItem} from '../screens/ReferenceItems.tsx';

// Load custom items from AsyncStorage
export const loadCustomItems = async (
  setCustomItems: (items: CustomItem[]) => void,
) => {
  const storedItems = await AsyncStorage.getItem('customItems');
  if (storedItems) {
    setCustomItems(JSON.parse(storedItems));
  }
};

// Add or update a custom item
export const addOrUpdateCustomItem = async (
  newItem: Partial<CustomItem>,
  customItems: CustomItem[],
  setCustomItems: (items: CustomItem[]) => void,
  setNewItem: (item: Partial<CustomItem>) => void,
  setEditingItemId: (id: string | null) => void,
  setSize: (size: string) => void,
  setIsRound: (isRound: boolean) => void,
  setIsFormVisible: (isVisible: boolean) => void,
  isRound: boolean,
  size: string,
  editingItemId: string | null,
) => {
  if (newItem.name && (isRound ? size : newItem.width && newItem.height)) {
    let updatedItems;
    const itemToSave = {
      ...newItem,
      width: isRound ? size : newItem.width,
      height: isRound ? size : newItem.height,
    } as CustomItem;

    if (editingItemId) {
      updatedItems = customItems.map(item =>
        item.id === editingItemId ? {...item, ...itemToSave} : item,
      );
      setEditingItemId(null);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {id, ...rest} = itemToSave;
      const newItemWithId: CustomItem = {
        id: Date.now().toString(),
        ...rest,
      };
      updatedItems = [...customItems, newItemWithId];
    }
    setCustomItems(updatedItems);
    await AsyncStorage.setItem('customItems', JSON.stringify(updatedItems));
    setNewItem({
      name: '',
      width: '',
      height: '',
      unit: 'mm',
      photoUris: [],
    });
    setSize('');
    setIsRound(false);
    setIsFormVisible(false);
  }
};

// Delete a custom item
export const deleteCustomItem = async (
  id: string,
  customItems: CustomItem[],
  setCustomItems: (items: CustomItem[]) => void,
) => {
  const updatedItems = customItems.filter(item => item.id !== id);
  setCustomItems(updatedItems);
  await AsyncStorage.setItem('customItems', JSON.stringify(updatedItems));
};

// Confirm deletion of a custom item
// eslint-disable-next-line @typescript-eslint/no-shadow
export const confirmDeleteCustomItem = (
  id: string,
  deleteCustomItem: (id: string) => void,
) => {
  Alert.alert(
    'Delete Item',
    'Are you sure you want to delete this item?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => deleteCustomItem(id),
        style: 'destructive',
      },
    ],
    {cancelable: true},
  );
};

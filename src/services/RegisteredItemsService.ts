import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { CustomItem } from '../screens/RegisteredItems';

// Load custom items from AsyncStorage
export const loadCustomItems = async (setCustomItems: (items: CustomItem[]) => void) => {
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
  editingItemId: string | null
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
        item.id === editingItemId ? { ...item, ...itemToSave } : item
      );
      setEditingItemId(null);
    } else {
      const { id, ...rest } = itemToSave;
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
export const deleteCustomItem = async (id: string, customItems: CustomItem[], setCustomItems: (items: CustomItem[]) => void) => {
  const updatedItems = customItems.filter(item => item.id !== id);
  setCustomItems(updatedItems);
  await AsyncStorage.setItem('customItems', JSON.stringify(updatedItems));
};

// Confirm deletion of a custom item
export const confirmDeleteCustomItem = (id: string, deleteCustomItem: (id: string) => void) => {
  Alert.alert(
    "Delete Item",
    "Are you sure you want to delete this item?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        onPress: () => deleteCustomItem(id),
        style: "destructive"
      }
    ],
    { cancelable: true }
  );
};

// Request camera permission
export const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "App Camera Permission",
        message: "App needs access to your camera ",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Camera permission given");
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

// Pick an image from the gallery or take a new photo
export const pickImage = async (useCamera: boolean, setNewItem: (item: Partial<CustomItem>) => void) => {
  let result;
  if (useCamera) {
    result = await launchCamera({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    });
  } else {
    result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    });
  }

  if (result.assets && result.assets.length > 0) {
    const newPhotoUri = result.assets[0].uri;
    if (newPhotoUri) {
      setNewItem((prevItem) => ({
        ...prevItem,
        photoUris: prevItem.photoUris ? [...prevItem.photoUris, newPhotoUri].filter(Boolean).slice(0, 3) : [newPhotoUri],
      }));
    }
  }
};

// Confirm deletion of a photo
export const confirmDeletePhoto = (index: number, deletePhoto: (index: number) => void) => {
  Alert.alert(
    "Delete Photo",
    "Are you sure you want to delete this photo?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        onPress: () => deletePhoto(index),
        style: "destructive"
      }
    ],
    { cancelable: true }
  );
};

// Delete a photo from the item
export const deletePhoto = (index: number, setNewItem: (item: Partial<CustomItem>) => void) => {
  setNewItem((prevItem) => ({
    ...prevItem,
    photoUris: prevItem.photoUris ? prevItem.photoUris.filter((_, i) => i !== index) : [],
  }));
};
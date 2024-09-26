import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Alert, PermissionsAndroid } from 'react-native';
import { CustomItem } from '../screens/RegisteredItems';

// Request camera permission
export const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "App Camera Permission",
        message: "App needs access to your camera",
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
export const pickImage = async (
  useCamera: boolean, 
  setNewItem: (item: Partial<CustomItem>) => void, 
  callbackType: 'RegisteredItems' | 'CameraScreen'
) => {
  console.log('pickImage called with useCamera:', useCamera);
  let result;
  try {
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
    console.log('Image picker result:', result);

    if (result.assets && result.assets.length > 0) {
      const newPhotoUri = result.assets[0].uri;
      console.log('New photo URI:', newPhotoUri);
      if (newPhotoUri) {
        if (callbackType === 'RegisteredItems') {
          setNewItem((prevItem) => ({
            ...prevItem,
            photoUris: prevItem.photoUris ? [...prevItem.photoUris, newPhotoUri].filter(Boolean).slice(0, 3) : [newPhotoUri],
          }));
        } else if (callbackType === 'CameraScreen') {
          setNewItem({
            photoUris: [newPhotoUri],
          });
        }
      }
    }
  } catch (error) {
    console.error('Error picking image:', error);
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
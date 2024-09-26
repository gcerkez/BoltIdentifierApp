import { Alert } from 'react-native';
import { pickImage, requestCameraPermission } from '../utils/ImagePickerUtil';
import { processImage } from '../services/ImageProcessingService';
import { CustomItem } from '../utils/CommonHelper';

export const handlePickImage = (
  useCamera: boolean,
  selectedReferenceItem: string | null,
  combinedItems: CustomItem[],
  setImageData: (data: string) => void,
  setMeasurements: (measurements: any) => void
) => {
  console.log('Selected Reference Item:', selectedReferenceItem);

  const referenceItem = combinedItems.find(item => item.id === selectedReferenceItem);
  if (!referenceItem) {
    Alert.alert('Error', 'Please select a reference item.');
    return;
  }

  pickImage(
    useCamera,
    item => {
      if (item.photoUris && item.photoUris.length > 0) {
        const uri = item.photoUris[0] as string;
        processImage(uri, setImageData, setMeasurements, referenceItem);
      }
    },
    'CameraScreen',
  );
};

export const handleTakePicture = (
  selectedReferenceItem: string | null,
  handlePickImage: (useCamera: boolean) => void
) => {
  Alert.alert(
    "Capture Instructions",
    "Place your reference item and the bolt side by side on a dark surface for best results.",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () => {
          requestCameraPermission().then(() => handlePickImage(true));
        }
      }
    ]
  );
};
import { Alert } from 'react-native';
import { pickImage, requestCameraPermission } from '../utils/ImagePickerUtil';
import { processImage } from './ImageProcessingService';
import { BoltMeasurement, CaliperRegion, CustomItem } from '../types/BoltTypes';

/**
 * Handles picking an image from camera or gallery and initiating analysis.
 */
export const handlePickImage = (
  useCamera: boolean,
  selectedReferenceItem: string | null,
  combinedItems: CustomItem[],
  setImageData: (data: string) => void,
  setMeasurements: (measurements: BoltMeasurement) => void,
  setCaliperRegion?: (caliper: CaliperRegion) => void,
  onComplete?: () => void,
) => {
  const referenceItem = combinedItems.find(
    item => item.id === selectedReferenceItem,
  );
  if (!referenceItem) {
    Alert.alert('Reference Item Required', 'Please select a reference item before capturing.');
    return;
  }

  pickImage(
    useCamera,
    item => {
      if (item.photoUris && item.photoUris.length > 0) {
        const uri = item.photoUris[0] as string;
        processImage(
          uri,
          setImageData,
          setMeasurements,
          referenceItem,
          setCaliperRegion,
        )
          .then(() => {
            if (onComplete) {
              onComplete();
            }
          })
          .catch(err => {
            console.error('Processing error:', err);
            Alert.alert('Processing Error', 'Could not analyze bolt image. Please try again.');
          });
      }
    },
    'CameraScreen',
  );
};

/**
 * Presents capture options (Camera vs Gallery) to the user with helpful placement instructions.
 */
export const handleTakePicture = (
  selectedReferenceItem: string | null,
  onSelectSource: (useCamera: boolean) => void,
) => {
  if (!selectedReferenceItem) {
    Alert.alert(
      'Reference Item Required',
      'Please select a reference item from the dropdown before capturing or selecting a photo.',
    );
    return;
  }

  Alert.alert(
    'Capture Bolt & Reference',
    'Place your reference item (e.g. coin or card) directly alongside the bolt on a contrasting, flat surface for accurate measurement.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Camera',
        onPress: () => {
          requestCameraPermission().then(() => onSelectSource(true));
        },
      },
      {
        text: 'Photo Gallery',
        onPress: () => onSelectSource(false),
      },
    ],
  );
};

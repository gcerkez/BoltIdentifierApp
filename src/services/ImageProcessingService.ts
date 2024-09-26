import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageResizer from 'react-native-image-resizer';

export const processImage = async (uri: string, setImageData: Function, setMeasurements: Function) => {
  console.log('processImage called with uri:', uri);
  const imageData = await RNFS.readFile(uri, 'base64');
  setImageData(imageData);

  try {
    const resizedImage = await ImageResizer.createResizedImage(uri, 200, 200, 'JPEG', 100);
    const pixelPerUnit = calculatePixelPerUnit(resizedImage);
    const dimensions = measureDimensions(resizedImage, pixelPerUnit);
    setMeasurements(dimensions);
    saveScanHistory(uri, dimensions); // Save the scan history
  } catch (error) {
    console.error('Error resizing image:', error);
  }
};

const calculatePixelPerUnit = (img: { width: number; height: number }): number => {
  const referenceLengthInPixels = 100; // Placeholder value
  const referenceLengthInUnits = 10; // Placeholder value (e.g., 10 mm)
  return referenceLengthInPixels / referenceLengthInUnits;
};

const measureDimensions = (img: { width: number; height: number }, pixelPerUnit: number) => {
  const threadSpacingInPixels = 20; // Placeholder value
  const lengthInPixels = 200; // Placeholder value
  const socketSizeInPixels = 50; // Placeholder value

  return {
    threadSpacing: threadSpacingInPixels / pixelPerUnit,
    length: lengthInPixels / pixelPerUnit,
    socketSize: socketSizeInPixels / pixelPerUnit,
    headType: 'Hex', // Placeholder value
  };
};

const saveScanHistory = async (uri: string, measurements: any) => {
  const newHistoryItem = {
    id: Date.now().toString(),
    imageUri: uri,
    date: new Date().toLocaleString(),
    measurements,
  };
  console.log('Saving History Item:', newHistoryItem);

  const storedHistory = await AsyncStorage.getItem('scanHistory');
  const history = storedHistory ? JSON.parse(storedHistory) : [];
  history.push(newHistoryItem);
  await AsyncStorage.setItem('scanHistory', JSON.stringify(history));
};
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const processImage = async (uri: string, setImageData: Function, setMeasurements: Function) => {
  const imageData = await RNFS.readFile(uri, 'base64');
  setImageData(imageData);
  const img: HTMLImageElement = document.createElement('img');
  img.src = `data:image/jpeg;base64,${imageData}`;
  img.onload = () => {
    const pixelPerUnit = calculatePixelPerUnit(img);
    const dimensions = measureDimensions(img, pixelPerUnit);
    setMeasurements(dimensions);
    saveScanHistory(uri, dimensions);
  };
};

const calculatePixelPerUnit = (img: HTMLImageElement): number => {
  const referenceLengthInPixels = 100; // Placeholder value
  const referenceLengthInUnits = 10; // Placeholder value (e.g., 10 mm)
  return referenceLengthInPixels / referenceLengthInUnits;
};

const measureDimensions = (img: HTMLImageElement, pixelPerUnit: number) => {
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

  const storedHistory = await AsyncStorage.getItem('scanHistory');
  const history = storedHistory ? JSON.parse(storedHistory) : [];
  history.push(newHistoryItem);
  await AsyncStorage.setItem('scanHistory', JSON.stringify(history));
};
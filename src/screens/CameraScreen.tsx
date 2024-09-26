import React, {useState} from 'react';
import {Button, Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import RNFS from 'react-native-fs';
import {launchCamera} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const CameraScreen = () => {
  const [measurements, setMeasurements] = useState({
    threadSpacing: 0,
    length: 0,
    socketSize: 0,
    headType: '',
  });
  const [imageData, setImageData] = useState('');

  const processImage = async (uri: string) => {
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

  const takePicture = () => {
    launchCamera({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          processImage(uri);
        }
      }
    });
  };

  console.log('Rendering CameraScreen');

  return (
    <View style={styles.container}>
      <Button title="Take Picture" onPress={takePicture} />
      {imageData ? (
        <Image
          source={{uri: 'data:image/jpeg;base64,' + imageData}}
          style={{width: 200, height: 200}}
        />
      ) : null}
      <Text>Thread Spacing: {measurements.threadSpacing.toFixed(2)} units</Text>
      <Text>Length: {measurements.length.toFixed(2)} units</Text>
      <Text>Socket Size: {measurements.socketSize.toFixed(2)} units</Text>
      <Text>Head Type: {measurements.headType}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'lightblue', // Added background color for visibility
  },
});

export default CameraScreen;
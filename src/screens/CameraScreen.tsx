import React, {useState} from 'react';
import {Button, Image, Text, View, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { requestCameraPermission, pickImage } from '../utils/ImagePickerUtil';
import { processImage } from '../services/ImageProcessingService';
import styles from '../styles/CameraScreenStyles';

const CameraScreen = () => {
  const [measurements, setMeasurements] = useState({
    threadSpacing: 0,
    length: 0,
    socketSize: 0,
    headType: '',
  });
  const [imageData, setImageData] = useState('');

  const handlePickImage = (useCamera: boolean) => {
    console.log('handlePickImage called with useCamera:', useCamera);
    pickImage(useCamera, (item) => {
      console.log('pickImage callback called with item:', item);
      if (item.photoUris && item.photoUris.length > 0) {
        const uri = item.photoUris[0] as string;
        console.log('Picked Image URI:', uri);
        processImage(uri, setImageData, setMeasurements);
      }
    }, 'CameraScreen');
  };

  const handleClear = () => {
    setImageData('');
    setMeasurements({
      threadSpacing: 0,
      length: 0,
      socketSize: 0,
      headType: '',
    });
  };

  console.log('Rendering CameraScreen');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => requestCameraPermission().then(() => handlePickImage(true))} style={styles.cameraButton}>
        <FontAwesomeIcon icon={faCamera} size={24} color="#ffffff" />
        <Text style={styles.cameraButtonText}>Take Picture</Text>
      </TouchableOpacity>
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
      {imageData ? (
        <Button title="Clear" onPress={handleClear} />
      ) : null}
    </View>
  );
};

export default CameraScreen;
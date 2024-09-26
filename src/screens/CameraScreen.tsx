import React, {useState, useEffect} from 'react';
import {Image, Text, TouchableOpacity, View, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCamera, faUndo} from '@fortawesome/free-solid-svg-icons';
import {pickImage, requestCameraPermission} from '../utils/ImagePickerUtil';
import {processImage} from '../services/ImageProcessingService';
import {loadCustomItems} from '../services/ReferenceItemsService';
import styles from '../styles/CameraScreenStyles';
import { CustomItem, predefinedItems } from '../utils/CommonHelper';

const CameraScreen = () => {
  const [measurements, setMeasurements] = useState({
    threadSpacing: 0,
    length: 0,
    socketSize: 0,
    headType: '',
  });
  const [imageData, setImageData] = useState('');
  const [referenceItems, setReferenceItems] = useState<CustomItem[]>([]);
  const [selectedReferenceItem, setSelectedReferenceItem] = useState<string | null>(null);

  useEffect(() => {
    loadCustomItems(setReferenceItems);
  }, []);

  const handlePickImage = (useCamera: boolean) => {
    pickImage(
      useCamera,
      item => {
        if (item.photoUris && item.photoUris.length > 0) {
          const uri = item.photoUris[0] as string;
          processImage(uri, setImageData, setMeasurements);
        }
      },
      'CameraScreen',
    );
  };

  const handleClear = () => {
    setImageData('');
    setMeasurements({
      threadSpacing: 0,
      length: 0,
      socketSize: 0,
      headType: '',
    });
    setSelectedReferenceItem(null);
  };

  const combinedItems = [...predefinedItems, ...referenceItems];

  const handleTakePicture = () => {
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

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>
          Reference Item to be Included in Picture <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={selectedReferenceItem}
          onValueChange={(itemValue) => setSelectedReferenceItem(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Reference Item" value={null} />
          {combinedItems.map(item => (
            <Picker.Item key={item.id} label={item.name} value={item.id} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity
        onPress={handleTakePicture}
        style={[
          styles.cameraButton,
          !selectedReferenceItem && styles.cameraButtonDisabled,
        ]}
        disabled={!selectedReferenceItem}
      >
        <FontAwesomeIcon icon={faCamera} size={24} color="#ffffff" />
        <Text style={styles.cameraButtonText}>Take Picture</Text>
      </TouchableOpacity>
      {imageData ? (
        <Image
          source={{uri: 'data:image/jpeg;base64,' + imageData}}
          style={styles.image}
        />
      ) : null}
      <View style={styles.metadataContainer}>
        <Text style={styles.metadataText}>
          Thread Spacing: {measurements.threadSpacing.toFixed(2)} units
        </Text>
        <Text style={styles.metadataText}>
          Length: {measurements.length.toFixed(2)} units
        </Text>
        <Text style={styles.metadataText}>
          Socket Size: {measurements.socketSize.toFixed(2)} units
        </Text>
        <Text style={styles.metadataText}>
          Head Type: {measurements.headType}
        </Text>
      </View>
      {imageData ? (
        <TouchableOpacity onPress={handleClear} style={styles.resetButton}>
          <FontAwesomeIcon icon={faUndo} size={24} color="#ffffff" />
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default CameraScreen;

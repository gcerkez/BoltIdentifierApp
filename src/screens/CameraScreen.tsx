import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCamera, faUndo} from '@fortawesome/free-solid-svg-icons';
import {loadCustomItems} from '../services/ReferenceItemsService';
import styles from '../styles/CameraScreenStyles';
import {CustomItem, predefinedItems} from '../utils/CommonHelper';
import {handlePickImage, handleTakePicture} from '../services/CameraService';
import UnitPicker from '../components/UnitPicker';
import ReferenceItemPicker from '../components/ReferenceItemPicker';

const CameraScreen = () => {
  const [measurements, setMeasurements] = useState({
    threadSpacing: 0,
    length: 0,
    socketSize: 0,
    headType: '',
  });
  const [imageData, setImageData] = useState('');
  const [referenceItems, setReferenceItems] = useState<CustomItem[]>([]);
  const [selectedReferenceItem, setSelectedReferenceItem] = useState<
    string | null
  >(null);
  const [selectedUnits, setSelectedUnits] = useState({
    threadSpacing: 'mm',
    length: 'mm',
    socketSize: 'mm',
  });

  const combinedItems = [...predefinedItems, ...referenceItems];

  useEffect(() => {
    loadCustomItems(setReferenceItems);
  }, []);

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

  const convertMeasurement = (value: number, unit: string) => {
    switch (unit) {
      case 'cm':
        return value / 10;
      case 'in':
        return value / 25.4;
      case 'ft':
        return value / 304.8;
      default:
        return value;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>
          Reference Item to be Included in Picture{' '}
          <Text style={styles.required}>*</Text>
        </Text>
        <ReferenceItemPicker
          selectedReferenceItem={selectedReferenceItem}
          onValueChange={setSelectedReferenceItem}
          combinedItems={combinedItems}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            handleTakePicture(selectedReferenceItem, useCamera =>
              handlePickImage(
                useCamera,
                selectedReferenceItem,
                combinedItems,
                setImageData,
                setMeasurements,
              ),
            )
          }
          style={[
            styles.cameraButton,
            !selectedReferenceItem && styles.cameraButtonDisabled,
          ]}
          disabled={!selectedReferenceItem}>
          <FontAwesomeIcon icon={faCamera} size={24} color="#ffffff" />
          <Text style={styles.cameraButtonText}>Take Picture</Text>
        </TouchableOpacity>
        {imageData ? (
          <TouchableOpacity onPress={handleClear} style={styles.resetButton}>
            <FontAwesomeIcon icon={faUndo} size={24} color="#ffffff" />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {imageData ? (
        <Image
          source={{uri: 'data:image/jpeg;base64,' + imageData}}
          style={styles.image}
        />
      ) : null}
      <View style={styles.metadataContainer}>
        <View style={styles.metadataRow}>
          <View style={styles.metadataColumn}>
            <Text style={styles.metadataText}>Thread Spacing</Text>
          </View>
          <View style={styles.metadataColumn}>
            <Text style={styles.metadataText}>
              {convertMeasurement(
                measurements.threadSpacing,
                selectedUnits.threadSpacing,
              ).toFixed(2)}
            </Text>
          </View>
          <View style={styles.metadataColumn}>
            <UnitPicker
              selectedUnit={selectedUnits.threadSpacing}
              onValueChange={(itemValue: string) =>
                setSelectedUnits({...selectedUnits, threadSpacing: itemValue})
              }
            />
          </View>
        </View>
        <View style={styles.metadataRow}>
          <View style={styles.metadataColumn}>
            <Text style={styles.metadataText}>Length</Text>
          </View>
          <View style={styles.metadataColumn}>
            <Text style={styles.metadataText}>
              {convertMeasurement(
                measurements.length,
                selectedUnits.length,
              ).toFixed(2)}
            </Text>
          </View>
          <View style={styles.metadataColumn}>
            <UnitPicker
              selectedUnit={selectedUnits.length}
              onValueChange={(itemValue: string) =>
                setSelectedUnits({...selectedUnits, length: itemValue})
              }
            />
          </View>
        </View>
        <View style={styles.metadataRow}>
          <View style={styles.metadataColumn}>
            <Text style={styles.metadataText}>Socket Size</Text>
          </View>
          <View style={styles.metadataColumn}>
            <Text style={styles.metadataText}>
              {convertMeasurement(
                measurements.socketSize,
                selectedUnits.socketSize,
              ).toFixed(2)}
            </Text>
          </View>
          <View style={styles.metadataColumn}>
            <UnitPicker
              selectedUnit={selectedUnits.socketSize}
              onValueChange={(itemValue: string) =>
                setSelectedUnits({...selectedUnits, socketSize: itemValue})
              }
            />
          </View>
        </View>
        <View style={[styles.metadataRow, {borderBottomWidth: 0}]}>
          <View style={styles.metadataColumn}>
            <Text style={styles.metadataText}>Head Type</Text>
          </View>
          <View style={styles.metadataColumn}>
            <Text style={styles.metadataText}>{measurements.headType}</Text>
          </View>
          <View style={styles.metadataColumn}>
            <View style={styles.inlinePicker} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CameraScreen;

import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCamera,
  faSlidersH,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import {
  getAllReferenceItems,
  loadCustomItems,
} from '../services/ReferenceItemsService';
import styles from '../styles/CameraScreenStyles';
import {
  BoltMeasurement,
  BoltStandardMatch,
  CaliperRegion,
  CustomItem,
  UnitType,
} from '../types/BoltTypes';
import { handlePickImage, handleTakePicture } from '../services/CameraService';
import {
  getDefaultCaliperRegion,
  measureFromCaliperRegion,
} from '../services/ImageProcessingService';
import { matchBoltStandards } from '../services/BoltMatcherService';
import ReferenceItemPicker from '../components/ReferenceItemPicker';
import BoltMatchBadge from '../components/BoltMatchBadge';
import MeasurementCard from '../components/MeasurementCard';
import CaliperOverlay from '../components/CaliperOverlay';

const CameraScreen: React.FC = () => {
  const [measurements, setMeasurements] = useState<BoltMeasurement>({
    threadSpacing: 0,
    length: 0,
    shankLength: 0,
    socketSize: 0,
    shankDiameter: 0,
    headType: 'Unknown',
  });
  const [imageData, setImageData] = useState<string>('');
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [selectedReferenceItem, setSelectedReferenceItem] = useState<string | null>('1'); // Default to US Quarter
  const [selectedUnit, setSelectedUnit] = useState<UnitType>('mm');
  const [caliperRegion, setCaliperRegion] = useState<CaliperRegion>(getDefaultCaliperRegion());
  const [showCalipers, setShowCalipers] = useState<boolean>(false);
  const [bestMatch, setBestMatch] = useState<BoltStandardMatch | undefined>(undefined);

  const combinedItems = getAllReferenceItems(customItems);
  const activeReference = combinedItems.find(item => item.id === selectedReferenceItem);

  useEffect(() => {
    loadCustomItems(setCustomItems);
  }, []);

  const handleClear = () => {
    setImageData('');
    setMeasurements({
      threadSpacing: 0,
      length: 0,
      shankLength: 0,
      socketSize: 0,
      shankDiameter: 0,
      headType: 'Unknown',
    });
    setBestMatch(undefined);
    setShowCalipers(false);
  };

  const handleCaliperChange = (updatedCaliper: CaliperRegion) => {
    setCaliperRegion(updatedCaliper);
    if (activeReference) {
      const updatedMeasurements = measureFromCaliperRegion(
        updatedCaliper,
        activeReference,
        600,
        600,
      );
      setMeasurements(updatedMeasurements);
      const matchResult = matchBoltStandards(updatedMeasurements);
      setBestMatch(matchResult.bestMatch);
    }
  };

  const onScanComplete = () => {
    // Re-evaluate standard match from current measurements
    const matchResult = matchBoltStandards(measurements);
    setBestMatch(matchResult.bestMatch);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Reference Object Card */}
      <View style={styles.headerCard}>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>
            Calibration Reference Object <Text style={styles.required}>*</Text>
          </Text>
          <ReferenceItemPicker
            selectedReferenceItem={selectedReferenceItem}
            onValueChange={setSelectedReferenceItem}
            combinedItems={combinedItems}
          />
        </View>

        {activeReference ? (
          <View style={styles.referenceDetailChip}>
            <Text style={styles.referenceDetailText}>
              Selected: {activeReference.name} (
              {activeReference.isRound
                ? `Diameter: ${activeReference.width} ${activeReference.unit}`
                : `${activeReference.width} × ${activeReference.height} ${activeReference.unit}`}
              )
            </Text>
          </View>
        ) : null}
      </View>

      {/* Action Buttons */}
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
                setCaliperRegion,
                onScanComplete,
              ),
            )
          }
          style={[
            styles.cameraButton,
            !selectedReferenceItem && styles.cameraButtonDisabled,
          ]}
          disabled={!selectedReferenceItem}>
          <FontAwesomeIcon icon={faCamera} size={20} color="#ffffff" />
          <Text style={styles.cameraButtonText}>
            {imageData ? 'Retake / New Photo' : 'Capture Bolt'}
          </Text>
        </TouchableOpacity>

        {imageData ? (
          <TouchableOpacity onPress={handleClear} style={styles.resetButton}>
            <FontAwesomeIcon icon={faUndo} size={16} color="#ffffff" />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Captured Image & Caliper Overlay Toggle */}
      {imageData ? (
        <View style={styles.imageCard}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageData}` }}
            style={styles.image}
          />
          <TouchableOpacity
            style={styles.toggleCaliperBtn}
            onPress={() => setShowCalipers(!showCalipers)}>
            <Text style={styles.toggleCaliperText}>
              <FontAwesomeIcon icon={faSlidersH} size={12} color="#0f172a" />{' '}
              {showCalipers ? 'Hide Caliper Overlays' : 'Adjust Calipers & Reticles'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Interactive Caliper Overlay (when opened) */}
      {imageData && showCalipers ? (
        <CaliperOverlay
          caliper={caliperRegion}
          onChange={handleCaliperChange}
          referenceItem={activeReference}
        />
      ) : null}

      {/* Analysis Results Display */}
      {measurements.shankDiameter > 0 || measurements.length > 0 ? (
        <>
          {/* Engineering Standard Match Badge */}
          <BoltMatchBadge match={bestMatch} />

          {/* Unit Toggle Row */}
          <View style={styles.unitSelectorRow}>
            <Text style={styles.unitSelectorLabel}>Display Unit:</Text>
            <View style={styles.unitPills}>
              {(['mm', 'cm', 'in'] as UnitType[]).map(unitKey => (
                <TouchableOpacity
                  key={unitKey}
                  style={[
                    styles.unitPill,
                    selectedUnit === unitKey && styles.unitPillActive,
                  ]}
                  onPress={() => setSelectedUnit(unitKey)}>
                  <Text
                    style={[
                      styles.unitPillText,
                      selectedUnit === unitKey && styles.unitPillTextActive,
                    ]}>
                    {unitKey.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Extracted Dimension Cards */}
          <MeasurementCard measurements={measurements} unit={selectedUnit} />
        </>
      ) : !imageData ? (
        /* Helpful Empty State Guidance */
        <View style={styles.emptyStateCard}>
          <View style={styles.emptyStateIconCircle}>
            <FontAwesomeIcon icon={faCamera} size={30} color="#2563eb" />
          </View>
          <Text style={styles.emptyStateTitle}>Ready to Identify Fasteners</Text>
          <Text style={styles.emptyStateText}>
            1. Select a reference object (e.g. US Quarter, Penny, or Credit Card).{'\n'}
            2. Place it right next to your bolt on a flat contrasting background.{'\n'}
            3. Tap 'Capture Bolt' to automatically analyze pitch, length, diameter, and standard thread size.
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default CameraScreen;

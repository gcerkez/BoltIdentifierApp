import React from 'react';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/CameraScreenStyles';

const units = ['mm', 'cm', 'in', 'ft'];

interface UnitPickerProps {
  selectedUnit: string;
  onValueChange: (value: string) => void;
}

const UnitPicker: React.FC<UnitPickerProps> = ({ selectedUnit, onValueChange }) => (
  <Picker
    selectedValue={selectedUnit}
    onValueChange={onValueChange}
    style={styles.inlinePicker}
  >
    {units.map(unit => (
      <Picker.Item key={unit} label={unit} value={unit} />
    ))}
  </Picker>
);

export default UnitPicker;
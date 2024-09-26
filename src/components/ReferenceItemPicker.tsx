import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { CustomItem } from '../utils/CommonHelper';
import styles from '../styles/CameraScreenStyles';

interface ReferenceItemPickerProps {
  selectedReferenceItem: string | null;
  onValueChange: (itemValue: string | null) => void;
  combinedItems: CustomItem[];
}

const ReferenceItemPicker: React.FC<ReferenceItemPickerProps> = ({ selectedReferenceItem, onValueChange, combinedItems }) => (
  <Picker
    selectedValue={selectedReferenceItem || ''}
    onValueChange={onValueChange}
    style={styles.picker}
  >
    <Picker.Item label="Select Reference Item" value={null} />
    {combinedItems.map(item => (
      <Picker.Item key={item.id} label={item.name} value={item.id} />
    ))}
  </Picker>
);

export default ReferenceItemPicker;
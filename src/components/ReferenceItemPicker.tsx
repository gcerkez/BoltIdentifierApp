import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { CustomItem } from '../types/BoltTypes';
import styles from '../styles/CameraScreenStyles';

interface ReferenceItemPickerProps {
  selectedReferenceItem: string | null;
  onValueChange: (itemValue: string | null) => void;
  combinedItems: CustomItem[];
}

const ReferenceItemPicker: React.FC<ReferenceItemPickerProps> = ({
  selectedReferenceItem,
  onValueChange,
  combinedItems,
}) => (
  <Picker
    selectedValue={selectedReferenceItem || ''}
    onValueChange={onValueChange}
    style={styles.picker}>
    <Picker.Item label="-- Choose Reference Object --" value={null} />
    {combinedItems.map(item => {
      const dimLabel =
        item.width === item.height
          ? `⌀${item.width} ${item.unit}`
          : `${item.width}×${item.height} ${item.unit}`;
      return (
        <Picker.Item
          key={item.id}
          label={`${item.name} (${dimLabel})`}
          value={item.id}
        />
      );
    })}
  </Picker>
);

export default ReferenceItemPicker;

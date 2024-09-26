import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, Image, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faTrash, faPlus, faCamera } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/RegisteredItemsStyles';
import {
  loadCustomItems,
  addOrUpdateCustomItem,
  deleteCustomItem,
  confirmDeleteCustomItem
} from '../services/RegisteredItemsService';
import {
  requestCameraPermission,
  pickImage,
  confirmDeletePhoto,
  deletePhoto
} from '../utils/ImagePickerUtil';

// Predefined items with static data
const predefinedItems: CustomItem[] = [
  {
    id: '1', name: 'US Quarter', width: '24.26', height: '24.26', unit: 'mm',
    photoUris: [
      require('../resources/predefinedItems/us-quarter/us-quarter-front.jpg'),
      require('../resources/predefinedItems/us-quarter/us-quarter-back.jpg')
    ]
  },
  {
    id: '2', name: 'US Penny', width: '19.05', height: '19.05', unit: 'mm',
    photoUris: [
      require('../resources/predefinedItems/us-penny/us-penny-front.jpg'),
      require('../resources/predefinedItems/us-penny/us-penny-back.jpg')
    ]
  },
];

// Interface for custom items
export interface CustomItem {
  id: string;
  name: string;
  width: string;
  height: string;
  unit: string;
  photoUris?: (string | number)[];
}

const RegisteredItems = () => {
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<CustomItem>>({
    name: '',
    width: '',
    height: '',
    unit: 'mm',
    photoUris: [],
  });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isRound, setIsRound] = useState(false);
  const [size, setSize] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Load custom items on component mount
  useEffect(() => {
    loadCustomItems(setCustomItems);
  }, []);

  const handleAddOrUpdateCustomItem = () => {
    addOrUpdateCustomItem(
      newItem,
      customItems,
      setCustomItems,
      setNewItem,
      setEditingItemId,
      setSize,
      setIsRound,
      setIsFormVisible,
      isRound,
      size,
      editingItemId
    );
  };

  const handleDeleteCustomItem = (id: string) => {
    deleteCustomItem(id, customItems, setCustomItems);
  };

  const handleEditCustomItem = (item: CustomItem) => {
    setNewItem(item);
    setEditingItemId(item.id);
    setIsRound(item.width === item.height);
    setSize(item.width === item.height ? item.width : '');
    setIsFormVisible(true);
  };

  const handlePickImage = (useCamera: boolean) => {
    pickImage(useCamera, setNewItem);
  };

  const handleCancel = () => {
    setNewItem({
      name: '',
      width: '',
      height: '',
      unit: 'mm',
      photoUris: [],
    });
    setSize('');
    setIsRound(false);
    setIsFormVisible(false);
  };

  const handleNumericInput = (text: string, setter: (value: string) => void) => {
    const filteredText = text.replace(/[^0-9.]/g, '');
    setter(filteredText);
  };

  return (
    <View style={[styles.container, styles.roundedCorners]}>
      <FlatList
        data={[...predefinedItems, ...customItems]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedItemId(selectedItemId === item.id ? null : item.id)}>
            <View style={[
              styles.item,
              predefinedItems.includes(item) && styles.predefinedItem,
              selectedItemId === item.id && styles.selectedItem,
              styles.roundedCorners
            ]}>
              <View style={styles.itemHeader}>
                <View style={styles.itemTextContainer}>
                  <Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text> - {item.width === item.height ? `Diameter: ${item.width}` : `${item.width} x ${item.height}`} {item.unit}</Text>
                  </Text>
                  {predefinedItems.includes(item) && <Text style={styles.predefinedSubscript}>Predefined</Text>}
                  {customItems.includes(item) && <Text style={styles.customSubscript}>User Created</Text>}
                </View>
                {selectedItemId === item.id && customItems.includes(item) && (
                  <TouchableOpacity
                    style={[styles.smallButton, styles.roundedCorners]}
                    onPress={() => confirmDeleteCustomItem(item.id, handleDeleteCustomItem)}
                  >
                    <FontAwesomeIcon icon={faTrash} size={16} color="#ffffff" />
                  </TouchableOpacity>
                )}
              </View>
              {selectedItemId === item.id && item.photoUris && (
                <View style={styles.imageContainer}>
                  {item.photoUris.map((uri, index) => (
                    <Image key={index} source={typeof uri === 'string' ? { uri } : uri} style={styles.image} />
                  ))}
                </View>
              )}
              {selectedItemId === item.id && customItems.includes(item) && (
                <View style={styles.itemButtons}>
                  <Button title="Edit" onPress={() => handleEditCustomItem(item)} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      {isFormVisible && (
        <View style={[styles.formContainer, styles.roundedCorners]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingItemId ? "Edit Item" : "Add New Item"}</Text>
          </View>
          <TextInput
            placeholder="Item Name"
            value={newItem.name}
            onChangeText={(text) => setNewItem({ ...newItem, name: text })}
            style={[styles.input, !newItem.name && styles.required, styles.roundedCorners]}
          />
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isRound}
              onValueChange={setIsRound}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>Is the item round?</Text>
          </View>
          {isRound ? (
            <TextInput
              placeholder="Item Diameter"
              value={size}
              onChangeText={(text) => handleNumericInput(text, setSize)}
              style={[styles.input, !size && styles.required, styles.roundedCorners]}
              keyboardType="numeric"
            />
          ) : (
            <>
              <TextInput
                placeholder="Item Width"
                value={newItem.width}
                onChangeText={(text) => handleNumericInput(text, (value) => setNewItem({ ...newItem, width: value }))}
                style={[styles.input, !newItem.width && styles.required, styles.roundedCorners]}
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Item Height"
                value={newItem.height}
                onChangeText={(text) => handleNumericInput(text, (value) => setNewItem({ ...newItem, height: value }))}
                style={[styles.input, !newItem.height && styles.required, styles.roundedCorners]}
                keyboardType="numeric"
              />
            </>
          )}
          <Picker
            selectedValue={newItem.unit}
            style={styles.picker}
            onValueChange={(itemValue) => setNewItem({ ...newItem, unit: itemValue })}
          >
            <Picker.Item label="mm" value="mm" />
            <Picker.Item label="cm" value="cm" />
            <Picker.Item label="in" value="in" />
            <Picker.Item label="ft" value="ft" />
          </Picker>
          <View style={styles.buttonContainer}>
            <View style={styles.imageContainer}>
              {newItem.photoUris && newItem.photoUris.map((uri, index) => (
                <TouchableOpacity key={index} onPress={() => confirmDeletePhoto(index, (i) => deletePhoto(i, setNewItem))}>
                  <Image source={{ uri: String(uri) }} style={styles.image} />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.imageButtonGap} />
            <TouchableOpacity
              onPress={() => requestCameraPermission().then(() => handlePickImage(true))}
              style={[styles.cameraButton, newItem.photoUris && newItem.photoUris.length >= 3 && styles.cameraButtonDisabled]}
              disabled={newItem.photoUris && newItem.photoUris.length >= 3}
            >
              <FontAwesomeIcon icon={faCamera} size={24} color="#ffffff" />
              <Text style={styles.cameraButtonText}>Pick an image or take a photo</Text>
            </TouchableOpacity>
            <View style={styles.inlineButtons}>
              <View style={styles.halfButton}>
                <Button
                  onPress={handleCancel}
                  title="Cancel"
                />
              </View>
              <View style={styles.buttonGap} />
              <View style={styles.halfButton}>
                <Button
                  title={editingItemId ? "Update Item" : "Add Item"}
                  onPress={handleAddOrUpdateCustomItem}
                  disabled={!newItem.name || !newItem.photoUris || newItem.photoUris.length === 0 || (isRound ? !size : !newItem.width || !newItem.height)}
                />
              </View>
            </View>
          </View>
        </View>
      )}
      <TouchableOpacity 
        onPress={() => setIsFormVisible(true)}  
        style={[
          styles.addItemButton,
          isFormVisible && styles.addItemButtonDisabled // Apply disabled style conditionally
        ]}
        disabled={isFormVisible} // Disable button when form is visible
      >
        <FontAwesomeIcon icon={faPlus} size={24} color="#ffffff" />
        <Text style={styles.addItemButtonText}>Add New Item</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisteredItems;
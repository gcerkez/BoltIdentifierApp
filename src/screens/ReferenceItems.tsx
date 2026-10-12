import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCamera,
  faEdit,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/ReferenceItemsStyles';
import {
  addOrUpdateCustomItem,
  confirmDeleteCustomItem,
  deleteCustomItem,
  getAllReferenceItems,
  loadCustomItems,
} from '../services/ReferenceItemsService';
import {
  confirmDeletePhoto,
  deletePhoto,
  pickImage,
} from '../utils/ImagePickerUtil';
import { CustomItem } from '../types/BoltTypes';
import { predefinedItems } from '../constants/PredefinedItems';
import { handleTakePicture } from '../services/CameraService';

type FilterCategory = 'all' | 'coin' | 'card' | 'custom';

const ReferenceItems: React.FC = () => {
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Form State
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemWidth, setItemWidth] = useState('');
  const [itemHeight, setItemHeight] = useState('');
  const [itemUnit, setItemUnit] = useState('mm');
  const [isRound, setIsRound] = useState(true);
  const [photoUris, setPhotoUris] = useState<(string | number)[]>([]);

  useEffect(() => {
    loadCustomItems(setCustomItems);
  }, []);

  const allItems = getAllReferenceItems(customItems);

  const filteredItems = allItems.filter(item => {
    if (selectedCategory === 'all') {
      return true;
    }
    if (selectedCategory === 'custom') {
      return customItems.some(c => c.id === item.id);
    }
    return item.category === selectedCategory;
  });

  const resetForm = () => {
    setItemName('');
    setItemWidth('');
    setItemHeight('');
    setItemUnit('mm');
    setIsRound(true);
    setPhotoUris([]);
    setEditingItemId(null);
    setIsFormVisible(false);
  };

  const handleEditItem = (item: CustomItem) => {
    setEditingItemId(item.id);
    setItemName(item.name);
    setItemWidth(item.width);
    setItemHeight(item.height);
    setItemUnit(item.unit || 'mm');
    setIsRound(item.isRound ?? (item.width === item.height));
    setPhotoUris(item.photoUris || []);
    setIsFormVisible(true);
  };

  const handleDeleteItem = (id: string) => {
    confirmDeleteCustomItem(id, () => {
      deleteCustomItem(id, customItems, setCustomItems);
      if (selectedItemId === id) {
        setSelectedItemId(null);
      }
    });
  };

  const handleSaveItem = () => {
    const newItemData: Partial<CustomItem> = {
      name: itemName,
      width: itemWidth,
      height: isRound ? itemWidth : itemHeight,
      unit: itemUnit,
      isRound,
      photoUris,
    };

    addOrUpdateCustomItem(
      newItemData,
      customItems,
      setCustomItems,
      resetForm,
      editingItemId,
    );
  };

  const handlePhotoCapture = (useCamera: boolean) => {
    pickImage(
      useCamera,
      (updater: any) => {
        if (typeof updater === 'function') {
          const res = updater({ photoUris });
          setPhotoUris(res.photoUris || []);
        } else if (updater && updater.photoUris) {
          setPhotoUris(updater.photoUris);
        }
      },
      'ReferenceItems',
    );
  };

  return (
    <View style={styles.container}>
      {/* Category Pills */}
      <View style={styles.filterRow}>
        {(['all', 'coin', 'card', 'custom'] as FilterCategory[]).map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterPill,
              selectedCategory === cat && styles.filterPillActive,
            ]}
            onPress={() => setSelectedCategory(cat)}>
            <Text
              style={[
                styles.filterPillText,
                selectedCategory === cat && styles.filterPillTextActive,
              ]}>
              {cat === 'all'
                ? 'All Items'
                : cat === 'coin'
                ? 'Coins'
                : cat === 'card'
                ? 'Cards'
                : 'Custom'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Item List */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isPredefined = predefinedItems.some(p => p.id === item.id);
          const isSelected = selectedItemId === item.id;

          const dimensionText =
            item.width === item.height
              ? `Diameter: ${item.width} ${item.unit}`
              : `${item.width} × ${item.height} ${item.unit}`;

          return (
            <TouchableOpacity
              onPress={() => setSelectedItemId(isSelected ? null : item.id)}
              activeOpacity={0.8}>
              <View
                style={[
                  styles.item,
                  isPredefined ? styles.predefinedItem : styles.customItem,
                  isSelected && styles.selectedItem,
                ]}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTextContainer}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDimension}>{dimensionText}</Text>
                    <View style={styles.badgeRow}>
                      <View
                        style={[
                          styles.badge,
                          isPredefined ? styles.predefinedBadge : styles.customBadge,
                        ]}>
                        <Text
                          style={[
                            styles.badgeText,
                            isPredefined
                              ? styles.predefinedBadgeText
                              : styles.customBadgeText,
                          ]}>
                          {isPredefined ? 'Predefined' : 'User Created'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {!isPredefined && (
                    <View style={styles.actionButtonsRow}>
                      <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => handleEditItem(item)}>
                        <FontAwesomeIcon icon={faEdit} size={14} color="#0f172a" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.iconBtn, styles.deleteBtn]}
                        onPress={() => handleDeleteItem(item.id)}>
                        <FontAwesomeIcon icon={faTrash} size={14} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {isSelected && item.photoUris && item.photoUris.length > 0 && (
                  <View style={styles.imageContainer}>
                    {item.photoUris.map((uri, index) => (
                      <Image
                        key={index}
                        source={typeof uri === 'string' ? { uri } : uri}
                        style={styles.image}
                      />
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            No reference objects found for this filter.
          </Text>
        }
      />

      {/* Floating Add New Item Button */}
      <TouchableOpacity
        style={styles.addItemFloatingBtn}
        onPress={() => {
          resetForm();
          setIsFormVisible(true);
        }}>
        <FontAwesomeIcon icon={faPlus} size={16} color="#ffffff" />
        <Text style={styles.addItemFloatingBtnText}>Add Reference Object</Text>
      </TouchableOpacity>

      {/* Add / Edit Item Modal */}
      <Modal
        visible={isFormVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={resetForm}>
        <View style={styles.formContainer}>
          <View style={styles.formCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItemId ? 'Edit Reference Object' : 'New Reference Object'}
              </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                placeholder='Object Name (e.g. 50c Coin, 2" Washer)'
                value={itemName}
                onChangeText={setItemName}
                style={[styles.input, !itemName && styles.required]}
              />

              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={isRound}
                  onValueChange={setIsRound}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Is this object round / circular?</Text>
              </View>

              {isRound ? (
                <TextInput
                  placeholder="Diameter (e.g. 24.26)"
                  value={itemWidth}
                  onChangeText={setItemWidth}
                  keyboardType="numeric"
                  style={[styles.input, !itemWidth && styles.required]}
                />
              ) : (
                <>
                  <TextInput
                    placeholder="Width (e.g. 85.6)"
                    value={itemWidth}
                    onChangeText={setItemWidth}
                    keyboardType="numeric"
                    style={[styles.input, !itemWidth && styles.required]}
                  />
                  <TextInput
                    placeholder="Height (e.g. 53.98)"
                    value={itemHeight}
                    onChangeText={setItemHeight}
                    keyboardType="numeric"
                    style={[styles.input, !itemHeight && styles.required]}
                  />
                </>
              )}

              <Picker
                selectedValue={itemUnit}
                onValueChange={setItemUnit}
                style={styles.picker}>
                <Picker.Item label="Millimeters (mm)" value="mm" />
                <Picker.Item label="Centimeters (cm)" value="cm" />
                <Picker.Item label="Inches (in)" value="in" />
              </Picker>

              {/* Photo Attachment Previews */}
              {photoUris.length > 0 && (
                <View style={styles.imageContainer}>
                  {photoUris.map((uri, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() =>
                        confirmDeletePhoto(idx, i =>
                          deletePhoto(i, (setter: any) => {
                            const res = typeof setter === 'function' ? setter({ photoUris }) : setter;
                            setPhotoUris(res.photoUris || []);
                          }),
                        )
                      }>
                      <Image
                        source={typeof uri === 'string' ? { uri } : uri}
                        style={styles.image}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {photoUris.length < 3 && (
                <TouchableOpacity
                  style={styles.photoPickerBtn}
                  onPress={() => handleTakePicture(null, handlePhotoCapture)}>
                  <FontAwesomeIcon icon={faCamera} size={14} color="#2563eb" />
                  <Text style={styles.photoPickerText}>
                    Attach Reference Photo (Optional)
                  </Text>
                </TouchableOpacity>
              )}

              <View style={styles.formActionRow}>
                <TouchableOpacity style={styles.formBtnCancel} onPress={resetForm}>
                  <Text style={styles.formBtnCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.formBtnSubmit,
                    (!itemName || !itemWidth) && styles.formBtnSubmitDisabled,
                  ]}
                  disabled={!itemName || !itemWidth}
                  onPress={handleSaveItem}>
                  <Text style={styles.formBtnSubmitText}>
                    {editingItemId ? 'Update Item' : 'Save Item'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReferenceItems;

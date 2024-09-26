import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

interface ScanHistoryItem {
  id: string;
  imageUri: string;
  date: string;
  measurements: {
    threadSpacing: number;
    length: number;
    socketSize: number;
    headType: string;
  };
}

const HistoryScreen = () => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null); // State to track selected item

  const loadHistory = async () => {
    const storedHistory = await AsyncStorage.getItem('scanHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const deleteHistoryItem = async (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    await AsyncStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
    setSelectedItemId(null); // Clear selection after deletion
  };

  const clearHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            setHistory([]);
            await AsyncStorage.removeItem('scanHistory');
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleRowPress = (id: string) => {
    setSelectedItemId(selectedItemId === id ? null : id); // Toggle selection
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, selectedItemId === item.id && styles.selectedItem]}
            onPress={() => handleRowPress(item.id)}
          >
            <View style={styles.rowContent}>
              <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
              <View style={styles.details}>
                <Text>Date: {item.date}</Text>
                <Text>Thread Spacing: {item.measurements.threadSpacing.toFixed(2)} units</Text>
                <Text>Length: {item.measurements.length.toFixed(2)} units</Text>
                <Text>Socket Size: {item.measurements.socketSize.toFixed(2)} units</Text>
                <Text>Head Type: {item.measurements.headType}</Text>
              </View>
              {selectedItemId === item.id && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteHistoryItem(item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} size={16} color="#ffffff" />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.clearHistoryButton}
        onPress={clearHistory}
      >
        <Text style={styles.clearHistoryButtonText}>Clear History</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'lightgreen', // Added background color for visibility
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f0f0f0', // Slightly different background color
    borderRadius: 4, // Rounded corners
    padding: 8, // Padding inside the item
  },
  selectedItem: {
    backgroundColor: '#d0f0c0', // Highlight selected item
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center', // Ensure items are centered vertically
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 4, // Rounded corners for the image
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff0000',
    paddingVertical: 4, // Adjust padding to make the button smaller
    paddingHorizontal: 8,
    borderRadius: 4, // Match the style of the RegisteredItems screen
  },
  clearHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  clearHistoryButtonText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;
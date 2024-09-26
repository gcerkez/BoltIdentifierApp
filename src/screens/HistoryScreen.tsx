import React, {useCallback, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTrash, faUndo} from '@fortawesome/free-solid-svg-icons';
import {useFocusEffect} from '@react-navigation/native';
import styles from '../styles/HistoryScreenStyles';
import {
  clearHistory,
  deleteHistoryItem,
  loadHistory,
} from '../services/HistoryService';

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
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadHistory(setHistory);
    }, []),
  );

  const handleRowPress = (id: string) => {
    setSelectedItemId(selectedItemId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.item,
              selectedItemId === item.id && styles.selectedItem,
            ]}
            onPress={() => handleRowPress(item.id)}>
            <View style={styles.rowContent}>
              <Image source={{uri: item.imageUri}} style={styles.thumbnail} />
              <View style={styles.details}>
                <Text>Date: {item.date}</Text>
                <Text>
                  Thread Spacing: {item.measurements.threadSpacing.toFixed(2)}{' '}
                  units
                </Text>
                <Text>Length: {item.measurements.length.toFixed(2)} units</Text>
                <Text>
                  Socket Size: {item.measurements.socketSize.toFixed(2)} units
                </Text>
                <Text>Head Type: {item.measurements.headType}</Text>
              </View>
              {selectedItemId === item.id && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() =>
                    deleteHistoryItem(
                      item.id,
                      history,
                      setHistory,
                      setSelectedItemId,
                    )
                  }>
                  <FontAwesomeIcon icon={faTrash} size={16} color="#ffffff" />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.clearHistoryButton}
        onPress={() => clearHistory(setHistory)}>
        <FontAwesomeIcon icon={faUndo} size={24} color="#ffffff" />
        <Text style={styles.clearHistoryButtonText}>Clear History</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HistoryScreen;

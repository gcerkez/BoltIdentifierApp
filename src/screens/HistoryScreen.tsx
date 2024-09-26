import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RectButton, Swipeable} from 'react-native-gesture-handler';

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

  useEffect(() => {
    const loadHistory = async () => {
      const storedHistory = await AsyncStorage.getItem('scanHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    };
    loadHistory();
  }, []);

  const deleteHistoryItem = async (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    await AsyncStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all history?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          onPress: async () => {
            setHistory([]);
            await AsyncStorage.removeItem('scanHistory');
          },
        },
      ],
      {cancelable: true},
    );
  };

  const renderRightActions = (id: string) => (
    <RectButton
      style={styles.deleteButton}
      onPress={() => deleteHistoryItem(id)}>
      <Text style={styles.deleteButtonText}>Delete</Text>
    </RectButton>
  );

  console.log('Rendering HistoryScreen');

  return (
    <View style={styles.container}>
      <Button title="Clear History" onPress={clearHistory} />
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <View style={styles.item}>
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
            </View>
          </Swipeable>
        )}
      />
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
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HistoryScreen;
import React, { useCallback, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faSearch,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/HistoryScreenStyles';
import {
  clearHistory,
  deleteHistoryItem,
  loadHistory,
} from '../services/HistoryService';
import { ScanHistoryItem } from '../types/BoltTypes';
import MeasurementCard from '../components/MeasurementCard';
import BoltMatchBadge from '../components/BoltMatchBadge';

const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadHistory(setHistory);
    }, []),
  );

  const filteredHistory = history.filter(item => {
    if (!searchQuery.trim()) {
      return true;
    }
    const query = searchQuery.toLowerCase();
    const titleMatch = item.title?.toLowerCase().includes(query);
    const standardMatch = item.bestMatch?.designation.toLowerCase().includes(query);
    const dateMatch = item.date.toLowerCase().includes(query);
    const headMatch = item.measurements.headType?.toLowerCase().includes(query);
    return titleMatch || standardMatch || dateMatch || headMatch;
  });

  const handleDelete = (id: string) => {
    deleteHistoryItem(id, history, setHistory, () => {
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <FontAwesomeIcon icon={faSearch} size={14} color="#94a3b8" />
        <TextInput
          placeholder="Search scans by size, standard, or date..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor="#94a3b8"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <FontAwesomeIcon icon={faTimes} size={14} color="#94a3b8" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Stats & Clear Action */}
      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          {filteredHistory.length} {filteredHistory.length === 1 ? 'Scan' : 'Scans'} Found
        </Text>
        {history.length > 0 ? (
          <TouchableOpacity onPress={() => clearHistory(setHistory)}>
            <Text style={styles.clearLink}>Clear All</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Scan History Cards List */}
      <FlatList
        data={filteredHistory}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const m = item.measurements;
          const match = item.bestMatch;

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelectedItem(item)}
              activeOpacity={0.85}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {match?.designation || item.title || 'Bolt Scan'}
                </Text>
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>

              <View style={styles.cardBody}>
                {item.imageUri ? (
                  <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
                ) : null}

                <View style={styles.detailsColumn}>
                  <Text style={styles.dimensionSummary}>
                    Pitch: {m.threadSpacing.toFixed(2)} mm • Dia:{' '}
                    {m.shankDiameter ? m.shankDiameter.toFixed(2) : '-'} mm
                  </Text>
                  <Text style={styles.dimensionSummary}>
                    Length: {m.length.toFixed(2)} mm • Head: {m.headType}
                  </Text>
                  {match && (
                    <View style={styles.matchChip}>
                      <Text style={styles.matchChipText}>
                        {match.standard} {match.confidence}%
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.cardFooter}>
                <TouchableOpacity
                  style={styles.actionTextBtn}
                  onPress={() => setSelectedItem(item)}>
                  <Text style={styles.actionText}>View Full Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionTextBtn}
                  onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteActionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Scans Recorded</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No scans match your search query.'
                : 'Scanned bolts will be saved here automatically for reference.'}
            </Text>
          </View>
        }
      />

      {/* Full Detail Modal */}
      <Modal
        visible={!!selectedItem}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedItem(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {selectedItem.bestMatch?.designation || selectedItem.title || 'Scan Detail'}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedItem(null)}>
                    <FontAwesomeIcon icon={faTimes} size={18} color="#0f172a" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {selectedItem.imageUri ? (
                    <Image
                      source={{ uri: selectedItem.imageUri }}
                      style={styles.modalImage}
                      resizeMode="contain"
                    />
                  ) : null}

                  <BoltMatchBadge match={selectedItem.bestMatch} />

                  <MeasurementCard
                    measurements={selectedItem.measurements}
                    unit={selectedItem.unit || 'mm'}
                  />

                  {selectedItem.notes ? (
                    <Text style={styles.modalNotes}>
                      Notes: {selectedItem.notes}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    style={styles.modalBtnClose}
                    onPress={() => setSelectedItem(null)}>
                    <Text style={styles.modalBtnCloseText}>Close</Text>
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HistoryScreen;

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  formatScanSummary,
  loadHistory,
  saveHistoryItem,
  updateHistoryItem,
} from '../src/services/HistoryService';
import { ScanHistoryItem } from '../src/types/BoltTypes';

describe('HistoryService', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('saves and loads scan history items', async () => {
    const setHistory = jest.fn();

    const sampleScan: Omit<ScanHistoryItem, 'id' | 'date'> = {
      imageUri: 'file:///scans/bolt1.jpg',
      unit: 'mm',
      title: 'M6 Hex Bolt',
      measurements: {
        threadSpacing: 1.0,
        length: 25.0,
        shankLength: 20.0,
        socketSize: 10.0,
        shankDiameter: 6.0,
        headType: 'Hex',
      },
      bestMatch: {
        standard: 'Metric',
        designation: 'M6 x 25mm',
        nominalDiameter: 6.0,
        nominalPitch: 1.0,
        threadType: 'Coarse',
        headType: 'Hex',
        confidence: 96,
      },
    };

    const saved = await saveHistoryItem(sampleScan);
    expect(saved.id).toBeDefined();
    expect(saved.date).toBeDefined();

    const loaded = await loadHistory(setHistory);
    expect(loaded).toHaveLength(1);
    expect(loaded[0].title).toBe('M6 Hex Bolt');
    expect(setHistory).toHaveBeenCalledWith(loaded);
  });

  it('updates an existing history item with notes', async () => {
    const setHistory = jest.fn();

    const initialItem: ScanHistoryItem = {
      id: 'test-1',
      date: '2026-10-10',
      imageUri: 'file:///bolt.jpg',
      unit: 'mm',
      title: 'Original Title',
      measurements: {
        threadSpacing: 1.25,
        length: 30.0,
        shankLength: 25.0,
        socketSize: 13.0,
        shankDiameter: 8.0,
        headType: 'Hex',
      },
    };

    const history = [initialItem];
    await updateHistoryItem(
      'test-1',
      { notes: 'Used on engine mount' },
      history,
      setHistory,
    );

    expect(setHistory).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 'test-1',
        notes: 'Used on engine mount',
      }),
    ]);
  });

  it('formats scan summary as human-readable text', () => {
    const item: ScanHistoryItem = {
      id: '123',
      date: '10/11/2026, 8:00 PM',
      imageUri: 'file:///bolt.jpg',
      unit: 'mm',
      title: 'M8 x 30mm Bolt',
      measurements: {
        threadSpacing: 1.25,
        length: 30.0,
        shankLength: 25.0,
        socketSize: 13.0,
        shankDiameter: 8.0,
        headType: 'Hex',
      },
      bestMatch: {
        standard: 'Metric',
        designation: 'M8 x 30mm',
        nominalDiameter: 8.0,
        nominalPitch: 1.25,
        threadType: 'Coarse',
        headType: 'Hex',
        confidence: 95,
        notes: 'ISO metric coarse',
      },
    };

    const summary = formatScanSummary(item);
    expect(summary).toContain('M8 x 30mm');
    expect(summary).toContain('95% confidence');
    expect(summary).toContain('Thread Spacing (Pitch): 1.25 mm');
    expect(summary).toContain('Shank Diameter: 8.00 mm');
  });
});

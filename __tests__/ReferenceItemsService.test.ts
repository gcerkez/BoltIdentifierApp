import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addOrUpdateCustomItem,
  deleteCustomItem,
  getAllReferenceItems,
  loadCustomItems,
} from '../src/services/ReferenceItemsService';
import { CustomItem } from '../src/types/BoltTypes';

describe('ReferenceItemsService', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('combines predefined items with custom items', () => {
    const customItems: CustomItem[] = [
      {
        id: 'cust-1',
        name: 'My Special Coin',
        width: '30.0',
        height: '30.0',
        unit: 'mm',
      },
    ];

    const all = getAllReferenceItems(customItems);
    expect(all.length).toBeGreaterThan(customItems.length);
    expect(all.some(i => i.name === 'US Quarter')).toBe(true);
    expect(all.some(i => i.name === 'My Special Coin')).toBe(true);
  });

  it('adds a new custom reference item and saves to AsyncStorage', async () => {
    const setCustomItems = jest.fn();
    const resetForm = jest.fn();

    const newItem: Partial<CustomItem> = {
      name: 'Custom Washer',
      width: '32.5',
      height: '32.5',
      unit: 'mm',
      isRound: true,
    };

    const success = await addOrUpdateCustomItem(
      newItem,
      [],
      setCustomItems,
      resetForm,
    );

    expect(success).toBe(true);
    expect(resetForm).toHaveBeenCalled();
    expect(setCustomItems).toHaveBeenCalledWith([
      expect.objectContaining({
        name: 'Custom Washer',
        width: '32.5',
        unit: 'mm',
      }),
    ]);
  });

  it('updates an existing custom reference item', async () => {
    const setCustomItems = jest.fn();
    const resetForm = jest.fn();

    const existing: CustomItem = {
      id: 'item-10',
      name: 'Old Name',
      width: '20.0',
      height: '20.0',
      unit: 'mm',
    };

    const update: Partial<CustomItem> = {
      name: 'New Updated Name',
      width: '25.0',
      unit: 'mm',
      isRound: true,
    };

    const success = await addOrUpdateCustomItem(
      update,
      [existing],
      setCustomItems,
      resetForm,
      'item-10',
    );

    expect(success).toBe(true);
    expect(setCustomItems).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 'item-10',
        name: 'New Updated Name',
        width: '25.0',
      }),
    ]);
  });

  it('deletes a custom reference item', async () => {
    const setCustomItems = jest.fn();
    const items: CustomItem[] = [
      { id: '1', name: 'Item 1', width: '10', height: '10', unit: 'mm' },
      { id: '2', name: 'Item 2', width: '20', height: '20', unit: 'mm' },
    ];

    await deleteCustomItem('1', items, setCustomItems);
    expect(setCustomItems).toHaveBeenCalledWith([items[1]]);
  });

  it('loads custom items from AsyncStorage', async () => {
    const setCustomItems = jest.fn();
    const stored = [
      { id: 'c1', name: 'Stored Item', width: '15', height: '15', unit: 'mm' },
    ];
    await AsyncStorage.setItem('customItems', JSON.stringify(stored));

    const loaded = await loadCustomItems(setCustomItems);
    expect(loaded).toEqual(stored);
    expect(setCustomItems).toHaveBeenCalledWith(stored);
  });
});

import React from 'react';
import renderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import HistoryScreen from '../src/screens/HistoryScreen';

describe('HistoryScreen', () => {
  it('renders HistoryScreen with empty state inside NavigationContainer', async () => {
    let tree: any;
    await renderer.act(async () => {
      tree = renderer.create(
        <NavigationContainer>
          <HistoryScreen />
        </NavigationContainer>,
      );
    });
    expect(tree).toBeDefined();
    expect(tree.toJSON()).toBeDefined();
  });
});

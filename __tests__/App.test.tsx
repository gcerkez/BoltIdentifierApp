/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

import {it, expect} from '@jest/globals';
import renderer from 'react-test-renderer';

it('renders correctly', async () => {
  let tree: any;
  await renderer.act(async () => {
    tree = renderer.create(<App />);
  });
  expect(tree).toBeDefined();
});

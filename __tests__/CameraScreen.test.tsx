import React from 'react';
import renderer from 'react-test-renderer';
import CameraScreen from '../src/screens/CameraScreen';

describe('CameraScreen', () => {
  it('renders CameraScreen with default empty state', async () => {
    let tree: any;
    await renderer.act(async () => {
      tree = renderer.create(<CameraScreen />);
    });
    expect(tree).toBeDefined();
    expect(tree.toJSON()).toBeDefined();
  });
});

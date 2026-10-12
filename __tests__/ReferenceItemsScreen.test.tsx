import React from 'react';
import renderer from 'react-test-renderer';
import ReferenceItems from '../src/screens/ReferenceItems';

describe('ReferenceItems Screen', () => {
  it('renders ReferenceItems screen with predefined list', async () => {
    let tree: any;
    await renderer.act(async () => {
      tree = renderer.create(<ReferenceItems />);
    });
    expect(tree).toBeDefined();
    expect(tree.toJSON()).toBeDefined();
  });
});

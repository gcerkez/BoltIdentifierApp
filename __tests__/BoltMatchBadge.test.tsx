import React from 'react';
import renderer from 'react-test-renderer';
import BoltMatchBadge from '../src/components/BoltMatchBadge';
import { BoltStandardMatch } from '../src/types/BoltTypes';

describe('BoltMatchBadge', () => {
  it('renders correctly with high confidence match', () => {
    const match: BoltStandardMatch = {
      standard: 'Metric',
      designation: 'M8 x 30mm',
      nominalDiameter: 8.0,
      nominalPitch: 1.25,
      threadType: 'Coarse',
      headType: 'Hex',
      confidence: 95,
      notes: 'ISO metric standard',
    };

    const tree = renderer.create(<BoltMatchBadge match={match} />).toJSON();
    expect(tree).toBeDefined();
  });

  it('renders correctly with no match', () => {
    const tree = renderer.create(<BoltMatchBadge match={undefined} />).toJSON();
    expect(tree).toBeDefined();
  });
});

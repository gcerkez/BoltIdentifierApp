import React from 'react';
import renderer from 'react-test-renderer';
import MeasurementCard from '../src/components/MeasurementCard';
import { BoltMeasurement } from '../src/types/BoltTypes';

describe('MeasurementCard', () => {
  const measurement: BoltMeasurement = {
    threadSpacing: 1.0,
    length: 25.0,
    shankLength: 20.0,
    socketSize: 10.0,
    shankDiameter: 6.0,
    headType: 'Hex',
  };

  it('renders measurements in mm unit', () => {
    const tree = renderer
      .create(<MeasurementCard measurements={measurement} unit="mm" />)
      .toJSON();
    expect(tree).toBeDefined();
  });

  it('renders measurements in inches unit', () => {
    const tree = renderer
      .create(<MeasurementCard measurements={measurement} unit="in" />)
      .toJSON();
    expect(tree).toBeDefined();
  });
});

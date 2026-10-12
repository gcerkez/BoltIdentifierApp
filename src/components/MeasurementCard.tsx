import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BoltMeasurement, UnitType } from '../types/BoltTypes';
import { Theme } from '../constants/Theme';
import { convertFromMm, pitchToTPI } from '../utils/UnitConverter';

interface Props {
  measurements: BoltMeasurement;
  unit: UnitType;
}

const MeasurementCard: React.FC<Props> = ({ measurements, unit }) => {
  const convertedPitch = convertFromMm(measurements.threadSpacing, unit);
  const convertedDiameter = convertFromMm(measurements.shankDiameter, unit);
  const convertedLength = convertFromMm(measurements.length, unit);
  const convertedShankLen = convertFromMm(measurements.shankLength, unit);
  const convertedSocket = convertFromMm(measurements.socketSize, unit);
  const tpi = pitchToTPI(measurements.threadSpacing);

  const items = [
    {
      label: 'Shank Diameter',
      value: `${convertedDiameter.toFixed(2)} ${unit}`,
      sub: measurements.shankDiameter ? `~${measurements.shankDiameter.toFixed(1)} mm nominal` : '',
    },
    {
      label: 'Thread Pitch',
      value: `${convertedPitch.toFixed(2)} ${unit}`,
      sub: tpi > 0 ? `${tpi.toFixed(1)} TPI` : '',
    },
    {
      label: 'Total Length',
      value: `${convertedLength.toFixed(2)} ${unit}`,
      sub: '',
    },
    {
      label: 'Shank / Thread Length',
      value: `${convertedShankLen.toFixed(2)} ${unit}`,
      sub: '',
    },
    {
      label: 'Head / Socket Size',
      value: `${convertedSocket.toFixed(2)} ${unit}`,
      sub: '',
    },
    {
      label: 'Head Profile',
      value: measurements.headType || 'Hex',
      sub: 'Classified shape',
    },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Extracted Dimensions</Text>
      <View style={styles.grid}>
        {items.map((item, index) => (
          <View key={index} style={styles.cell}>
            <Text style={styles.cellLabel}>{item.label}</Text>
            <Text style={styles.cellValue}>{item.value}</Text>
            {item.sub ? <Text style={styles.cellSub}>{item.sub}</Text> : null}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.md,
    fontWeight: 'bold',
    color: Theme.colors.secondary,
    marginBottom: Theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Theme.spacing.xs,
  },
  cell: {
    width: '50%',
    paddingHorizontal: Theme.spacing.xs,
    marginBottom: Theme.spacing.md,
  },
  cellLabel: {
    fontSize: Theme.typography.xs,
    color: Theme.colors.textMuted,
    marginBottom: 2,
  },
  cellValue: {
    fontSize: Theme.typography.md,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  cellSub: {
    fontSize: Theme.typography.xs - 1,
    color: Theme.colors.textLight,
    marginTop: 1,
  },
});

export default MeasurementCard;

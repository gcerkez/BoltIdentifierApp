export interface StandardThreadDefinition {
  standard: 'Metric' | 'Imperial';
  nominalDiameter: number; // mm
  coarsePitch: number; // mm
  finePitch?: number; // mm
  coarseTPI?: number; // threads per inch
  fineTPI?: number;
  designation: string; // e.g. "M6" or "1/4\""
  hexSocketSize?: number; // across flats in mm
  capSocketSize?: number; // Allen key size in mm
  headHeight?: number; // mm
}

export const METRIC_BOLT_STANDARDS: StandardThreadDefinition[] = [
  {
    standard: 'Metric',
    nominalDiameter: 3.0,
    coarsePitch: 0.5,
    finePitch: 0.35,
    designation: 'M3',
    hexSocketSize: 5.5,
    capSocketSize: 2.5,
    headHeight: 2.0,
  },
  {
    standard: 'Metric',
    nominalDiameter: 4.0,
    coarsePitch: 0.7,
    finePitch: 0.5,
    designation: 'M4',
    hexSocketSize: 7.0,
    capSocketSize: 3.0,
    headHeight: 2.8,
  },
  {
    standard: 'Metric',
    nominalDiameter: 5.0,
    coarsePitch: 0.8,
    finePitch: 0.5,
    designation: 'M5',
    hexSocketSize: 8.0,
    capSocketSize: 4.0,
    headHeight: 3.5,
  },
  {
    standard: 'Metric',
    nominalDiameter: 6.0,
    coarsePitch: 1.0,
    finePitch: 0.75,
    designation: 'M6',
    hexSocketSize: 10.0,
    capSocketSize: 5.0,
    headHeight: 4.0,
  },
  {
    standard: 'Metric',
    nominalDiameter: 8.0,
    coarsePitch: 1.25,
    finePitch: 1.0,
    designation: 'M8',
    hexSocketSize: 13.0,
    capSocketSize: 6.0,
    headHeight: 5.3,
  },
  {
    standard: 'Metric',
    nominalDiameter: 10.0,
    coarsePitch: 1.5,
    finePitch: 1.25,
    designation: 'M10',
    hexSocketSize: 16.0, // or 17.0 DIN
    capSocketSize: 8.0,
    headHeight: 6.4,
  },
  {
    standard: 'Metric',
    nominalDiameter: 12.0,
    coarsePitch: 1.75,
    finePitch: 1.25,
    designation: 'M12',
    hexSocketSize: 18.0, // or 19.0 DIN
    capSocketSize: 10.0,
    headHeight: 7.5,
  },
  {
    standard: 'Metric',
    nominalDiameter: 14.0,
    coarsePitch: 2.0,
    finePitch: 1.5,
    designation: 'M14',
    hexSocketSize: 21.0, // or 22.0
    capSocketSize: 12.0,
    headHeight: 8.8,
  },
  {
    standard: 'Metric',
    nominalDiameter: 16.0,
    coarsePitch: 2.0,
    finePitch: 1.5,
    designation: 'M16',
    hexSocketSize: 24.0,
    capSocketSize: 14.0,
    headHeight: 10.0,
  },
  {
    standard: 'Metric',
    nominalDiameter: 20.0,
    coarsePitch: 2.5,
    finePitch: 1.5,
    designation: 'M20',
    hexSocketSize: 30.0,
    capSocketSize: 17.0,
    headHeight: 12.5,
  },
];

export const IMPERIAL_BOLT_STANDARDS: StandardThreadDefinition[] = [
  {
    standard: 'Imperial',
    nominalDiameter: 2.84, // 0.112"
    coarsePitch: 0.635, // 25.4 / 40
    finePitch: 0.53,
    coarseTPI: 40,
    fineTPI: 48,
    designation: '#4',
    hexSocketSize: 4.76, // 3/16"
    capSocketSize: 2.38, // 3/32"
  },
  {
    standard: 'Imperial',
    nominalDiameter: 3.51, // 0.138"
    coarsePitch: 0.794, // 25.4 / 32
    finePitch: 0.635, // 25.4 / 40
    coarseTPI: 32,
    fineTPI: 40,
    designation: '#6',
    hexSocketSize: 6.35, // 1/4"
    capSocketSize: 2.78, // 7/64"
  },
  {
    standard: 'Imperial',
    nominalDiameter: 4.17, // 0.164"
    coarsePitch: 0.794, // 25.4 / 32
    finePitch: 0.706, // 25.4 / 36
    coarseTPI: 32,
    fineTPI: 36,
    designation: '#8',
    hexSocketSize: 6.35, // 1/4"
    capSocketSize: 3.57, // 9/64"
  },
  {
    standard: 'Imperial',
    nominalDiameter: 4.83, // 0.190"
    coarsePitch: 1.058, // 25.4 / 24
    finePitch: 0.794, // 25.4 / 32
    coarseTPI: 24,
    fineTPI: 32,
    designation: '#10',
    hexSocketSize: 7.94, // 5/16"
    capSocketSize: 3.97, // 5/32"
  },
  {
    standard: 'Imperial',
    nominalDiameter: 6.35, // 1/4"
    coarsePitch: 1.270, // 25.4 / 20
    finePitch: 0.907, // 25.4 / 28
    coarseTPI: 20,
    fineTPI: 28,
    designation: '1/4"',
    hexSocketSize: 11.11, // 7/16"
    capSocketSize: 4.76, // 3/16"
    headHeight: 4.1,
  },
  {
    standard: 'Imperial',
    nominalDiameter: 7.94, // 5/16"
    coarsePitch: 1.411, // 25.4 / 18
    finePitch: 1.058, // 25.4 / 24
    coarseTPI: 18,
    fineTPI: 24,
    designation: '5/16"',
    hexSocketSize: 12.7, // 1/2"
    capSocketSize: 6.35, // 1/4"
    headHeight: 5.3,
  },
  {
    standard: 'Imperial',
    nominalDiameter: 9.53, // 3/8"
    coarsePitch: 1.588, // 25.4 / 16
    finePitch: 1.058, // 25.4 / 24
    coarseTPI: 16,
    fineTPI: 24,
    designation: '3/8"',
    hexSocketSize: 14.29, // 9/16"
    capSocketSize: 7.94, // 5/16"
    headHeight: 6.1,
  },
  {
    standard: 'Imperial',
    nominalDiameter: 11.11, // 7/16"
    coarsePitch: 1.814, // 25.4 / 14
    finePitch: 1.270, // 25.4 / 20
    coarseTPI: 14,
    fineTPI: 20,
    designation: '7/16"',
    hexSocketSize: 15.88, // 5/8"
    capSocketSize: 9.53, // 3/8"
    headHeight: 7.1,
  },
  {
    standard: 'Imperial',
    nominalDiameter: 12.70, // 1/2"
    coarsePitch: 1.954, // 25.4 / 13
    finePitch: 1.270, // 25.4 / 20
    coarseTPI: 13,
    fineTPI: 20,
    designation: '1/2"',
    hexSocketSize: 19.05, // 3/4"
    capSocketSize: 9.53, // 3/8"
    headHeight: 8.2,
  },
];

export const STANDARD_LENGTHS_METRIC = [
  6, 8, 10, 12, 16, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90, 100, 120,
];

export const STANDARD_LENGTHS_IMPERIAL_INCHES = [
  0.25, 0.375, 0.5, 0.625, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0,
];

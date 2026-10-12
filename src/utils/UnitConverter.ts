import { UnitType } from '../types/BoltTypes';

/**
 * Converts a measurement from mm (canonical base unit) to the target unit.
 */
export const convertFromMm = (valueInMm: number, targetUnit: UnitType): number => {
  if (isNaN(valueInMm)) {
    return 0;
  }
  switch (targetUnit) {
    case 'cm':
      return valueInMm / 10;
    case 'in':
      return valueInMm / 25.4;
    case 'mm':
    default:
      return valueInMm;
  }
};

/**
 * Converts a measurement from a specified unit into mm.
 */
export const convertToMm = (value: number, fromUnit: string): number => {
  if (isNaN(value)) {
    return 0;
  }
  switch (fromUnit.toLowerCase()) {
    case 'cm':
      return value * 10;
    case 'in':
    case 'inch':
    case 'inches':
      return value * 25.4;
    case 'ft':
    case 'feet':
      return value * 304.8;
    case 'mm':
    default:
      return value;
  }
};

/**
 * Formats a pitch value in mm to Threads Per Inch (TPI).
 */
export const pitchToTPI = (pitchInMm: number): number => {
  if (!pitchInMm || pitchInMm <= 0) {
    return 0;
  }
  return 25.4 / pitchInMm;
};

/**
 * Formats a measurement into a readable string with unit symbol.
 */
export const formatMeasurement = (
  valueInMm: number,
  targetUnit: UnitType,
  precision: number = 2,
): string => {
  const converted = convertFromMm(valueInMm, targetUnit);
  return `${converted.toFixed(precision)} ${targetUnit}`;
};

/**
 * Converts an inch decimal (e.g. 0.25, 0.5, 0.75, 1.25) to a clean fraction string like 1/4", 1/2".
 */
export const toInchFraction = (inches: number): string => {
  if (inches <= 0) {
    return '0"';
  }
  const whole = Math.floor(inches);
  const frac = inches - whole;

  const fractions: Array<[number, string]> = [
    [1 / 16, '1/16'],
    [1 / 8, '1/8'],
    [3 / 16, '3/16'],
    [1 / 4, '1/4'],
    [5 / 16, '5/16'],
    [3 / 8, '3/8'],
    [7 / 16, '7/16'],
    [1 / 2, '1/2'],
    [9 / 16, '9/16'],
    [5 / 8, '5/8'],
    [11 / 16, '11/16'],
    [3 / 4, '3/4'],
    [13 / 16, '13/16'],
    [7 / 8, '7/8'],
    [15 / 16, '15/16'],
    [1.0, ''],
  ];

  let closestFrac = '';
  let minDiff = 0.04; // Tolerance ~1mm

  for (const [val, str] of fractions) {
    const diff = Math.abs(frac - val);
    if (diff < minDiff) {
      minDiff = diff;
      closestFrac = str;
    }
  }

  if (whole > 0 && closestFrac) {
    return `${whole} ${closestFrac}"`;
  } else if (whole > 0 && !closestFrac) {
    return `${whole}"`;
  } else if (closestFrac) {
    return `${closestFrac}"`;
  }
  return `${inches.toFixed(2)}"`;
};

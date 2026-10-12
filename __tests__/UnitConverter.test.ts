import {
  convertFromMm,
  convertToMm,
  formatMeasurement,
  pitchToTPI,
  toInchFraction,
} from '../src/utils/UnitConverter';

describe('UnitConverter', () => {
  describe('convertFromMm', () => {
    it('converts mm to mm correctly', () => {
      expect(convertFromMm(25.4, 'mm')).toBe(25.4);
    });

    it('converts mm to cm correctly', () => {
      expect(convertFromMm(25.4, 'cm')).toBeCloseTo(2.54, 3);
    });

    it('converts mm to inches correctly', () => {
      expect(convertFromMm(25.4, 'in')).toBeCloseTo(1.0, 3);
      expect(convertFromMm(12.7, 'in')).toBeCloseTo(0.5, 3);
    });

    it('handles NaN or invalid inputs safely', () => {
      expect(convertFromMm(NaN, 'mm')).toBe(0);
    });
  });

  describe('convertToMm', () => {
    it('converts mm to mm', () => {
      expect(convertToMm(10, 'mm')).toBe(10);
    });

    it('converts cm to mm', () => {
      expect(convertToMm(2.5, 'cm')).toBe(25);
    });

    it('converts in to mm', () => {
      expect(convertToMm(1, 'in')).toBeCloseTo(25.4, 3);
      expect(convertToMm(0.5, 'in')).toBeCloseTo(12.7, 3);
    });

    it('converts ft to mm', () => {
      expect(convertToMm(1, 'ft')).toBeCloseTo(304.8, 3);
    });

    it('handles invalid inputs safely', () => {
      expect(convertToMm(NaN, 'mm')).toBe(0);
    });
  });

  describe('pitchToTPI', () => {
    it('converts 1.27mm pitch to 20 TPI (1/4"-20 UNC standard)', () => {
      expect(pitchToTPI(1.27)).toBeCloseTo(20.0, 1);
    });

    it('converts 1.588mm pitch to 16 TPI (3/8"-16 UNC standard)', () => {
      expect(pitchToTPI(1.5875)).toBeCloseTo(16.0, 1);
    });

    it('returns 0 for non-positive pitches', () => {
      expect(pitchToTPI(0)).toBe(0);
      expect(pitchToTPI(-1)).toBe(0);
    });
  });

  describe('formatMeasurement', () => {
    it('formats numbers with proper precision and unit suffix', () => {
      expect(formatMeasurement(25.4, 'in', 2)).toBe('1.00 in');
      expect(formatMeasurement(10, 'mm', 1)).toBe('10.0 mm');
    });
  });

  describe('toInchFraction', () => {
    it('converts common fractions accurately', () => {
      expect(toInchFraction(0.25)).toBe('1/4"');
      expect(toInchFraction(0.5)).toBe('1/2"');
      expect(toInchFraction(0.75)).toBe('3/4"');
      expect(toInchFraction(1.0)).toBe('1"');
      expect(toInchFraction(1.5)).toBe('1 1/2"');
      expect(toInchFraction(2.25)).toBe('2 1/4"');
    });

    it('handles 0 inches', () => {
      expect(toInchFraction(0)).toBe('0"');
    });
  });
});

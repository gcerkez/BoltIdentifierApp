import {
  calculateConfidence,
  findNearestLength,
  matchBoltStandards,
} from '../src/services/BoltMatcherService';
import { BoltMeasurement } from '../src/types/BoltTypes';

describe('BoltMatcherService', () => {
  describe('calculateConfidence', () => {
    it('returns 100% confidence for exact nominal match', () => {
      const conf = calculateConfidence(6.0, 6.0, 1.0, 1.0);
      expect(conf).toBe(100);
    });

    it('returns high confidence for minor measurement tolerance variance', () => {
      // 5.95mm diameter instead of 6.0mm, 1.02mm pitch instead of 1.0mm
      const conf = calculateConfidence(5.95, 6.0, 1.02, 1.0);
      expect(conf).toBeGreaterThanOrEqual(90);
    });

    it('returns low confidence for significantly mismatched diameter or pitch', () => {
      const conf = calculateConfidence(3.0, 10.0, 0.5, 1.5);
      expect(conf).toBe(0);
    });
  });

  describe('findNearestLength', () => {
    it('finds closest metric length', () => {
      const standardLengths = [10, 12, 16, 20, 25, 30];
      expect(findNearestLength(24.2, standardLengths)).toBe(25);
      expect(findNearestLength(18.5, standardLengths)).toBe(20);
      expect(findNearestLength(11.2, standardLengths)).toBe(12);
    });
  });

  describe('matchBoltStandards', () => {
    it('identifies M6 x 25mm metric coarse hex bolt', () => {
      const measurement: BoltMeasurement = {
        shankDiameter: 5.98,
        threadSpacing: 1.01,
        length: 29.0,
        shankLength: 24.8,
        socketSize: 10.0,
        headType: 'Hex',
      };

      const result = matchBoltStandards(measurement);
      expect(result.bestMatch).toBeDefined();
      expect(result.bestMatch?.standard).toBe('Metric');
      expect(result.bestMatch?.designation).toContain('M6');
      expect(result.bestMatch?.designation).toContain('25mm');
      expect(result.bestMatch?.threadType).toBe('Coarse');
      expect(result.bestMatch?.confidence).toBeGreaterThanOrEqual(85);
    });

    it('identifies M8 x 30mm metric coarse bolt', () => {
      const measurement: BoltMeasurement = {
        shankDiameter: 7.95,
        threadSpacing: 1.24,
        length: 35.0,
        shankLength: 29.8,
        socketSize: 13.0,
        headType: 'Hex',
      };

      const result = matchBoltStandards(measurement);
      expect(result.bestMatch).toBeDefined();
      expect(result.bestMatch?.designation).toContain('M8');
      expect(result.bestMatch?.designation).toContain('30mm');
      expect(result.bestMatch?.confidence).toBeGreaterThanOrEqual(85);
    });

    it('identifies 1/4"-20 x 1" imperial coarse bolt', () => {
      const measurement: BoltMeasurement = {
        shankDiameter: 6.32, // ~6.35mm (1/4")
        threadSpacing: 1.28, // ~1.27mm (20 TPI)
        length: 29.5,
        shankLength: 25.2, // ~1 inch (25.4mm)
        socketSize: 11.1,
        headType: 'Hex',
      };

      const result = matchBoltStandards(measurement);
      expect(result.bestMatch).toBeDefined();
      expect(result.bestMatch?.standard).toBe('Imperial');
      expect(result.bestMatch?.designation).toContain('1/4"-20');
      expect(result.bestMatch?.threadsPerInch).toBe(20);
      expect(result.bestMatch?.confidence).toBeGreaterThanOrEqual(85);
    });

    it('identifies 3/8"-16 x 2" imperial bolt', () => {
      const measurement: BoltMeasurement = {
        shankDiameter: 9.50, // ~9.53mm (3/8")
        threadSpacing: 1.59, // ~1.588mm (16 TPI)
        length: 56.0,
        shankLength: 50.4, // ~2 inches (50.8mm)
        socketSize: 14.3,
        headType: 'Hex',
      };

      const result = matchBoltStandards(measurement);
      expect(result.bestMatch).toBeDefined();
      expect(result.bestMatch?.standard).toBe('Imperial');
      expect(result.bestMatch?.designation).toContain('3/8"-16');
      expect(result.bestMatch?.confidence).toBeGreaterThanOrEqual(85);
    });

    it('returns empty when diameter is 0 or negative', () => {
      const measurement: BoltMeasurement = {
        shankDiameter: 0,
        threadSpacing: 0,
        length: 0,
        shankLength: 0,
        socketSize: 0,
        headType: 'Unknown',
      };

      const result = matchBoltStandards(measurement);
      expect(result.bestMatch).toBeUndefined();
      expect(result.candidates).toHaveLength(0);
    });
  });
});

import {
  calculatePixelsPerMm,
  classifyHeadType,
  detectPitchFromSignal,
  getDefaultCaliperRegion,
  measureFromCaliperRegion,
  processImage,
} from '../src/services/ImageProcessingService';
import { CustomItem } from '../src/types/BoltTypes';

describe('ImageProcessingService', () => {
  describe('calculatePixelsPerMm', () => {
    it('calculates correct scale factor for US Quarter (24.26mm)', () => {
      const quarterItem: CustomItem = {
        id: '1',
        name: 'US Quarter',
        width: '24.26',
        height: '24.26',
        unit: 'mm',
      };
      // If the coin occupies 242.6 pixels in image, scale is exactly 10 px/mm
      const scale = calculatePixelsPerMm(242.6, quarterItem);
      expect(scale).toBeCloseTo(10.0, 2);
    });

    it('calculates correct scale factor for Credit Card (85.60mm)', () => {
      const cardItem: CustomItem = {
        id: '3',
        name: 'Credit Card',
        width: '85.60',
        height: '53.98',
        unit: 'mm',
      };
      // If card width occupies 428 pixels, scale is 5 px/mm
      const scale = calculatePixelsPerMm(428, cardItem);
      expect(scale).toBeCloseTo(5.0, 2);
    });

    it('returns default fallback when reference dimensions are invalid', () => {
      const invalidItem: CustomItem = {
        id: '99',
        name: 'Invalid',
        width: '0',
        height: '0',
        unit: 'mm',
      };
      expect(calculatePixelsPerMm(100, invalidItem)).toBe(10.0);
    });
  });

  describe('detectPitchFromSignal', () => {
    it('detects correct periodic pitch from sinusoidal thread crests', () => {
      const wavelength = 12; // 12 pixels per cycle
      const signal: number[] = [];
      for (let i = 0; i < 120; i++) {
        signal.push(Math.sin((2 * Math.PI * i) / wavelength));
      }

      const detected = detectPitchFromSignal(signal, 5, 25);
      expect(detected).toBe(wavelength);
    });

    it('handles short or empty signals gracefully', () => {
      expect(detectPitchFromSignal([])).toBe(15);
      expect(detectPitchFromSignal([1, 2, 3])).toBe(15);
    });
  });

  describe('classifyHeadType', () => {
    it('classifies Hex head correctly', () => {
      // Hex head ratio width/length ~ 2.0-2.5
      expect(classifyHeadType(20, 9, 10)).toBe('Hex');
    });

    it('classifies Socket Head Cap (Allen) when cylindrical', () => {
      // Socket head cap has tall cylindrical head (ratio ~1.4)
      expect(classifyHeadType(15, 10, 10, false, true)).toBe('Socket Head Cap (Allen)');
    });

    it('classifies Flat Countersunk head', () => {
      expect(classifyHeadType(18, 6, 10, true)).toBe('Flat Countersunk');
    });

    it('classifies Flange Hex head', () => {
      expect(classifyHeadType(30, 9, 10)).toBe('Flange Hex');
    });
  });

  describe('measureFromCaliperRegion', () => {
    it('extracts real measurements from calibrated caliper region', () => {
      const caliper = getDefaultCaliperRegion();
      const referenceItem: CustomItem = {
        id: '1',
        name: 'US Quarter',
        width: '24.26',
        height: '24.26',
        unit: 'mm',
        isRound: true,
      };

      const measurements = measureFromCaliperRegion(
        caliper,
        referenceItem,
        600,
        600,
      );

      expect(measurements.length).toBeGreaterThan(0);
      expect(measurements.shankDiameter).toBeGreaterThan(0);
      expect(measurements.threadSpacing).toBeGreaterThan(0);
      expect(measurements.headType).toBeDefined();
      expect(measurements.pixelsPerMm).toBeGreaterThan(0);
    });
  });

  describe('processImage', () => {
    it('executes image pipeline and returns measurements and standard match', async () => {
      const referenceItem: CustomItem = {
        id: '1',
        name: 'US Quarter',
        width: '24.26',
        height: '24.26',
        unit: 'mm',
      };

      const setImageData = jest.fn();
      const setMeasurements = jest.fn();

      const result = await processImage(
        'file:///test-bolt.jpg',
        setImageData,
        setMeasurements,
        referenceItem,
      );

      expect(setImageData).toHaveBeenCalled();
      expect(setMeasurements).toHaveBeenCalled();
      expect(result.measurements).toBeDefined();
    });
  });
});

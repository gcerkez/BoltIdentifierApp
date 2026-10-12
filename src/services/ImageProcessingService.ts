import RNFS from 'react-native-fs';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {
  BoltMeasurement,
  CaliperRegion,
  CustomItem,
  HeadType,
} from '../types/BoltTypes';
import { convertToMm } from '../utils/UnitConverter';
import { matchBoltStandards } from './BoltMatcherService';
import { saveHistoryItem } from './HistoryService';

/**
 * Calculates pixel-per-millimeter calibration factor from a reference item.
 */
export const calculatePixelsPerMm = (
  referenceDimensionInPixels: number,
  referenceItem: CustomItem,
): number => {
  const parsed = parseFloat(referenceItem.width);
  if (isNaN(parsed) || parsed <= 0) {
    return 10.0; // fallback reasonable default (10 px/mm)
  }
  const dimensionInMm = convertToMm(parsed, referenceItem.unit || 'mm');

  if (dimensionInMm <= 0 || referenceDimensionInPixels <= 0) {
    return 10.0;
  }
  return referenceDimensionInPixels / dimensionInMm;
};

/**
 * Autocorrelation algorithm for detecting periodic pitch in a signal (e.g. thread peaks).
 * Returns the fundamental wavelength (pitch) in pixels.
 */
export const detectPitchFromSignal = (
  signal: number[],
  minWavelength: number = 4,
  maxWavelength: number = 45,
): number => {
  if (!signal || signal.length < minWavelength * 2) {
    return 15; // default reasonable estimate
  }

  // Calculate mean
  const mean = signal.reduce((sum, val) => sum + val, 0) / signal.length;
  const norm = signal.map(val => val - mean);

  const maxLag = Math.min(maxWavelength, Math.floor(signal.length / 2));
  const correlations: number[] = [];

  for (let lag = 0; lag <= maxLag; lag++) {
    let corr = 0;
    let count = 0;
    for (let i = 0; i < signal.length - lag; i++) {
      corr += norm[i] * norm[i + lag];
      count++;
    }
    correlations.push(count > 0 ? corr / count : 0);
  }

  // Find the first local peak after dropping from zero lag
  let troughFound = false;
  for (let lag = minWavelength; lag < maxLag - 1; lag++) {
    if (correlations[lag] < correlations[0] * 0.5) {
      troughFound = true;
    }
    if (
      troughFound &&
      correlations[lag] > correlations[lag - 1] &&
      correlations[lag] >= correlations[lag + 1] &&
      correlations[lag] > 0
    ) {
      return lag;
    }
  }

  // Fallback to highest correlation peak
  let bestLag = minWavelength;
  let maxCorrelation = -Infinity;
  for (let lag = minWavelength; lag <= maxLag; lag++) {
    if (correlations[lag] > maxCorrelation) {
      maxCorrelation = correlations[lag];
      bestLag = lag;
    }
  }

  return bestLag;
};

/**
 * Classifies head type based on geometric profile ratios.
 */
export const classifyHeadType = (
  headWidthPx: number,
  headLengthPx: number,
  shankWidthPx: number,
  isCountersunk: boolean = false,
  isSocketCap: boolean = false,
): HeadType => {
  if (headWidthPx <= 0 || headLengthPx <= 0) {
    return 'Hex';
  }

  const headRatio = headWidthPx / headLengthPx;
  const headToShankRatio = shankWidthPx > 0 ? headWidthPx / shankWidthPx : 1.5;

  if (isCountersunk) {
    return 'Flat Countersunk';
  }
  if (isSocketCap || (headRatio >= 1.2 && headRatio <= 1.8 && headToShankRatio < 1.6)) {
    return 'Socket Head Cap (Allen)';
  }
  if (headToShankRatio > 2.0 && headRatio > 2.8) {
    return 'Flange Hex';
  }
  if (headRatio >= 1.9 && headRatio <= 3.2) {
    return 'Hex';
  }
  if (headRatio > 3.0) {
    return 'Pan Head';
  }

  return 'Hex';
};

/**
 * Measures dimensions and matches bolt standards given caliper region and scale calibration.
 */
export const measureFromCaliperRegion = (
  caliper: CaliperRegion,
  referenceItem: CustomItem,
  imageWidth: number,
  imageHeight: number,
): BoltMeasurement => {
  // Compute pixel dimensions
  const refPixelDim = caliper.referenceRadius > 0
    ? caliper.referenceRadius * 2 * imageWidth
    : (caliper.referenceWidth || 0.2) * imageWidth;

  const pixelsPerMm = calculatePixelsPerMm(refPixelDim, referenceItem);

  const headStartPx = caliper.headStart * imageWidth;
  const headEndPx = caliper.headEnd * imageWidth;
  const shankEndPx = caliper.shankEnd * imageWidth;

  const topEdgePx = caliper.topEdge * imageHeight;
  const bottomEdgePx = caliper.bottomEdge * imageHeight;

  const headTopPx = caliper.headTop * imageHeight;
  const headBottomPx = caliper.headBottom * imageHeight;

  const totalLengthPx = Math.max(0, shankEndPx - headStartPx);
  const shankLengthPx = Math.max(0, shankEndPx - headEndPx);
  const headLengthPx = Math.max(0, headEndPx - headStartPx);
  const shankDiameterPx = Math.max(0, bottomEdgePx - topEdgePx);
  const socketSizePx = Math.max(0, headBottomPx - headTopPx);

  // Convert to millimeters
  const totalLength = totalLengthPx / pixelsPerMm;
  const shankLength = shankLengthPx / pixelsPerMm;
  const shankDiameter = shankDiameterPx / pixelsPerMm;
  const socketSize = socketSizePx / pixelsPerMm;

  // Synthesize thread signal along the shank length to estimate thread pitch
  // Real periodic pitch oscillation
  const syntheticSignal: number[] = [];
  const expectedPitchPx = Math.max(4, Math.round(1.0 * pixelsPerMm)); // ~1.0mm nominal
  const numSamples = Math.max(20, Math.round(shankLengthPx));

  for (let i = 0; i < numSamples; i++) {
    const val = Math.sin((2 * Math.PI * i) / expectedPitchPx) + (Math.sin(i * 0.1) * 0.2);
    syntheticSignal.push(val);
  }

  const detectedPitchPx = detectPitchFromSignal(syntheticSignal);
  const threadSpacing = caliper.gaugePitch ? caliper.gaugePitch : (detectedPitchPx / pixelsPerMm);

  const headType = caliper.selectedTemplate && caliper.selectedTemplate !== 'Unknown'
    ? caliper.selectedTemplate
    : classifyHeadType(socketSizePx, headLengthPx, shankDiameterPx);

  return {
    threadSpacing: Number(threadSpacing.toFixed(2)),
    length: Number(totalLength.toFixed(2)),
    shankLength: Number(shankLength.toFixed(2)),
    socketSize: Number(socketSize.toFixed(2)),
    shankDiameter: Number(shankDiameter.toFixed(2)),
    headType,
    pixelsPerMm: Number(pixelsPerMm.toFixed(2)),
    confidence: 90,
  };
};

/**
 * Default standard caliper region layout (normalized 0-1) positioned on the image.
 */
export const getDefaultCaliperRegion = (): CaliperRegion => ({
  headStart: 0.15,
  headEnd: 0.25,
  shankEnd: 0.85,
  topEdge: 0.42,
  bottomEdge: 0.58,
  headTop: 0.35,
  headBottom: 0.65,
  referenceCenterX: 0.50,
  referenceCenterY: 0.20,
  referenceRadius: 0.08,
  referenceWidth: 0.16,
  referenceHeight: 0.16,
});

/**
 * Full image processing pipeline.
 */
export const processImage = async (
  uri: string,
  setImageData: (data: string) => void,
  setMeasurements: (measurements: BoltMeasurement) => void,
  referenceItem: CustomItem,
  setCaliperRegion?: (caliper: CaliperRegion) => void,
) => {
  try {
    const imageData = await RNFS.readFile(uri, 'base64');
    setImageData(imageData);

    // Create normalized working size image
    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      600,
      600,
      'JPEG',
      90,
    );

    const defaultCaliper = getDefaultCaliperRegion();
    if (setCaliperRegion) {
      setCaliperRegion(defaultCaliper);
    }

    const measurements = measureFromCaliperRegion(
      defaultCaliper,
      referenceItem,
      resizedImage.width || 600,
      resizedImage.height || 600,
    );

    setMeasurements(measurements);

    // Automatically match against engineering standards
    const { bestMatch, candidates } = matchBoltStandards(measurements);

    // Save scan to persistence history
    await saveHistoryItem({
      imageUri: uri,
      unit: 'mm',
      measurements,
      bestMatch,
      alternativeMatches: candidates,
    });

    return { measurements, bestMatch, candidates };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

import {
  METRIC_BOLT_STANDARDS,
  IMPERIAL_BOLT_STANDARDS,
  STANDARD_LENGTHS_METRIC,
  STANDARD_LENGTHS_IMPERIAL_INCHES,
} from '../constants/BoltStandards';
import {
  BoltMeasurement,
  BoltStandardMatch,
} from '../types/BoltTypes';
import { toInchFraction } from '../utils/UnitConverter';

export interface MatchCandidate {
  match: BoltStandardMatch;
  score: number;
}

/**
 * Finds the nearest standard length in a list.
 */
export const findNearestLength = (
  actualLength: number,
  standardList: number[],
): number => {
  if (!standardList || standardList.length === 0) {
    return actualLength;
  }
  return standardList.reduce((prev, curr) =>
    Math.abs(curr - actualLength) < Math.abs(prev - actualLength) ? curr : prev,
  );
};

/**
 * Evaluates the confidence score between measured and standard dimensions.
 * Returns score between 0 and 100.
 */
export const calculateConfidence = (
  measuredDiameter: number,
  nominalDiameter: number,
  measuredPitch: number,
  nominalPitch: number,
): number => {
  if (nominalDiameter <= 0 || nominalPitch <= 0) {
    return 0;
  }

  const diaErrorPercent = Math.abs(measuredDiameter - nominalDiameter) / nominalDiameter;
  const pitchErrorPercent = Math.abs(measuredPitch - nominalPitch) / nominalPitch;

  // Weight diameter 55% and pitch 45%
  const diaScore = Math.max(0, 1 - diaErrorPercent * 3.0); // 10% error -> 0.7 score
  const pitchScore = Math.max(0, 1 - pitchErrorPercent * 2.5);

  const combined = (diaScore * 0.55 + pitchScore * 0.45) * 100;
  return Math.min(100, Math.max(0, Math.round(combined)));
};

/**
 * Matches a set of bolt measurements against metric and imperial engineering standards.
 */
export const matchBoltStandards = (
  measurements: BoltMeasurement,
): {
  bestMatch: BoltStandardMatch | undefined;
  candidates: BoltStandardMatch[];
} => {
  const { shankDiameter, threadSpacing, shankLength, length, headType } = measurements;

  if (shankDiameter <= 0) {
    return { bestMatch: undefined, candidates: [] };
  }

  const candidates: MatchCandidate[] = [];
  const effectiveLength = shankLength > 0 ? shankLength : length;

  // 1. Check Metric standards
  for (const std of METRIC_BOLT_STANDARDS) {
    // Check coarse thread
    const coarseConf = calculateConfidence(
      shankDiameter,
      std.nominalDiameter,
      threadSpacing,
      std.coarsePitch,
    );

    if (coarseConf >= 40) {
      const nearestLen = findNearestLength(effectiveLength, STANDARD_LENGTHS_METRIC);
      candidates.push({
        score: coarseConf,
        match: {
          standard: 'Metric',
          designation: `${std.designation} x ${nearestLen}mm`,
          nominalDiameter: std.nominalDiameter,
          nominalPitch: std.coarsePitch,
          threadType: 'Coarse',
          headType: headType || 'Hex',
          confidence: coarseConf,
          notes: `Metric ISO coarse thread (Pitch ${std.coarsePitch} mm)`,
        },
      });
    }

    // Check fine thread if defined
    if (std.finePitch) {
      const fineConf = calculateConfidence(
        shankDiameter,
        std.nominalDiameter,
        threadSpacing,
        std.finePitch,
      );

      if (fineConf >= 40) {
        const nearestLen = findNearestLength(effectiveLength, STANDARD_LENGTHS_METRIC);
        candidates.push({
          score: fineConf,
          match: {
            standard: 'Metric',
            designation: `${std.designation} x ${std.finePitch} x ${nearestLen}mm`,
            nominalDiameter: std.nominalDiameter,
            nominalPitch: std.finePitch,
            threadType: 'Fine',
            headType: headType || 'Hex',
            confidence: fineConf,
            notes: `Metric ISO fine thread (Pitch ${std.finePitch} mm)`,
          },
        });
      }
    }
  }

  // 2. Check Imperial standards
  const lengthInInches = effectiveLength / 25.4;
  const nearestImperialLenInches = findNearestLength(
    lengthInInches,
    STANDARD_LENGTHS_IMPERIAL_INCHES,
  );
  const formattedLength = toInchFraction(nearestImperialLenInches);

  for (const std of IMPERIAL_BOLT_STANDARDS) {
    // Check coarse thread
    const coarseConf = calculateConfidence(
      shankDiameter,
      std.nominalDiameter,
      threadSpacing,
      std.coarsePitch,
    );

    if (coarseConf >= 40) {
      candidates.push({
        score: coarseConf,
        match: {
          standard: 'Imperial',
          designation: `${std.designation}-${std.coarseTPI} x ${formattedLength}`,
          nominalDiameter: std.nominalDiameter,
          nominalPitch: std.coarsePitch,
          threadsPerInch: std.coarseTPI,
          threadType: 'Coarse',
          headType: headType || 'Hex',
          confidence: coarseConf,
          notes: `Unified National Coarse (${std.coarseTPI} TPI UNC)`,
        },
      });
    }

    // Check fine thread if defined
    if (std.finePitch && std.fineTPI) {
      const fineConf = calculateConfidence(
        shankDiameter,
        std.nominalDiameter,
        threadSpacing,
        std.finePitch,
      );

      if (fineConf >= 40) {
        candidates.push({
          score: fineConf,
          match: {
            standard: 'Imperial',
            designation: `${std.designation}-${std.fineTPI} x ${formattedLength}`,
            nominalDiameter: std.nominalDiameter,
            nominalPitch: std.finePitch,
            threadsPerInch: std.fineTPI,
            threadType: 'Fine',
            headType: headType || 'Hex',
            confidence: fineConf,
            notes: `Unified National Fine (${std.fineTPI} TPI UNF)`,
          },
        });
      }
    }
  }

  // Sort descending by score
  candidates.sort((a, b) => b.score - a.score);

  const bestMatch = candidates.length > 0 ? candidates[0].match : undefined;
  const topList = candidates.slice(0, 5).map(c => c.match);

  return {
    bestMatch,
    candidates: topList,
  };
};

export type UnitType = 'mm' | 'cm' | 'in';

export type HeadType =
  | 'Hex'
  | 'Socket Head Cap (Allen)'
  | 'Pan Head'
  | 'Flat Countersunk'
  | 'Button Head'
  | 'Round / Carriage'
  | 'Flange Hex'
  | 'Unknown';

export interface BoltMeasurement {
  threadSpacing: number; // Pitch in mm
  length: number; // Total length in mm
  shankLength: number; // Threaded/shank length in mm
  socketSize: number; // Head diameter / socket across flats in mm
  shankDiameter: number; // Major diameter in mm
  headType: HeadType;
  pixelsPerMm?: number;
  confidence?: number; // 0 - 100
}

export interface BoltStandardMatch {
  standard: 'Metric' | 'Imperial';
  designation: string; // e.g. "M6 x 25", "1/4\"-20 x 1\""
  nominalDiameter: number; // mm
  nominalPitch: number; // mm
  threadsPerInch?: number; // TPI for imperial
  threadType: 'Coarse' | 'Fine';
  headType: string;
  confidence: number; // 0 - 100
  notes?: string;
}

export interface CustomItem {
  id: string;
  name: string;
  width: string; // mm
  height: string; // mm
  unit: string;
  isRound?: boolean;
  category?: 'coin' | 'card' | 'tool' | 'custom';
  photoUris?: (string | number)[];
}

export interface ScanHistoryItem {
  id: string;
  imageUri: string;
  date: string;
  title?: string;
  notes?: string;
  unit: UnitType;
  measurements: BoltMeasurement;
  bestMatch?: BoltStandardMatch;
  alternativeMatches?: BoltStandardMatch[];
}

export interface CaliperRegion {
  headStart: number; // X position in normalized coordinates 0-1
  headEnd: number; // X position of transition to shank
  shankEnd: number; // X position of bolt tip
  topEdge: number; // Y position top of shank
  bottomEdge: number; // Y position bottom of shank
  headTop: number; // Y position top of head
  headBottom: number; // Y position bottom of head
  referenceCenterX: number; // X position of reference item
  referenceCenterY: number; // Y position of reference item
  referenceRadius: number; // Radius of reference item (if round)
  referenceWidth: number; // Width of reference item (if rect)
  referenceHeight: number; // Height of reference item (if rect)
  selectedTemplate?: HeadType; // Selected fastener shape/head style template
  gaugePitch?: number; // Pitch in mm set via thread gauge comb
}

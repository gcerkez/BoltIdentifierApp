import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CaliperRegion, CustomItem, HeadType } from '../types/BoltTypes';
import { Theme } from '../constants/Theme';

interface Props {
  caliper: CaliperRegion;
  onChange: (updated: CaliperRegion) => void;
  referenceItem: CustomItem | undefined;
}

type ActiveAdjustment = 'boltLength' | 'shankDiameter' | 'headLength' | 'pitchGauge' | 'referenceScale';

const FASTENER_TEMPLATES: { label: string; type: HeadType }[] = [
  { label: 'Hex Bolt', type: 'Hex' },
  { label: 'Socket Cap (Allen)', type: 'Socket Head Cap (Allen)' },
  { label: 'Countersunk', type: 'Flat Countersunk' },
  { label: 'Pan Head', type: 'Pan Head' },
  { label: 'Flange Hex', type: 'Flange Hex' },
];

const CaliperOverlay: React.FC<Props> = ({ caliper, onChange, referenceItem }) => {
  const [activeAdjustment, setActiveAdjustment] = useState<ActiveAdjustment>('boltLength');
  const selectedTemplate = caliper.selectedTemplate || 'Hex';
  const currentPitch = caliper.gaugePitch || 1.25;

  const step = 0.01;

  const handleSelectTemplate = (template: HeadType) => {
    onChange({
      ...caliper,
      selectedTemplate: template,
    });
  };

  const handleNudge = (direction: 1 | -1) => {
    const delta = direction * step;

    switch (activeAdjustment) {
      case 'boltLength': {
        const newShankEnd = Math.min(0.98, Math.max(caliper.headEnd + 0.05, caliper.shankEnd + delta));
        onChange({ ...caliper, shankEnd: Number(newShankEnd.toFixed(3)) });
        break;
      }
      case 'shankDiameter': {
        const newTop = Math.max(0.1, caliper.topEdge - delta * 0.5);
        const newBottom = Math.min(0.9, caliper.bottomEdge + delta * 0.5);
        onChange({
          ...caliper,
          topEdge: Number(newTop.toFixed(3)),
          bottomEdge: Number(newBottom.toFixed(3)),
        });
        break;
      }
      case 'headLength': {
        const newHeadEnd = Math.min(caliper.shankEnd - 0.05, Math.max(caliper.headStart + 0.02, caliper.headEnd + delta));
        onChange({ ...caliper, headEnd: Number(newHeadEnd.toFixed(3)) });
        break;
      }
      case 'pitchGauge': {
        const pitchDelta = direction * 0.05;
        const newPitch = Math.min(3.0, Math.max(0.4, Number((currentPitch + pitchDelta).toFixed(2))));
        onChange({ ...caliper, gaugePitch: newPitch });
        break;
      }
      case 'referenceScale': {
        const newRadius = Math.min(0.3, Math.max(0.02, caliper.referenceRadius + delta * 0.5));
        const newWidth = Math.min(0.5, Math.max(0.04, caliper.referenceWidth + delta));
        const newHeight = Math.min(0.5, Math.max(0.04, caliper.referenceHeight + delta));
        onChange({
          ...caliper,
          referenceRadius: Number(newRadius.toFixed(3)),
          referenceWidth: Number(newWidth.toFixed(3)),
          referenceHeight: Number(newHeight.toFixed(3)),
        });
        break;
      }
    }
  };

  // Generate visual thread pitch gauge teeth along shank
  const shankWidthPct = (caliper.shankEnd - caliper.headEnd) * 100;
  const numTeeth = Math.max(4, Math.min(24, Math.round(shankWidthPct / (currentPitch * 2))));
  const teeth = Array.from({ length: numTeeth }, (_, i) => i);

  return (
    <View style={styles.container}>
      {/* Template Style Selector */}
      <View style={styles.templateHeader}>
        <Text style={styles.sectionLabel}>Fastener Style Template:</Text>
        <View style={styles.templateScroll}>
          {FASTENER_TEMPLATES.map(item => {
            const isSelected = selectedTemplate === item.type;
            return (
              <TouchableOpacity
                key={item.type}
                style={[styles.templateChip, isSelected && styles.templateChipSelected]}
                onPress={() => handleSelectTemplate(item.type)}>
                <Text style={[styles.templateChipText, isSelected && styles.templateChipTextSelected]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Visual Overlay Elements */}
      <View style={styles.overlayFrame}>
        {/* Reference marker box / circle guide */}
        <View
          style={[
            styles.referenceMarker,
            referenceItem?.isRound ? styles.roundMarker : styles.rectMarker,
            {
              left: `${(caliper.referenceCenterX - caliper.referenceRadius) * 100}%`,
              top: `${(caliper.referenceCenterY - caliper.referenceRadius) * 100}%`,
              width: `${caliper.referenceRadius * 2 * 100}%`,
              height: `${caliper.referenceRadius * 2 * 100}%`,
            },
          ]}>
          <Text style={styles.markerLabel}>Ref Item</Text>
        </View>

        {/* Head Region Template Box */}
        <View
          style={[
            styles.headBox,
            selectedTemplate === 'Flat Countersunk' && styles.headCountersunk,
            selectedTemplate === 'Socket Head Cap (Allen)' && styles.headSocketCap,
            selectedTemplate === 'Flange Hex' && styles.headFlange,
            {
              left: `${caliper.headStart * 100}%`,
              top: `${caliper.headTop * 100}%`,
              width: `${(caliper.headEnd - caliper.headStart) * 100}%`,
              height: `${(caliper.headBottom - caliper.headTop) * 100}%`,
            },
          ]}>
          <Text style={styles.markerLabel}>{selectedTemplate}</Text>
        </View>

        {/* Shank Region Box with Thread Pitch Gauge Comb Teeth */}
        <View
          style={[
            styles.shankBox,
            {
              left: `${caliper.headEnd * 100}%`,
              top: `${caliper.topEdge * 100}%`,
              width: `${(caliper.shankEnd - caliper.headEnd) * 100}%`,
              height: `${(caliper.bottomEdge - caliper.topEdge) * 100}%`,
            },
          ]}>
          {/* Thread Pitch Comb Teeth */}
          <View style={styles.teethContainer}>
            {teeth.map(i => (
              <View key={i} style={styles.toothLine} />
            ))}
          </View>
          <Text style={styles.gaugePitchBadge}>{currentPitch.toFixed(2)}mm Pitch</Text>
        </View>
      </View>

      {/* Interactive Fine-Tuning Caliper Toolbar (Android Touch Ergonomics) */}
      <View style={styles.controlBar}>
        <View style={styles.toolbarHeader}>
          <Text style={styles.controlHeader}>Calibrate Overlays & Pitch Gauge</Text>
          {activeAdjustment === 'pitchGauge' ? (
            <Text style={styles.pitchValueBadge}>Pitch: {currentPitch.toFixed(2)} mm</Text>
          ) : null}
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeAdjustment === 'boltLength' && styles.activeTab]}
            onPress={() => setActiveAdjustment('boltLength')}>
            <Text style={[styles.tabText, activeAdjustment === 'boltLength' && styles.activeTabText]}>
              Length
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeAdjustment === 'shankDiameter' && styles.activeTab]}
            onPress={() => setActiveAdjustment('shankDiameter')}>
            <Text style={[styles.tabText, activeAdjustment === 'shankDiameter' && styles.activeTabText]}>
              Diameter
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeAdjustment === 'pitchGauge' && styles.activeTab]}
            onPress={() => setActiveAdjustment('pitchGauge')}>
            <Text style={[styles.tabText, activeAdjustment === 'pitchGauge' && styles.activeTabText]}>
              Pitch Comb
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeAdjustment === 'headLength' && styles.activeTab]}
            onPress={() => setActiveAdjustment('headLength')}>
            <Text style={[styles.tabText, activeAdjustment === 'headLength' && styles.activeTabText]}>
              Head
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeAdjustment === 'referenceScale' && styles.activeTab]}
            onPress={() => setActiveAdjustment('referenceScale')}>
            <Text style={[styles.tabText, activeAdjustment === 'referenceScale' && styles.activeTabText]}>
              Ref Scale
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nudgeRow}>
          <TouchableOpacity style={styles.nudgeBtn} onPress={() => handleNudge(-1)}>
            <Text style={styles.nudgeBtnText}>
              {activeAdjustment === 'pitchGauge' ? '− Finer Pitch' : '− Decrease'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nudgeBtn} onPress={() => handleNudge(1)}>
            <Text style={styles.nudgeBtnText}>
              {activeAdjustment === 'pitchGauge' ? '+ Coarser Pitch' : '+ Increase'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Theme.spacing.sm,
  },
  templateHeader: {
    marginBottom: Theme.spacing.xs,
  },
  sectionLabel: {
    fontSize: Theme.typography.xs,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  templateScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  templateChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  templateChipSelected: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  templateChipText: {
    fontSize: Theme.typography.xs,
    color: '#94a3b8',
    fontWeight: '600',
  },
  templateChipTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  overlayFrame: {
    height: 220,
    backgroundColor: '#090d16',
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  referenceMarker: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#34d399', // Emerald
    borderStyle: 'dashed',
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundMarker: {
    borderRadius: Theme.borderRadius.full,
  },
  rectMarker: {
    borderRadius: 4,
  },
  headBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#f59e0b', // Amber
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headCountersunk: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderColor: '#fbbf24',
  },
  headSocketCap: {
    borderWidth: 2.5,
    borderColor: '#60a5fa',
    backgroundColor: 'rgba(96, 165, 250, 0.25)',
  },
  headFlange: {
    borderRightWidth: 5,
    borderRightColor: '#f97316',
  },
  shankBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#3b82f6', // Blue
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teethContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 4,
    right: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  toothLine: {
    width: 1.5,
    height: '100%',
    backgroundColor: 'rgba(147, 197, 253, 0.6)',
  },
  gaugePitchBadge: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    fontSize: 9,
    color: '#93c5fd',
    fontWeight: '700',
  },
  markerLabel: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  controlBar: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  toolbarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  controlHeader: {
    fontSize: Theme.typography.xs,
    fontWeight: 'bold',
    color: Theme.colors.textMuted,
  },
  pitchValueBadge: {
    fontSize: Theme.typography.xs,
    fontWeight: '700',
    color: '#60a5fa',
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.xs,
    gap: 4,
  },
  tab: {
    flex: 1,
    minHeight: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: '#f1f5f9',
  },
  activeTab: {
    backgroundColor: Theme.colors.primary,
  },
  tabText: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  nudgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Theme.spacing.sm,
    marginTop: 2,
  },
  nudgeBtn: {
    flex: 1,
    minHeight: 46, // Android 48dp touch target standard
    backgroundColor: '#e2e8f0',
    borderRadius: Theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nudgeBtnText: {
    fontSize: Theme.typography.xs,
    fontWeight: '700',
    color: Theme.colors.secondary,
  },
});

export default CaliperOverlay;

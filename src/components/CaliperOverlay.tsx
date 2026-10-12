import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CaliperRegion, CustomItem } from '../types/BoltTypes';
import { Theme } from '../constants/Theme';

interface Props {
  caliper: CaliperRegion;
  onChange: (updated: CaliperRegion) => void;
  referenceItem: CustomItem | undefined;
}

type ActiveAdjustment = 'boltLength' | 'shankDiameter' | 'headLength' | 'referenceScale';

const CaliperOverlay: React.FC<Props> = ({ caliper, onChange, referenceItem }) => {
  const [activeAdjustment, setActiveAdjustment] = useState<ActiveAdjustment>('boltLength');

  const step = 0.01;

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

  return (
    <View style={styles.container}>
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
          <Text style={styles.markerLabel}>Ref</Text>
        </View>

        {/* Head Region Box */}
        <View
          style={[
            styles.headBox,
            {
              left: `${caliper.headStart * 100}%`,
              top: `${caliper.headTop * 100}%`,
              width: `${(caliper.headEnd - caliper.headStart) * 100}%`,
              height: `${(caliper.headBottom - caliper.headTop) * 100}%`,
            },
          ]}>
          <Text style={styles.markerLabel}>Head</Text>
        </View>

        {/* Shank Region Box */}
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
          <Text style={styles.markerLabel}>Shank</Text>
        </View>
      </View>

      {/* Interactive Fine-Tuning Caliper Toolbar */}
      <View style={styles.controlBar}>
        <Text style={styles.controlHeader}>Fine-Tune Calipers:</Text>
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
            <Text style={styles.nudgeBtnText}>− Decrease</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nudgeBtn} onPress={() => handleNudge(1)}>
            <Text style={styles.nudgeBtnText}>+ Increase</Text>
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
  overlayFrame: {
    height: 200,
    backgroundColor: '#0f172a',
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: Theme.spacing.sm,
  },
  referenceMarker: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#38bdf8', // Light sky blue
    borderStyle: 'dashed',
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
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
  shankBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#10b981', // Emerald
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerLabel: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  controlBar: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  controlHeader: {
    fontSize: Theme.typography.xs,
    fontWeight: 'bold',
    color: Theme.colors.textMuted,
    marginBottom: Theme.spacing.xs,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: Theme.colors.primary,
  },
  tabText: {
    fontSize: Theme.typography.xs,
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
  },
  nudgeBtn: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    paddingVertical: 8,
    borderRadius: Theme.borderRadius.sm,
    alignItems: 'center',
  },
  nudgeBtnText: {
    fontSize: Theme.typography.xs,
    fontWeight: '700',
    color: Theme.colors.secondary,
  },
});

export default CaliperOverlay;

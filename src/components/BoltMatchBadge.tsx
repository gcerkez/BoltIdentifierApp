import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BoltStandardMatch } from '../types/BoltTypes';
import { Theme } from '../constants/Theme';

interface Props {
  match: BoltStandardMatch | undefined;
}

const BoltMatchBadge: React.FC<Props> = ({ match }) => {
  if (!match) {
    return (
      <View style={[styles.container, styles.noMatch]}>
        <Text style={styles.noMatchText}>No Standard Match Detected</Text>
        <Text style={styles.hintText}>Custom or non-standard fastener</Text>
      </View>
    );
  }

  const isHighConfidence = match.confidence >= 80;
  const isMediumConfidence = match.confidence >= 60;

  const badgeColor = isHighConfidence
    ? Theme.colors.success
    : isMediumConfidence
    ? Theme.colors.warning
    : Theme.colors.textMuted;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.designationContainer}>
          <Text style={styles.designationText}>{match.designation}</Text>
          <Text style={styles.standardText}>
            {match.standard} • {match.threadType} Thread
          </Text>
        </View>
        <View style={[styles.confidenceBadge, { backgroundColor: badgeColor }]}>
          <Text style={styles.confidenceText}>{match.confidence}% Match</Text>
        </View>
      </View>
      {match.notes ? (
        <Text style={styles.notesText}>{match.notes}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.md,
  },
  noMatch: {
    backgroundColor: '#f1f5f9',
    borderColor: Theme.colors.border,
    alignItems: 'center',
  },
  noMatchText: {
    fontSize: Theme.typography.md,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  hintText: {
    fontSize: Theme.typography.xs,
    color: Theme.colors.textLight,
    marginTop: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  designationContainer: {
    flex: 1,
  },
  designationText: {
    fontSize: Theme.typography.xl,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  standardText: {
    fontSize: Theme.typography.xs,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  confidenceBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.full,
    marginLeft: Theme.spacing.sm,
  },
  confidenceText: {
    color: '#ffffff',
    fontSize: Theme.typography.xs,
    fontWeight: '700',
  },
  notesText: {
    fontSize: Theme.typography.xs,
    color: Theme.colors.textMuted,
    marginTop: Theme.spacing.xs,
  },
});

export default BoltMatchBadge;

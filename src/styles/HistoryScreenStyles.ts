import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: Theme.typography.sm,
    color: Theme.colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
    paddingHorizontal: 2,
  },
  statsText: {
    fontSize: Theme.typography.xs,
    color: Theme.colors.textMuted,
    fontWeight: '600',
  },
  clearLink: {
    fontSize: Theme.typography.xs,
    color: Theme.colors.danger,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: Theme.spacing.xl,
  },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  selectedCard: {
    borderColor: Theme.colors.primary,
    backgroundColor: '#f8fafc',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.xs,
  },
  cardTitle: {
    fontSize: Theme.typography.md,
    fontWeight: 'bold',
    color: Theme.colors.text,
    flex: 1,
  },
  cardDate: {
    fontSize: Theme.typography.xs - 1,
    color: Theme.colors.textLight,
  },
  cardBody: {
    flexDirection: 'row',
    marginTop: Theme.spacing.xs,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: '#0f172a',
    marginRight: Theme.spacing.md,
  },
  detailsColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  dimensionSummary: {
    fontSize: Theme.typography.xs,
    color: Theme.colors.textMuted,
    marginBottom: 2,
  },
  matchChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Theme.borderRadius.full,
    marginTop: 4,
  },
  matchChipText: {
    fontSize: Theme.typography.xs - 1,
    fontWeight: '700',
    color: Theme.colors.success,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.sm,
    paddingTop: Theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionTextBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: Theme.typography.xs,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  deleteActionText: {
    fontSize: Theme.typography.xs,
    fontWeight: '700',
    color: Theme.colors.danger,
  },
  // Modal Detail Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Theme.colors.surfaceOverlay,
    justifyContent: 'center',
    padding: Theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  modalTitle: {
    fontSize: Theme.typography.lg,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  modalImage: {
    width: '100%',
    height: 180,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: '#0f172a',
    marginBottom: Theme.spacing.md,
  },
  modalNotes: {
    fontSize: Theme.typography.xs,
    color: Theme.colors.textMuted,
    fontStyle: 'italic',
    marginBottom: Theme.spacing.md,
  },
  modalBtnClose: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    marginTop: Theme.spacing.md,
  },
  modalBtnCloseText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: Theme.typography.sm,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: Theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: Theme.typography.lg,
    fontWeight: 'bold',
    color: Theme.colors.secondary,
    marginBottom: Theme.spacing.xs,
  },
  emptyText: {
    fontSize: Theme.typography.sm,
    color: Theme.colors.textMuted,
    textAlign: 'center',
  },
});

export default styles;

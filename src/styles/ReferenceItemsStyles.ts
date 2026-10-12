import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  filterPillActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  filterPillText: {
    fontSize: Theme.typography.xs,
    color: Theme.colors.textMuted,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 80,
  },
  item: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  predefinedItem: {
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.primary,
  },
  customItem: {
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.accent,
  },
  selectedItem: {
    borderColor: Theme.colors.primary,
    backgroundColor: '#f0fdf4', // Light mint
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: Theme.typography.md,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  itemDimension: {
    fontSize: Theme.typography.sm,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.full,
  },
  predefinedBadge: {
    backgroundColor: '#eff6ff',
  },
  customBadge: {
    backgroundColor: '#ecfdf5',
  },
  badgeText: {
    fontSize: Theme.typography.xs - 1,
    fontWeight: '700',
  },
  predefinedBadgeText: {
    color: Theme.colors.primary,
  },
  customBadgeText: {
    color: Theme.colors.success,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#fee2e2',
  },
  imageContainer: {
    flexDirection: 'row',
    marginTop: Theme.spacing.sm,
    gap: Theme.spacing.xs,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: '#e2e8f0',
  },
  // Modal / Form Styles
  formContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: Theme.colors.surfaceOverlay,
    justifyContent: 'flex-end',
  },
  formCard: {
    backgroundColor: Theme.colors.card,
    borderTopLeftRadius: Theme.borderRadius.lg,
    borderTopRightRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    maxHeight: '90%',
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
  input: {
    height: 44,
    borderColor: Theme.colors.border,
    borderWidth: 1,
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
    backgroundColor: '#f8fafc',
    fontSize: Theme.typography.sm,
  },
  required: {
    borderColor: Theme.colors.danger,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  checkbox: {
    marginRight: Theme.spacing.xs,
  },
  checkboxLabel: {
    fontSize: Theme.typography.sm,
    color: Theme.colors.text,
  },
  picker: {
    height: 48,
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: Theme.borderRadius.sm,
    marginBottom: Theme.spacing.sm,
  },
  formActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
  },
  formBtnCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  formBtnCancelText: {
    color: Theme.colors.textMuted,
    fontWeight: 'bold',
    fontSize: Theme.typography.sm,
  },
  formBtnSubmit: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
  },
  formBtnSubmitDisabled: {
    backgroundColor: Theme.colors.borderDark,
  },
  formBtnSubmitText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: Theme.typography.sm,
  },
  photoPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 10,
    borderRadius: Theme.borderRadius.sm,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.primaryLight,
  },
  photoPickerText: {
    marginLeft: Theme.spacing.xs,
    color: Theme.colors.primary,
    fontWeight: '600',
    fontSize: Theme.typography.xs,
  },
  addItemFloatingBtn: {
    position: 'absolute',
    bottom: Theme.spacing.lg,
    right: Theme.spacing.lg,
    left: Theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    borderRadius: Theme.borderRadius.full,
    elevation: 4,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addItemFloatingBtnText: {
    color: '#ffffff',
    marginLeft: Theme.spacing.sm,
    fontSize: Theme.typography.md,
    fontWeight: 'bold',
  },
  emptyListText: {
    textAlign: 'center',
    color: Theme.colors.textMuted,
    marginTop: Theme.spacing.xl,
    fontSize: Theme.typography.sm,
  },
});

export default styles;

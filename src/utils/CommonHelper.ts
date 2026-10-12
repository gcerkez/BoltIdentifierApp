import { CustomItem } from '../types/BoltTypes';
import { predefinedItems } from '../constants/PredefinedItems';

export type { CustomItem };
export { predefinedItems };

/**
 * Generates a unique string identifier.
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
};

/**
 * Truncates text with ellipsis if exceeding max length.
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) {
    return '';
  }
  return text.length > maxLength ? text.substring(0, maxLength - 1) + '…' : text;
};

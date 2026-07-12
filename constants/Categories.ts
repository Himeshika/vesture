export const ALL_CATEGORY_NAME = 'All';

export const CATEGORIES = [
  'Wedding',
  'Party',
  'Casual',
  'Traditional',
] as const;

export type Category = (typeof CATEGORIES)[number];

// Feather icon name per category — typed as Record<string, string> to allow dynamic access
export const CATEGORY_ICONS: Record<string, string> = {
  Wedding: 'heart',
  Party: 'music',
  Casual: 'sun',
  Traditional: 'award',
};

export const CATEGORY_COLORS: Record<string, string> = {
  Wedding: '#D4B996',
  Party: '#8B2942',
  Casual: '#4FAE7A',
  Traditional: '#5C8FE8',
};


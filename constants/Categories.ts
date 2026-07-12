export const CATEGORIES = [
  'Wedding',
  'Party',
  'Casual',
  'Traditional',
] as const;

export type Category = (typeof CATEGORIES)[number];

// Feather icon name per category
export const CATEGORY_ICONS: Record<Category, string> = {
  Wedding: 'heart',
  Party: 'music',
  Casual: 'sun',
  Traditional: 'award',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  Wedding: '#D4B996',
  Party: '#8B2942',
  Casual: '#4FAE7A',
  Traditional: '#5C8FE8',
};

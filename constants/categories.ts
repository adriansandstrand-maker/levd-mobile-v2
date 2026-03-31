import { CategoryColors } from '@/lib/theme';

export type CategoryKey = 'forsikringer' | 'kjoretoy' | 'helse' | 'familie';

export interface Category {
  key: CategoryKey;
  label: string;
  icon: string; // FontAwesome icon name
  colors: { bg: string; icon: string };
}

export const categories: Category[] = [
  {
    key: 'forsikringer',
    label: 'Forsikringer',
    icon: 'shield',
    colors: CategoryColors.forsikringer,
  },
  {
    key: 'kjoretoy',
    label: 'Kjøretøy',
    icon: 'car',
    colors: CategoryColors.kjoretoy,
  },
  {
    key: 'helse',
    label: 'Helse',
    icon: 'heartbeat',
    colors: CategoryColors.helse,
  },
  {
    key: 'familie',
    label: 'Familie',
    icon: 'users',
    colors: CategoryColors.familie,
  },
];

import { CategoryColors } from '@/lib/theme';

export type CategoryKey =
  | 'forsikringer'
  | 'kjoretoy'
  | 'helse'
  | 'familie'
  | 'okonomi'
  | 'jus'
  | 'id'
  | 'utdanning'
  | 'reise'
  | 'bolig'
  | 'annet';

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
  {
    key: 'okonomi',
    label: 'Økonomi',
    icon: 'bank',
    colors: CategoryColors.okonomi,
  },
  {
    key: 'jus',
    label: 'Jus',
    icon: 'balance-scale',
    colors: CategoryColors.jus,
  },
  {
    key: 'id',
    label: 'ID',
    icon: 'id-card',
    colors: CategoryColors.id,
  },
  {
    key: 'utdanning',
    label: 'Utdanning',
    icon: 'graduation-cap',
    colors: CategoryColors.utdanning,
  },
  {
    key: 'reise',
    label: 'Reise',
    icon: 'plane',
    colors: CategoryColors.reise,
  },
  {
    key: 'bolig',
    label: 'Bolig',
    icon: 'home',
    colors: CategoryColors.bolig,
  },
  {
    key: 'annet',
    label: 'Annet',
    icon: 'folder-o',
    colors: CategoryColors.annet,
  },
];

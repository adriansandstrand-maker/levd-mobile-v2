import { CategoryColors } from '@/lib/theme';

export type CategoryKey =
  | 'insurance'
  | 'contract'
  | 'loan'
  | 'receipt'
  | 'identification'
  | 'medical'
  | 'legal'
  | 'educational'
  | 'drawing'
  | 'other';

export interface Category {
  key: CategoryKey;
  label: string;
  icon: string; // FontAwesome icon name
  colors: { bg: string; icon: string };
}

export const categories: Category[] = [
  {
    key: 'insurance',
    label: 'Forsikringer',
    icon: 'shield',
    colors: CategoryColors.insurance,
  },
  {
    key: 'contract',
    label: 'Kontrakter',
    icon: 'file-text-o',
    colors: CategoryColors.contract,
  },
  {
    key: 'loan',
    label: 'Lån',
    icon: 'bank',
    colors: CategoryColors.loan,
  },
  {
    key: 'receipt',
    label: 'Kvitteringer',
    icon: 'credit-card',
    colors: CategoryColors.receipt,
  },
  {
    key: 'identification',
    label: 'ID-dokumenter',
    icon: 'id-card',
    colors: CategoryColors.identification,
  },
  {
    key: 'medical',
    label: 'Helse',
    icon: 'heartbeat',
    colors: CategoryColors.medical,
  },
  {
    key: 'legal',
    label: 'Juridisk',
    icon: 'balance-scale',
    colors: CategoryColors.legal,
  },
  {
    key: 'educational',
    label: 'Utdanning',
    icon: 'graduation-cap',
    colors: CategoryColors.educational,
  },
  {
    key: 'drawing',
    label: 'Tegninger',
    icon: 'paint-brush',
    colors: CategoryColors.drawing,
  },
  {
    key: 'other',
    label: 'Annet',
    icon: 'folder-o',
    colors: CategoryColors.other,
  },
];

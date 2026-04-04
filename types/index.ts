export type Category =
  | 'contract'
  | 'insurance'
  | 'loan'
  | 'receipt'
  | 'identification'
  | 'medical'
  | 'legal'
  | 'educational'
  | 'drawing'
  | 'other';

export interface Document {
  id: string;
  asset_id: string | null;
  uploaded_by: string;
  title: string | null;
  description: string | null;
  file_path: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  category: Category | null;
  metadata: Record<string, any> | null;
  occurred_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export type Category =
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

export type DocumentStatus = 'pending' | 'analysing' | 'complete' | 'failed';

export interface Document {
  id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  mime_type: string | null;
  category: Category | null;
  status: DocumentStatus;
  confidence: number | null;
  document_type: string | null;
  entity_name: string | null;
  expiry_date: string | null;
  created_at: string;
  analysis_error: string | null;
}

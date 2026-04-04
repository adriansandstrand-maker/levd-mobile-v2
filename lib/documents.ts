import { supabase } from './supabase';

/**
 * Get all document IDs accessible to a user via document_ownership,
 * with fallback to uploaded_by for backwards compatibility.
 */
export async function getUserDocumentIds(userId: string): Promise<string[]> {
  const { data: owned } = await supabase
    .from('document_ownership')
    .select('document_id')
    .eq('user_id', userId);

  const { data: uploaded } = await supabase
    .from('documents')
    .select('id')
    .eq('uploaded_by', userId);

  const ids = new Set<string>();
  owned?.forEach((d: any) => ids.add(d.document_id));
  uploaded?.forEach((d: any) => ids.add(d.id));

  return Array.from(ids);
}

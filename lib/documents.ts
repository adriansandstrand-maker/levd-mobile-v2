import { supabase } from './supabase';

/**
 * Get all document IDs accessible to a user via document_ownership,
 * with fallback to uploaded_by for backwards compatibility.
 */
export async function getUserDocumentIds(userId: string): Promise<string[]> {
  console.log('[DEBUG] getUserDocumentIds called with userId:', userId);
  
  const { data: owned, error: ownedErr } = await supabase
    .from('document_ownership')
    .select('document_id')
    .eq('user_id', userId);
  console.log('[DEBUG] document_ownership:', owned?.length, 'rows, error:', ownedErr?.message);

  const { data: uploaded, error: uploadedErr } = await supabase
    .from('documents')
    .select('id')
    .eq('uploaded_by', userId);
  console.log('[DEBUG] documents by uploaded_by:', uploaded?.length, 'rows, error:', uploadedErr?.message);

  const ids = new Set<string>();
  owned?.forEach((d: any) => ids.add(d.document_id));
  uploaded?.forEach((d: any) => ids.add(d.id));

  console.log('[DEBUG] Total unique doc IDs:', ids.size);
  return Array.from(ids);
}

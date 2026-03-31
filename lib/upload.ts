import { supabase } from './supabase';

export async function uploadDocument(
  fileUri: string,
  fileName: string,
  mimeType: string,
  userId: string
): Promise<{ path: string; documentId: string } | null> {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const fileExt = fileName.split('.').pop() || 'jpg';
    const storagePath = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, blob, { contentType: mimeType });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        file_path: storagePath,
        file_name: fileName,
        mime_type: mimeType,
        status: 'analyzing',
      })
      .select('id')
      .single();

    if (docError) {
      console.error('Document record error:', docError);
      return null;
    }

    return { path: storagePath, documentId: docData.id };
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
}

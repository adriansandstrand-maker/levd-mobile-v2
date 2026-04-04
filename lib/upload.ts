import { File } from 'expo-file-system';
import { supabase } from './supabase';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/webp',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export class UploadError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export async function uploadDocument(
  fileUri: string,
  fileName: string,
  mimeType: string,
  userId: string
): Promise<{ documentId: string; filePath: string }> {
  // Validate mime type
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new UploadError('INVALID_FILE_TYPE', `Filtypen ${mimeType} er ikke støttet`);
  }


  // Check file size using new File API
  const file = new File(fileUri);
  const fileInfo = file.info();
  if (fileInfo && fileInfo.size && fileInfo.size > MAX_FILE_SIZE) {
    throw new UploadError('FILE_TOO_LARGE', 'Filen er for stor. Maks 10 MB.');
  }

  // Read file as ArrayBuffer for upload
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const fileExt = fileName.split('.').pop() || 'jpg';
  const storagePath = `${userId}/${Date.now()}.${fileExt}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(storagePath, bytes, { contentType: mimeType });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new UploadError('UPLOAD_FAILED', 'Kunne ikke laste opp filen');
  }

  // Create document record (v2 schema: uploaded_by, file_type, title)
  const { data: docData, error: docError } = await supabase
    .from('documents')
    .insert({
      uploaded_by: userId,
      file_path: storagePath,
      file_name: fileName,
      file_type: mimeType,
      title: fileName.replace(/\.[^.]+$/, ''),
      category: 'other',
    })
    .select('id')
    .single();

  if (docError) {
    console.error('Document record error:', docError);
    // Clean up storage on DB failure
    await supabase.storage.from('documents').remove([storagePath]);
    throw new UploadError('DB_ERROR', 'Kunne ikke opprette dokumentpost');
  }

  return { documentId: docData.id, filePath: storagePath };
}

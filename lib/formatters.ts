const MONTHS_NO = [
  'jan', 'feb', 'mar', 'apr', 'mai', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'des',
];

const CATEGORY_LABELS: Record<string, string> = {
  forsikringer: 'Forsikringer',
  kjoretoy: 'Kjøretøy',
  helse: 'Helse',
  familie: 'Familie',
  okonomi: 'Økonomi',
  jus: 'Jus',
  id: 'ID',
  utdanning: 'Utdanning',
  annet: 'Annet',
};

export function formatDate(dateString: string | null): string {
  if (!dateString) return 'Ukjent dato';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Ukjent dato';
  const day = date.getDate();
  const month = MONTHS_NO[date.getMonth()];
  const year = date.getFullYear();
  return `${day}. ${month} ${year}`;
}

export function formatDocumentType(type: string | null): string {
  if (!type) return 'Ukjent';
  return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
}

export function formatCategory(category: string | null): string {
  if (!category) return 'Ukjent';
  return CATEGORY_LABELS[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

export function isExpiringSoon(expiryDate: string | null): boolean {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  if (isNaN(expiry.getTime())) return false;
  const now = new Date();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  return expiry.getTime() > now.getTime() && expiry.getTime() - now.getTime() <= thirtyDays;
}

export function isExpired(expiryDate: string | null): boolean {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  if (isNaN(expiry.getTime())) return false;
  return expiry.getTime() < new Date().getTime();
}

export function formatConfidence(confidence: number | null): string {
  if (confidence === null || confidence === undefined) return 'Ukjent';
  return `${Math.round(confidence * 100)}%`;
}

export function getMimeTypeIcon(mimeType: string | null): string {
  if (!mimeType) return 'file-o';
  if (mimeType === 'application/pdf') return 'file-pdf-o';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.includes('word') || mimeType.includes('docx')) return 'file-word-o';
  return 'file-o';
}

export function formatDocumentCount(count: number): string {
  if (count === 1) return '1 dokument';
  return `${count} dokumenter`;
}

const MONTHS_NO = [
  'jan', 'feb', 'mar', 'apr', 'mai', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'des',
];

const CATEGORY_LABELS: Record<string, string> = {
  insurance: 'Forsikringer',
  contract: 'Kontrakter',
  loan: 'Lån',
  receipt: 'Kvitteringer',
  identification: 'ID-dokumenter',
  medical: 'Helse',
  legal: 'Juridisk',
  educational: 'Utdanning',
  drawing: 'Tegninger',
  other: 'Annet',
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

export function formatDocumentTitle(title: string | null): string {
  if (!title) return 'Ukjent';
  return title.charAt(0).toUpperCase() + title.slice(1).replace(/_/g, ' ');
}

export function formatCategory(category: string | null): string {
  if (!category) return 'Ukjent';
  return CATEGORY_LABELS[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

export function getFileTypeIcon(fileType: string | null): string {
  if (!fileType) return 'file-o';
  if (fileType === 'application/pdf') return 'file-pdf-o';
  if (fileType.startsWith('image/')) return 'image';
  if (fileType.includes('word') || fileType.includes('docx')) return 'file-word-o';
  return 'file-o';
}

export function formatDocumentCount(count: number): string {
  if (count === 1) return '1 dokument';
  return `${count} dokumenter`;
}

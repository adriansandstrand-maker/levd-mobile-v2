import { CategoryKey } from './categories';

export interface DocumentType {
  key: string;
  label: string;
  category: CategoryKey;
}

export const documentTypes: DocumentType[] = [
  // Forsikringer
  { key: 'bilforsikring', label: 'Bilforsikring', category: 'forsikringer' },
  { key: 'innboforsikring', label: 'Innboforsikring', category: 'forsikringer' },
  { key: 'reiseforsikring', label: 'Reiseforsikring', category: 'forsikringer' },
  { key: 'husforsikring', label: 'Husforsikring', category: 'forsikringer' },
  { key: 'livsforsikring', label: 'Livsforsikring', category: 'forsikringer' },

  // Kjøretøy
  { key: 'vognkort', label: 'Vognkort', category: 'kjoretoy' },
  { key: 'forerkort', label: 'Førerkort', category: 'kjoretoy' },
  { key: 'eu_kontroll', label: 'EU-kontroll', category: 'kjoretoy' },
  { key: 'service_kvittering', label: 'Servicekvittering', category: 'kjoretoy' },

  // Helse
  { key: 'resept', label: 'Resept', category: 'helse' },
  { key: 'epikriser', label: 'Epikriser', category: 'helse' },
  { key: 'vaksinasjon', label: 'Vaksinasjon', category: 'helse' },
  { key: 'legeerklaring', label: 'Legeerklæring', category: 'helse' },
  { key: 'tannlege', label: 'Tannlege', category: 'helse' },

  // Familie
  { key: 'fodselsattest', label: 'Fødselsattest', category: 'familie' },
  { key: 'vigselsattest', label: 'Vigselsattest', category: 'familie' },
  { key: 'testament', label: 'Testament', category: 'familie' },
  { key: 'fullmakt', label: 'Fullmakt', category: 'familie' },
  { key: 'pass', label: 'Pass', category: 'familie' },
];

import { CategoryKey } from './categories';

export interface DocumentType {
  key: string;
  label: string;
  category: CategoryKey;
}

export const documentTypes: DocumentType[] = [
  // Insurance
  { key: 'bilforsikring', label: 'Bilforsikring', category: 'insurance' },
  { key: 'innboforsikring', label: 'Innboforsikring', category: 'insurance' },
  { key: 'reiseforsikring', label: 'Reiseforsikring', category: 'insurance' },
  { key: 'husforsikring', label: 'Husforsikring', category: 'insurance' },
  { key: 'livsforsikring', label: 'Livsforsikring', category: 'insurance' },
  { key: 'helseforsikring', label: 'Helseforsikring', category: 'insurance' },
  { key: 'ulykkesforsikring', label: 'Ulykkesforsikring', category: 'insurance' },
  { key: 'batforsikring', label: 'Båtforsikring', category: 'insurance' },

  // Contract
  { key: 'arbeidskontrakt', label: 'Arbeidskontrakt', category: 'contract' },
  { key: 'leiekontrakt', label: 'Leiekontrakt', category: 'contract' },
  { key: 'kjopskontrakt', label: 'Kjøpskontrakt', category: 'contract' },
  { key: 'samboerkontrakt', label: 'Samboerkontrakt', category: 'contract' },
  { key: 'abonnementsavtale', label: 'Abonnementsavtale', category: 'contract' },
  { key: 'kjopskontrakt_eiendom', label: 'Kjøpskontrakt eiendom', category: 'contract' },
  { key: 'kjopskontrakt_kjoretoy', label: 'Kjøpskontrakt kjøretøy', category: 'contract' },

  // Loan
  { key: 'lanedokument', label: 'Lånedokument', category: 'loan' },
  { key: 'skattemelding', label: 'Skattemelding', category: 'loan' },
  { key: 'lonnslipp', label: 'Lønnsslipp', category: 'loan' },
  { key: 'kontoutskrift', label: 'Kontoutskrift', category: 'loan' },
  { key: 'arsoppgave', label: 'Årsoppgave', category: 'loan' },

  // Receipt
  { key: 'kvittering', label: 'Kvittering', category: 'receipt' },
  { key: 'garantibevis', label: 'Garantibevis', category: 'receipt' },
  { key: 'service_kvittering', label: 'Servicekvittering', category: 'receipt' },

  // Identification
  { key: 'pass', label: 'Pass', category: 'identification' },
  { key: 'nasjonal_id', label: 'Nasjonalt ID-kort', category: 'identification' },
  { key: 'fodselssattest', label: 'Fødselsattest', category: 'identification' },
  { key: 'forerkort', label: 'Førerkort', category: 'identification' },

  // Medical
  { key: 'resept', label: 'Resept', category: 'medical' },
  { key: 'epikriser', label: 'Epikriser', category: 'medical' },
  { key: 'vaksinasjon', label: 'Vaksinasjon', category: 'medical' },
  { key: 'legeerklaring', label: 'Legeerklæring', category: 'medical' },
  { key: 'tannlege', label: 'Tannlege', category: 'medical' },
  { key: 'helsejournal', label: 'Helsejournal', category: 'medical' },
  { key: 'sykemelding', label: 'Sykemelding', category: 'medical' },

  // Legal
  { key: 'testament', label: 'Testament', category: 'legal' },
  { key: 'ektepakt', label: 'Ektepakt', category: 'legal' },
  { key: 'fullmakt', label: 'Fullmakt', category: 'legal' },
  { key: 'barnebidrag', label: 'Barnebidrag', category: 'legal' },
  { key: 'dom', label: 'Dom', category: 'legal' },
  { key: 'skjote', label: 'Skjøte', category: 'legal' },
  { key: 'byggetillatelse', label: 'Byggetillatelse', category: 'legal' },
  { key: 'takstrapport', label: 'Takstrapport', category: 'legal' },

  // Educational
  { key: 'karakterutskrift', label: 'Karakterutskrift', category: 'educational' },
  { key: 'vitnemal', label: 'Vitnemål', category: 'educational' },
  { key: 'kursbevis', label: 'Kursbevis', category: 'educational' },
  { key: 'studentbevis', label: 'Studentbevis', category: 'educational' },

  // Drawing
  { key: 'tegning', label: 'Tegning', category: 'drawing' },
  { key: 'barnetegning', label: 'Barnetegning', category: 'drawing' },

  // Other
  { key: 'vognkort', label: 'Vognkort', category: 'other' },
  { key: 'eu_kontroll', label: 'EU-kontroll', category: 'other' },
  { key: 'fodselsattest', label: 'Fødselsattest', category: 'other' },
  { key: 'vigselsattest', label: 'Vigselsattest', category: 'other' },
  { key: 'ukjent', label: 'Ukjent', category: 'other' },
];

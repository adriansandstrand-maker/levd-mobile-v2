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
  { key: 'helseforsikring', label: 'Helseforsikring', category: 'forsikringer' },
  { key: 'ulykkesforsikring', label: 'Ulykkesforsikring', category: 'forsikringer' },
  { key: 'batforsikring', label: 'Båtforsikring', category: 'forsikringer' },

  // Kjøretøy
  { key: 'vognkort', label: 'Vognkort', category: 'kjoretoy' },
  { key: 'forerkort', label: 'Førerkort', category: 'kjoretoy' },
  { key: 'eu_kontroll', label: 'EU-kontroll', category: 'kjoretoy' },
  { key: 'service_kvittering', label: 'Servicekvittering', category: 'kjoretoy' },
  { key: 'kjoretoyhistorikk', label: 'Kjøretøyhistorikk', category: 'kjoretoy' },
  { key: 'kjopskontrakt_kjoretoy', label: 'Kjøpskontrakt kjøretøy', category: 'kjoretoy' },

  // Helse
  { key: 'resept', label: 'Resept', category: 'helse' },
  { key: 'epikriser', label: 'Epikriser', category: 'helse' },
  { key: 'vaksinasjon', label: 'Vaksinasjon', category: 'helse' },
  { key: 'legeerklaring', label: 'Legeerklæring', category: 'helse' },
  { key: 'tannlege', label: 'Tannlege', category: 'helse' },
  { key: 'helsejournal', label: 'Helsejournal', category: 'helse' },
  { key: 'sykemelding', label: 'Sykemelding', category: 'helse' },

  // Familie
  { key: 'fodselsattest', label: 'Fødselsattest', category: 'familie' },
  { key: 'vigselsattest', label: 'Vigselsattest', category: 'familie' },
  { key: 'fullmakt', label: 'Fullmakt', category: 'familie' },
  { key: 'samboerkontrakt', label: 'Samboerkontrakt', category: 'familie' },

  // Økonomi
  { key: 'lanedokument', label: 'Lånedokument', category: 'okonomi' },
  { key: 'skattemelding', label: 'Skattemelding', category: 'okonomi' },
  { key: 'lonnslipp', label: 'Lønnsslipp', category: 'okonomi' },
  { key: 'kontoutskrift', label: 'Kontoutskrift', category: 'okonomi' },
  { key: 'arsoppgave', label: 'Årsoppgave', category: 'okonomi' },

  // Jus
  { key: 'arbeidskontrakt', label: 'Arbeidskontrakt', category: 'jus' },
  { key: 'testament', label: 'Testament', category: 'jus' },
  { key: 'ektepakt', label: 'Ektepakt', category: 'jus' },
  { key: 'barnebidrag', label: 'Barnebidrag', category: 'jus' },
  { key: 'dom', label: 'Dom', category: 'jus' },

  // ID
  { key: 'pass', label: 'Pass', category: 'id' },
  { key: 'nasjonal_id', label: 'Nasjonalt ID-kort', category: 'id' },
  { key: 'fodselssattest', label: 'Fødselsattest', category: 'id' },

  // Utdanning
  { key: 'karakterutskrift', label: 'Karakterutskrift', category: 'utdanning' },
  { key: 'vitnemal', label: 'Vitnemål', category: 'utdanning' },
  { key: 'kursbevis', label: 'Kursbevis', category: 'utdanning' },
  { key: 'studentbevis', label: 'Studentbevis', category: 'utdanning' },

  // Reise
  { key: 'boardingkort', label: 'Boardingkort', category: 'reise' },
  { key: 'hotellbekreftelse', label: 'Hotellbekreftelse', category: 'reise' },
  { key: 'visum', label: 'Visum', category: 'reise' },
  { key: 'reisebekreftelse', label: 'Reisebekreftelse', category: 'reise' },

  // Bolig
  { key: 'skjote', label: 'Skjøte', category: 'bolig' },
  { key: 'leiekontrakt', label: 'Leiekontrakt', category: 'bolig' },
  { key: 'byggetillatelse', label: 'Byggetillatelse', category: 'bolig' },
  { key: 'takstrapport', label: 'Takstrapport', category: 'bolig' },
  { key: 'kjopskontrakt_eiendom', label: 'Kjøpskontrakt eiendom', category: 'bolig' },

  // Annet
  { key: 'garantibevis', label: 'Garantibevis', category: 'annet' },
  { key: 'kvittering', label: 'Kvittering', category: 'annet' },
  { key: 'kjopskontrakt', label: 'Kjøpskontrakt', category: 'annet' },
  { key: 'abonnementsavtale', label: 'Abonnementsavtale', category: 'annet' },
  { key: 'ukjent', label: 'Ukjent', category: 'annet' },
];

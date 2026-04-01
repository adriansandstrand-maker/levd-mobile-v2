# Nattrapport – Levd.ai Mobilapp

**Dato:** 2026-04-01
**Status:** Alle 10 punkter implementert

---

## Nye filer

| Fil | Beskrivelse |
|-----|-------------|
| `types/index.ts` | Document, Category, DocumentStatus typer |
| `lib/formatters.ts` | Norske formatteringsfunksjoner (dato, kategori, confidence, mm.) |
| `app/upload.tsx` | Upload-skjerm med polling, resultatvisning, feilhåndtering |
| `app/correct/[id].tsx` | Korrigeringsskjerm med alle dokumenttyper gruppert per kategori |
| `app/document/[id].tsx` | Dokumentdetalj med preview, metadata, slett/endre |
| `app/category/[category].tsx` | Kategorivisning med dokumentliste og tom-tilstand |

## Endrede filer

| Fil | Endring |
|-----|---------|
| `lib/upload.ts` | Fil-validering (10MB, mime-types), expo-file-system File API, UploadError klasse, storage cleanup |
| `app/(tabs)/_layout.tsx` | handleFileSelected navigerer til /upload med params |
| `app/_layout.tsx` | Stack.Screen for upload, correct/[id], category/[category], document/[id] |
| `app/(tabs)/index.tsx` | Nylig lagt til-seksjon (3 siste), oppdaterte counts (status=complete), CategoryRow onPress |
| `package.json` | expo-file-system lagt til |

## Arkitektur

- **Upload-flyt:** ScanModal → /upload → polling → resultat basert på confidence
  - ≥ 0.95: auto-navigering til /document/[id]
  - 0.80–0.94: ConfidenceCard med bekreft/endre
  - < 0.80: redirect til /correct/[id]
  - failed: feilmelding med prøv igjen / lagre likevel
- **Korrigering:** Alle 8 kategorier med dokumenttyper som chips
- **Dokumentdetalj:** Signed URL preview, metadata-kort, slett med Storage+DB cleanup
- **Kategori:** FlatList med dokumenter filtrert på category + status=complete

## Design-system

Alle nye skjermer følger design-systemet:
- Farger fra `lib/theme.ts` (Colors, CategoryColors)
- Typografi: DM Sans, JetBrains Mono for metadata
- Spacing og Radius fra theme
- Kort-design: Colors.white bg, Radius.lg, Spacing.md padding, ingen shadow

## Testresultater

- TypeScript kompilerer uten feil (`npx tsc --noEmit` = OK)
- Alle 10 commits pushet til GitHub main

## Commits

1. `feat: add types and formatters`
2. `feat: update upload.ts with validation`
3. `feat: connect scan modal to upload route`
4. `feat: upload screen with polling`
5. `feat: upload result states`
6. `feat: correction screen`
7. `feat: document detail screen`
8. `feat: category view`
9. `feat: home screen counts and recent`
10. `feat: nattrapport og final push`

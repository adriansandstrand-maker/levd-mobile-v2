# Levd.ai Mobilapp v2 — Rapport

## Teknisk oversikt

- **Plattform:** Expo SDK 54, React Native 0.81, expo-router 6.x
- **Arkitektur:** Fabric (newArchEnabled: true), fungerer i Expo Go
- **Autentisering:** Supabase Auth med expo-secure-store (SecureStore for native, localStorage for web)
- **Backend:** Supabase (auth, database, storage)

## Appstruktur

### 3 faner + auth

| Fane | Fil | Beskrivelse |
|------|-----|-------------|
| Hjem | `app/(tabs)/index.tsx` | Hilsen, hurtighandlinger, skanne-kort, kategoriliste |
| Skann | `app/(tabs)/scan.tsx` | Fanefanget — åpner bunnmodal med kamera/galleri/PDF |
| Profil | `app/(tabs)/profile.tsx` | Avatar, meny, logg ut |
| Auth | `app/auth/login.tsx` | Innlogging/registrering med Supabase |

### Kjernebibliotek

| Fil | Formål |
|-----|--------|
| `lib/theme.ts` | Farger, fonter, spacing, radius |
| `lib/supabase.ts` | Supabase-klient med SecureStore-adapter |
| `lib/upload.ts` | Dokumentopplasting til Supabase Storage |
| `lib/auth.tsx` | AuthProvider med session-håndtering |

### Komponenter

| Komponent | Beskrivelse |
|-----------|-------------|
| `Avatar.tsx` | Sirkel med initialer (lavendel bakgrunn) |
| `CategoryRow.tsx` | Pastell-kort med ikon, etikett, dokumenttelling |
| `ScanModal.tsx` | Bunnmodal: kamera, galleri, PDF-opplasting |
| `AnalysisLoader.tsx` | Roterende meldinger under dokumentanalyse |
| `ConfidenceCard.tsx` | Bekreft/korriger basert på AI-konfidens |

### Konstanter

| Fil | Innhold |
|-----|---------|
| `constants/categories.ts` | 4 kategorier med farger og ikoner |
| `constants/documentTypes.ts` | 19 dokumenttyper fordelt på kategorier |

## Designsystem

- **Fraunces italic:** Kun H1-hilsen ("Hei, [navn]")
- **DM Sans:** Alt annet (400, 500, 600, 700)
- **JetBrains Mono:** "LEVD.AI"-merke, metadata
- **Fargepalett:** Varm krem bakgrunn (#F5F0EB), dyp lilla aksent (#4A4070), pastell kategorikort

## Sikkerhet

- Tokens lagres i expo-secure-store (native) / localStorage (web)
- SSR-safe: sjekker `typeof window` før localStorage-tilgang
- Auth-redirect: uautentiserte brukere sendes til innlogging automatisk

## Byggestatus

Verifisert med `npx expo export --platform web` — alle ruter bygges uten feil.

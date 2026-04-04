# Levd App Icon Specification

## Design
- **Letter**: "L" (uppercase)
- **Background**: Cream (#F5F0EB)
- **Letter color**: Forest green (#2F5F52)
- **Font**: Clean sans-serif (e.g., DM Sans Bold or Inter Bold)
- **Style**: Centered "L" with generous padding, modern and minimal

## Required Sizes (iOS)
| Size | Usage |
|------|-------|
| 1024x1024 | App Store |
| 180x180 | iPhone @3x |
| 120x120 | iPhone @2x |
| 167x167 | iPad Pro @2x |
| 152x152 | iPad @2x |
| 76x76 | iPad @1x |
| 87x87 | Spotlight @3x |
| 80x80 | Spotlight @2x |
| 60x60 | iPhone @1x |
| 40x40 | Spotlight @1x |
| 29x29 | Settings @1x |
| 58x58 | Settings @2x |

## Generation
Use the SVG below as a source, then export at required sizes:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" rx="230" fill="#F5F0EB"/>
  <text x="512" y="680" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="620" fill="#2F5F52">L</text>
</svg>
```

## Splash Screen
- **Background**: Forest green (#2F5F52)
- **Text**: "Levd" in white (#FFFFFF), DM Sans Bold, centered
- Configured in app.json splash.backgroundColor

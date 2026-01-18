# Brand Logos Implementation Summary

## Overview
Brand logo system has been implemented to automatically display brand logos next to subscription names in the list and detail views.

## Files Created

### Core Components & Utils
- `src/utils/brandMapping.ts` - Brand name normalization and logo key mapping
- `src/components/BrandLogo.tsx` - React component for rendering brand logos with fallbacks

### Assets
- `src/assets/logos/` - Folder containing brand SVG logos

## Brand Logo Mapping

The following brands are supported with their logo files and name aliases:

| Brand Key | Logo File | Name Aliases |
|-----------|-----------|--------------|
| `netflix` | `netflix.svg` | netflix |
| `spotify` | `spotify.svg` | spotify |
| `adobe` | `adobe.svg` | adobe, adobe cc, adobe creative cloud, cc |
| `notion` | `notion.svg` | notion |
| `figma` | `figma.svg` | figma |
| `slack` | `slack.svg` | slack |
| `github` | `github.svg` | github |
| `google` | `google.svg` | google, google drive, gmail, google workspace, g suite, gcp, google cloud |
| `youtube` | `youtube.svg` | youtube |
| `apple` | `apple.svg` | apple |
| `dropbox` | `dropbox.svg` | dropbox |
| `microsoft` | `microsoft.svg` | microsoft, microsoft office, office 365, o365, ms office, azure |
| `openai` | `openai.svg` | openai |
| `amazon` | `amazon.svg` | amazon, prime video, prime, amazon prime, amazon prime video, aws |

## Implementation Details

### BrandLogo Component Features
1. **Priority System:**
   - Priority 1: `imageUrl` prop (user-provided image URL)
   - Priority 2: Brand logo from mapping (automatic matching)
   - Priority 3: First letter fallback (letter avatar)

2. **Sizing:**
   - Container: 40px × 40px (w-10 h-10) on desktop, 32px × 32px (w-8 h-8) on mobile for list view
   - Logo: 16px × 16px (w-4 h-4) inside container
   - Matches Figma specifications

3. **Error Handling:**
   - Graceful fallback if image URL fails to load
   - Graceful fallback if brand logo file is missing
   - Always shows first letter if no logo available

### Brand Matching Logic
- Normalizes subscription names: lowercase, trim, remove punctuation, collapse spaces
- Handles common aliases (e.g., "Prime Video" → "amazon")
- Supports partial matching (contains checks)
- Memoized for performance in large lists

## Updated Components

### Subscription List (`SubscriptionsList.tsx`)
- Replaced manual logo rendering with `<BrandLogo>` component
- Uses `size="sm"` for list view (matches existing responsive sizing)

### Subscription Detail (`SubscriptionDetail.tsx`)
- Replaced manual logo rendering with `<BrandLogo>` component
- Uses `size="md"` for detail view (40px container)

## Usage

```tsx
import { BrandLogo } from '@/components/BrandLogo';

// Basic usage (automatic brand matching)
<BrandLogo name="Netflix" />

// With custom image URL (priority over brand logo)
<BrandLogo name="Netflix" imageUrl="https://example.com/custom-logo.png" />

// Small size for list views
<BrandLogo name="Spotify" size="sm" />

// Medium size for detail views
<BrandLogo name="Spotify" size="md" />
```

## Adding New Brand Logos

1. Download SVG logo from [svglogos.dev](https://svglogos.dev/)
2. Save to `src/assets/logos/[brand-key].svg`
3. Add import in `src/components/BrandLogo.tsx`:
   ```tsx
   import brandLogo from '@/assets/logos/[brand-key].svg?url';
   ```
4. Add to `brandLogoImports` object:
   ```tsx
   [brand-key]: brandLogo,
   ```
5. Add brand key and aliases to `BRAND_LOGOS` in `src/utils/brandMapping.ts`

## Notes

- All logos are stored as local SVG assets (no external hotlinking)
- SVGs are optimized for dark backgrounds
- Color logos are preserved as-is
- Monochrome logos work on dark background (neutral-900)
- Component is fully responsive and matches existing design system

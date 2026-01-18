# Figma Text Style → Color Variable → tokens.ts Mapping

## Mapping Table

Based on MCP inspection of Figma design, here's the complete mapping:

| Figma Text Style | Figma Color Variable | tokens.ts Property | Hex Value | Usage |
|-----------------|---------------------|-------------------|-----------|-------|
| Headings/H4 | `foundation/white` | `text.primary` | `#FFFFFF` | Page titles, headings ("Create your account", "Login") |
| Body/Body medium | `neutral/200` | `text.secondary` | `#7C7C7C` | Body text, labels ("Password", description text) |
| Body/Body medium | `foundation/white` | `text.primary` | `#FFFFFF` | Body text on dark backgrounds |
| Body/Body small | `semantic/success/500` | `text.success` | `#00E177` | Success status text ("Connected") |
| Links/link header | `foundation/white` | `text.primary` | `#FFFFFF` | Navigation links ("Subscriptions", "Settings") |
| Button text (white bg) | `neutral/900` | `text.inverse` | `#020202` | Button text on white backgrounds |
| Button text (colored bg) | `foundation/white` | `text.primary` | `#FFFFFF` | Button text on colored backgrounds |
| Table header/Caption | `neutral/200` | `text.secondary` | `#7C7C7C` | Table column headers ("Subscription", "Price") |
| Badge Active text | `neutral/800` | `text.badgeActive` | `#101010` | Text on success badge (green background) |
| Badge Inactive text | `foundation/white` | `text.badgeInactive` | `#FFFFFF` | Text on danger badge (red background) |
| Badge Review text | `neutral/200` | `text.badgeReview` | `#7C7C7C` | Text on review badge (dashed border) |
| Clickable link | `brand.primary.500` | `text.brand` | `#1EBBE6` | Clickable links, brand interactions |

## tokens.ts Structure

All text colors are now centralized in `tokens.colors.text`:

```typescript
text: {
  // Primary text colors
  primary: '#ffffff',        // foundation.white
  secondary: '#7C7C7C',      // neutral.200
  muted: '#7C7C7C',          // neutral.200 (alias)

  // Semantic text colors
  inverse: '#020202',        // neutral.900
  brand: '#1ebbe6',          // brand.primary.500

  // Status/state colors
  success: '#00e177',        // semantic.success.500
  warning: '#e36b16',        // semantic.warning.500
  danger: '#d82c2c',         // semantic.danger.500
  info: '#1171EE',           // semantic.information.500

  // Special use cases
  onDark: '#ffffff',         // foundation.white (alias)
  onLight: '#020202',        // neutral.900 (alias)
  badgeActive: '#101010',    // neutral.800
  badgeInactive: '#ffffff',  // foundation.white
  badgeReview: '#7C7C7C',    // neutral.200
}
```

## Tailwind Usage

All text colors are available as Tailwind classes:
- `text-text-primary` → `#ffffff`
- `text-text-secondary` → `#7C7C7C`
- `text-text-muted` → `#7C7C7C`
- `text-text-inverse` → `#020202`
- `text-text-brand` → `#1ebbe6`
- `text-text-success` → `#00e177`
- `text-text-warning` → `#e36b16`
- `text-text-danger` → `#d82c2c`
- `text-text-info` → `#1171EE`
- `text-text-badgeActive` → `#101010`
- `text-text-badgeInactive` → `#ffffff`
- `text-text-badgeReview` → `#7C7C7C`

## Migration Guide

Replace in codebase:
- `text-white` → `text-text-primary`
- `text-neutral-200` / `text-neutral-700` → `text-text-secondary` (for body/labels)
- `text-neutral-900` → `text-text-inverse` (for text on light backgrounds)
- `text-brand-primary-500` → `text-text-brand` (for links)
- `text-success-500` → `text-text-success` (for success states)
- `text-danger-500` → `text-text-danger` (for error states)
- Hardcoded hex colors → appropriate `text-text-*` class

# Design Audit Report - Visual Drift Fixes

## Issues Identified

### A) Critical Color Drift

1. **AppLayout Backgrounds (WRONG)**
   - `bg-neutral-50` used for main app background - should be `bg-neutral-900` or `bg-neutral-100` (dark theme per PRD "black UI")
   - `bg-neutral-100` used for header - verify against Figma
   - Text colors on header use `text-neutral-900` - should be white on dark background

2. **Marketing Landing Page**
   - `bg-white` used for buttons - verify against Figma
   - `bg-neutral-200`, `bg-neutral-100` for preview placeholders - verify

3. **Token Mapping Issues**
   - `text.primary: '#070707'` doesn't match any neutral token (neutral.900 is '#0B0B0B')
   - `background.primary: '#070707'` is inconsistent

4. **Hardcoded Gradients**
   - `linear-gradient(250.87deg, #1EBBE6 9.18%, #1F36E6 87.99%)` hardcoded
   - Should use brand-primary-500 and brand-secondary-500 from tokens

5. **Border Colors**
   - `border-neutral-200`, `border-neutral-50`, `border-neutral-700` need verification
   - Should use tokens consistently

### B) Files Requiring Updates

**Priority 1 (App Layout):**
- `src/components/Layout/AppLayout.tsx` - Background colors, text colors
- `src/pages/Subscriptions/SubscriptionsList.tsx` - Backgrounds, borders
- `src/pages/Subscriptions/SubscriptionDetail.tsx` - Backgrounds, borders
- `src/pages/Subscriptions/SubscriptionForm.tsx` - Input backgrounds, borders
- `src/pages/Settings/Settings.tsx` - Card backgrounds
- `src/pages/Profile/Profile.tsx` - Card backgrounds

**Priority 2 (Marketing):**
- `src/pages/Marketing/Landing.tsx` - Button colors, card backgrounds
- `src/components/Layout/MarketingLayout.tsx` - Already correct (uses neutral-900)

**Priority 3 (Tokens):**
- `src/config/tokens.ts` - Fix text/background mappings
- `tailwind.config.js` - Verify all tokens mapped correctly

## Fix Strategy

1. Fix token mappings to match actual Figma colors
2. Replace all hardcoded gradients with token-based values
3. Update AppLayout to use dark backgrounds (neutral-900/100)
4. Update all app pages to use consistent dark theme
5. Verify marketing landing matches Figma (dark theme)
6. Replace border colors with token values

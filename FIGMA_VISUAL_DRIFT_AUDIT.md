# Figma Visual Drift Audit & Fix Plan

## Status: Partial Fixes Applied

### ✅ COMPLETED FIXES

1. **AppLayout Backgrounds**
   - ✅ Changed main container: `bg-neutral-50` → `bg-neutral-900`
   - ✅ Changed main content: `bg-neutral-50` → `bg-neutral-900`
   - ✅ Changed navigation text: `text-neutral-900` → `text-white`

2. **Design Tokens**
   - ✅ Added `neutral.900: '#000000'` to tokens
   - ✅ Fixed `text.primary: '#ffffff'` (white for dark UI)
   - ✅ Fixed `background.primary: '#0B0B0B'` (dark)

### 🔍 IDENTIFIED ISSUES NEEDING VERIFICATION

**Color Usage:**
- AppLayout header: `bg-neutral-100` (#101010) - is this correct for Figma?
- Dropdown menu: `bg-neutral-200` with `text-neutral-900` - needs verification
- Landing page buttons: `bg-white` - verify against Figma
- Button component: `bg-white` variant - verify against Figma
- Pro plan card: `bg-black` - verify against Figma

**Hardcoded Values:**
- Gradients: `linear-gradient(250.87deg, #1EBBE6 9.18%, #1F36E6 87.99%)` - should use tokens
- Shadow: `rgba(146,231,255,0.5)` - hardcoded color

**Files with `bg-white` usage (7 files found):**
- `src/pages/Marketing/Landing.tsx` - Hero buttons
- `src/components/Auth/Button.tsx` - Secondary variant
- `src/pages/Profile/Profile.tsx` - Modal backdrop
- `src/components/Subscriptions/EmptyState.tsx`
- `src/components/Auth/GoogleButton.tsx`
- `src/components/Onboarding/Toggle.tsx`
- `src/pages/Onboarding/BrowserExtension.tsx`

### 📋 NEXT STEPS

To complete the visual drift fix, please:

1. **Verify Figma designs** for these elements:
   - App header background color
   - Dropdown menu colors
   - Button colors (white vs colored)
   - Landing page hero button colors

2. **Systematic replacement** once verified:
   - Replace all `bg-white` with appropriate token
   - Replace hardcoded gradients with token-based
   - Update border colors to match Figma
   - Update all spacing to use token scale

3. **Final verification checklist:**
   - [ ] Auth (signup/login)
   - [ ] Onboarding (scan emails, scan progress, browser reading)
   - [ ] Subscriptions (empty + table)
   - [ ] Subscription detail (active + review)
   - [ ] Add + Edit subscription forms
   - [ ] Settings (email + extension states)
   - [ ] Profile
   - [ ] Landing (all sections)

### 📝 CURRENT TOKEN STATE

Tokens are updated with:
- `neutral.900` added for darkest backgrounds
- `text.primary` = white (for dark UI)
- `background.primary` = `#0B0B0B` (dark)

**Remaining work:** Verify and replace all hardcoded colors/spacing with tokens.

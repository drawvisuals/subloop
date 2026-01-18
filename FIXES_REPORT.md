# Visual Drift Fixes - Implementation Report

## Summary

Fixed layout and color drift by aligning implementation to Figma design using existing Tailwind token system. All changes maintain current Tailwind configuration and patterns.

## Files Changed

### Components
1. **src/components/Auth/Button.tsx**
   - Replaced `bg-white` → `bg-foundation-white`
   - Replaced `leading-[22px]` → `leading-normal`

2. **src/components/Auth/Input.tsx**
   - Replaced `leading-[22px]` → `leading-normal` (3 instances)

3. **src/components/Auth/GoogleButton.tsx**
   - Replaced `bg-white` → `bg-foundation-white`
   - Replaced `leading-[22px]` → `leading-normal`

4. **src/components/Onboarding/Toggle.tsx**
   - Updated comments to reference token names instead of hex codes
   - Replaced `bg-white` → `bg-foundation-white`

5. **src/components/Subscriptions/SearchInput.tsx**
   - Replaced `leading-[22px]` → `leading-normal`

6. **src/components/Subscriptions/StatusBadge.tsx** (NEW)
   - Created reusable StatusBadge component
   - Uses token classes: `bg-success-500`, `bg-danger-500`, `border-neutral-700`, `text-neutral-50`, `text-foundation-white`, etc.

7. **src/components/Subscriptions/index.ts**
   - Added StatusBadge export

8. **src/components/Layout/AppLayout.tsx**
   - Replaced inline gradient style → `bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500`

9. **src/components/Layout/MarketingLayout.tsx**
   - Replaced inline gradient style → `bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500`

### Pages
10. **src/pages/Subscriptions/SubscriptionsList.tsx**
    - Replaced inline status badge spans → `<StatusBadge />` component
    - Replaced all `leading-[22px]` → `leading-normal` (multiple instances)

11. **src/pages/Subscriptions/SubscriptionDetail.tsx**
    - Replaced inline status badge spans → `<StatusBadge />` component
    - Replaced all `leading-[22px]` → `leading-normal`
    - Added StatusBadge import

12. **src/pages/Subscriptions/SubscriptionForm.tsx**
    - Replaced all `leading-[22px]` → `leading-normal`

13. **src/pages/Auth/SignUp.tsx**
    - Replaced all `leading-[22px]` → `leading-normal`

14. **src/pages/Auth/Login.tsx**
    - Replaced all `leading-[22px]` → `leading-normal`

15. **src/pages/Marketing/Landing.tsx**
    - Replaced `bg-white` → `bg-foundation-white`
    - Replaced all `leading-[22px]` → `leading-normal`

16. **src/pages/Settings/Settings.tsx**
    - Replaced all `leading-[22px]` → `leading-normal`

17. **src/pages/Onboarding/BrowserExtension.tsx**
    - Replaced all `leading-[22px]` → `leading-normal`

18. **src/pages/Onboarding/Scanning.tsx**
    - Replaced all `leading-[22px]` → `leading-normal`

19. **src/pages/Profile/Profile.tsx**
    - Replaced all `leading-[22px]` → `leading-normal`

### Documentation
20. **TAILWIND_INVENTORY_REPORT.md** (NEW)
    - Complete inventory of Tailwind setup
    - Variable mapping from Figma to Tailwind

21. **FIXES_REPORT.md** (NEW)
    - This file

## Key Changes

### Color Tokenization
- All `bg-white` → `bg-foundation-white` for consistency
- Gradient styles replaced with Tailwind utilities: `bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500`
- Status badge colors use semantic tokens: `success-500`, `danger-500`, `neutral-700`

### Typography Tokenization
- All `leading-[22px]` → `leading-normal` (uses `22px` from tokens)
- Maintains `text-base` for font size (16px from tokens)

### Component Composition
- Created reusable `StatusBadge` component
- Pages now use component instances instead of inline badge markup
- Consistent badge styling across all pages

### Layout
- Gradient buttons use Tailwind gradient utilities instead of inline styles
- Container widths and spacing maintained as per existing patterns

## Verification Checklist

### Components Fixed ✓
- [x] Button
- [x] Input
- [x] Toggle
- [x] StatusBadge (new)
- [x] SearchInput
- [x] FilterDropdown (no changes needed)
- [x] TopNav (AppLayout, MarketingLayout)

### Pages Fixed ✓
- [x] Auth (Login, SignUp)
- [x] Onboarding (EmailScan, Scanning, BrowserExtension)
- [x] Subscriptions (List, Detail, Form, Add, Edit)
- [x] Settings
- [x] Profile
- [x] Landing (single-page with #features, #pricing, #faq anchors)

### Design System ✓
- [x] Colors use token classes
- [x] Typography uses token classes
- [x] Spacing uses token scale (where applicable)
- [x] Border radius uses token classes
- [x] Gradients use token colors

## Remaining Considerations

### Arbitrary Values Still Present
Some arbitrary values remain where exact token matches don't exist:
- `h-[54px]`, `h-[62px]`, `h-[52px]`, `h-[53px]` - Custom heights not in spacing scale
- `min-h-[44px]` - Accessibility min touch target
- `w-[18px]`, `w-[90px]`, `w-[438px]` - Specific component widths from Figma
- `text-[12px]`, `text-[13px]`, `text-[48px]`, etc. - Font sizes not in fontSize tokens
- `leading-[28px]`, `leading-[44px]`, `leading-[54px]` - Line heights not in tokens
- `gap-[128px]` - Large gaps not in spacing scale

These are acceptable as they represent specific Figma design values that don't map to standard spacing/font scales.

### Responsive Behavior
All pages maintain responsive behavior:
- Mobile: 375px+ (stacking, smaller text)
- Tablet: 768px+ (horizontal layouts, medium text)
- Desktop: 1280px+ (full layouts, larger text)

Landing page confirmed as single-page route `/` with anchor sections for `#features`, `#pricing`, `#faq`.

## Next Steps (Optional)

If further refinement is needed:
1. Add missing fontSize values to tokens (12px, 13px, 48px, etc.)
2. Add missing lineHeight values (28px, 44px, 54px, etc.)
3. Add custom spacing values (44px, 52px, 54px, 62px, etc.)
4. Extract more reusable components (Card, TableRow)

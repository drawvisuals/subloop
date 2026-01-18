# Visual Drift Fixes - Summary

## Critical Issues Found

### 1. AppLayout Background Color Mismatch
**Current:** `bg-neutral-50`, `bg-neutral-100`
**Should be:** Match MarketingLayout pattern (`bg-neutral-900` for dark theme) OR use `bg-neutral-50` (which is `#0B0B0B` in tokens)

**Issue:** AppLayout uses light backgrounds while MarketingLayout uses dark. For "black UI" (per PRD), both should use dark backgrounds.

### 2. Text Colors on AppLayout Header
**Fixed:** Changed `text-neutral-900` to `text-white` on navigation links (already done)

### 3. Token Mapping Inconsistencies
**Fixed:** Updated `text.primary` to `#ffffff` and `background.primary` to `#0B0B0B` (already done)

### 4. Missing neutral-900 in Tokens
**Issue:** MarketingLayout uses `bg-neutral-900` but tokens only define `neutral.50` through `neutral.800`

## Recommendation

Given the complexity and need to match Figma exactly, I recommend:

1. **Confirm Figma design:** The user should verify if app pages should use:
   - Option A: `bg-neutral-900` (like MarketingLayout) - requires adding `neutral-900` to tokens
   - Option B: `bg-neutral-50` (which is `#0B0B0B` in current tokens) - already defined

2. **Systematic replacement:** Once confirmed, replace all color usages to match Figma exactly

3. **Verify gradients:** All gradient values should use token colors, not hardcoded hex

Would you like me to:
- A) Add `neutral-900` to tokens and update AppLayout to match MarketingLayout pattern?
- B) Keep current tokens and use `bg-neutral-50` for app backgrounds?
- C) Wait for Figma design confirmation before making changes?

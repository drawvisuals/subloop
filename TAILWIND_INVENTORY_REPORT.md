# Tailwind Setup Inventory Report

## STEP 1: Current Tailwind Configuration

### Theme.Extend Structure
**File:** `tailwind.config.js`

**Colors:**
- `brand.primary.*` (100-900) → `bg-brand-primary-{100-900}`, etc.
- `brand.secondary.*` (100-900) → `bg-brand-secondary-{100-900}`, etc.
- `foundation.white/black` → `bg-foundation-white`, `bg-foundation-black`
- `neutral.*` (50, 100-900) → `bg-neutral-{50,100-900}`, `text-neutral-*`, `border-neutral-*`
- `success.*` (100-900) → `bg-success-{100-900}`, `text-success-*`
- `warning.*` (100-900) → `bg-warning-{100-900}`, `text-warning-*`
- `danger.*` (100-900) → `bg-danger-{100-900}`, `text-danger-*`
- `information.*` (400, 500, 800, 900) → `bg-information-{400,500}`, etc.
- `text.primary/secondary/muted` → `text-text-primary`, `text-text-secondary`, etc.
- `background.primary/secondary/card` → `bg-background-primary`, etc.
- `border.default/muted` → `border-border-default`, `border-border-muted`

**Typography:**
- `fontFamily.primary/sans` → `font-primary`, `font-sans`
- `fontSize.xs/sm/base/lg/xl/2xl/3xl/4xl/5xl` → `text-xs`, `text-sm`, `text-base`, etc.
- `lineHeight.tight/normal/relaxed` → `leading-tight`, `leading-normal`, `leading-relaxed`
- `fontWeight.normal/medium/semibold/bold` → `font-normal`, `font-medium`, `font-semibold`, `font-bold`
- `letterSpacing.tight/normal/wide` → `tracking-tight`, `tracking-normal`, `tracking-wide`

**Spacing:**
- `spacing.0-24` → `p-0`, `p-1`, `p-2`, `p-3`, `p-4`, `p-5`, `p-6`, `p-7`, `p-8`, `p-9`, `p-10`, `p-12`, `p-14`, `p-16`, `p-18`, `p-20`, `p-24` (4px base grid)

**BorderRadius:**
- `borderRadius.none/sm/md/lg/xl/full` → `rounded-none`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`

**BoxShadow:**
- `shadows.none/sm/md/lg` → `shadow-none`, `shadow-sm`, `shadow-md`, `shadow-lg`

**Screens:**
- `breakpoints.sm/md/lg/xl/2xl` → `sm:*`, `md:*`, `lg:*`, `xl:*`, `2xl:*`

### CSS Variables
**File:** `src/index.css`
- No custom CSS variables found
- Only Tailwind directives: `@tailwind base/components/utilities`
- Base layer applies `antialiased` to html and `min-h-screen` to body

### Design System Conventions
**Existing patterns:**
- `bg-neutral-900` for main dark backgrounds
- `text-white` for primary text on dark
- `text-neutral-700` for secondary/muted text
- `border-neutral-200` for borders
- `bg-brand-primary-500` for primary actions
- `bg-success-500` for success states
- `bg-danger-500` for error states
- Semantic naming: `text-text-primary`, `bg-background-primary` (available but not widely used)

### Hardcoded Values Found

**Arbitrary Values (px):**
- `h-[54px]`, `h-[62px]`, `h-[52px]`, `h-[53px]` - Button/input heights
- `min-h-[44px]`, `min-h-[700px]` - Responsive min heights
- `px-6`, `py-4`, `py-3`, `py-1.5`, `py-2`, `py-2.5` - Padding (should use spacing tokens)
- `gap-2`, `gap-3`, `gap-4`, `gap-6`, `gap-8` - Gaps (should use spacing tokens)
- `w-[18px]`, `w-[90px]`, `w-[160px]`, `w-[438px]`, `w-[322px]` - Widths
- `leading-[22px]`, `leading-[28px]`, `leading-[44px]`, `leading-[54px]` - Line heights
- `text-[12px]`, `text-[13px]`, `text-[30px]`, `text-[38px]`, `text-[48px]` - Font sizes
- `rounded-[inherit]`, `rounded-xl`, `rounded-lg`, `rounded` - Border radius
- `tracking-tight` - Letter spacing

**Hardcoded Hex Colors:**
- `#1EBBE6`, `#1F36E6` - Gradients (should use `brand-primary-500`, `brand-secondary-500`)
- `#7c7c7c` - In Toggle component comment (should use `neutral-700`)
- `#00e177` - In Toggle component comment (should use `success-500`)
- `#101010` - In Toggle component comment (should use `neutral-100`)

**Inline Styles:**
- `backgroundImage: 'linear-gradient(...)'` - Should use Tailwind gradient utilities
- `shadow-[inset_0px_1px_2px_0px_rgba(...)]` - Should use shadow tokens if available

---

## STEP 2: Figma Variable Mapping

### Figma → Tailwind Token Mapping

**Colors:**
- Figma Colors → Already mapped in `tokens.ts` → Used via `tailwind.config.js`
- All color variables are available as Tailwind classes

**Scale (Spacing):**
- Figma Scale → Maps to `tokens.spacing` → Available as `p-{n}`, `m-{n}`, `gap-{n}`, etc.
- Common mappings:
  - 4px → `spacing.1` → `p-1`, `gap-1`, etc.
  - 8px → `spacing.2` → `p-2`, `gap-2`
  - 12px → `spacing.3` → `p-3`, `gap-3`
  - 16px → `spacing.4` → `p-4`, `gap-4`
  - 24px → `spacing.6` → `p-6`, `gap-6`

**Radius:**
- Figma Radius → Maps to `tokens.borderRadius` → Available as `rounded-{name}`
- Common: `rounded-sm` (4px), `rounded-md` (8px), `rounded-lg` (12px), `rounded-xl` (16px)

**Text Style:**
- Figma Text Styles → Maps to `tokens.typography` → Available as `text-{size}`, `leading-{name}`, `font-{weight}`, `tracking-{name}`

---

## Missing from Tailwind Config

**Gradient Utilities:**
- Need to add gradient support using brand colors
- Currently using inline styles for gradients

**Additional Spacing Values:**
- Some common values like `py-1.5` (6px), `py-2.5` (10px) are not in tokens
- May need to add: `1.5: '6px'`, `2.5: '10px'` to spacing scale

**Additional Line Heights:**
- `leading-[22px]` (22px) - Not in tokens as named value, but available via arbitrary value
- `leading-[28px]`, `leading-[44px]`, `leading-[54px]` - Similar situation

**Status Badge Component:**
- Currently inline spans, should be extracted to reusable component

# Product Requirements Document (PRD) - Subloop

**Status:** Single Source of Truth
**Last Updated:** Initial version

---

## ROLE

You are a senior full-stack product engineer building a production-ready SaaS app called Subloop.
You have access to the Figma designs, text styles, and color styles provided by the user.
Your task is to implement the full app and marketing site faithfully to the designs, with clean architecture and minimal scope.

---

## 1. PRODUCT OVERVIEW

Subloop is a minimal subscription manager that helps users:

- Discover existing subscriptions via email scanning
- Capture new subscriptions via a Chrome browser extension
- See total monthly and yearly spend
- Get calm, non-intrusive renewal reminders

**Core philosophy:**
- Read-only access
- User-initiated actions only
- No bank integrations
- No auto-saving without confirmation
- Clean black UI, no dashboards or charts

---

## 2. TECH ASSUMPTIONS (SAFE DEFAULTS)

If not specified otherwise:

- **Frontend:** React + TypeScript
- **Styling:** Tailwind (mapped to Figma tokens)
- **Auth:** Google OAuth + email/password
- **Backend:** REST or serverless API
- **Database:** simple relational or document DB
- **Payments:** Stripe
- **Email providers:** Gmail + Outlook
- **Browser extension:** Chrome (v1)

---

## 3. GLOBAL UI & NAVIGATION

**Top navigation (authenticated):**
- Subscriptions
- Settings

**Right side:**
- Get Pro
- User avatar → Profile

Active tab is route-based.

**Global rule:**
UI must match Figma spacing, typography, colors, and hierarchy exactly.

---

## 4. AUTH SCREENS

### 4.1 Create account

- **Route:** `/auth/signup`
- Sign up with Google
- Email + password form
- CTA: Create account
- Link to Login
- No permissions requested here

### 4.2 Login

- **Route:** `/auth/login`
- Login with Google
- Email + password
- Forgot password
- CTA: Login
- Link to Create account

---

## 5. ONBOARDING FLOW

### 5.1 Connect and scan emails

- **Route:** `/onboarding/email-scan`
- Explanation: billing & subscription emails only
- **Providers:**
  - Gmail (toggle)
  - Outlook (toggle)
  - iCloud (coming soon)
  - Other IMAP (coming soon)
- CTA: Scan emails
- Secondary: Skip for now
- Multiple inboxes supported.

### 5.2 Scan in progress

- **Route:** `/onboarding/scanning`
- Progress bar
- Text: "Scanning the last 12 months"
- List of connected inboxes + status
- Auto-redirect on completion

### 5.3 Browser reading (optional)

- **Route:** `/onboarding/browser-extension`
- Explain Chrome extension
- CTA: Add Chrome extension
- Secondary: Skip for now
- Trust copy: "Nothing is saved without your confirmation"

---

## 6. SUBSCRIPTIONS (CORE APP)

### 6.1 Subscriptions list

- **Route:** `/app/subscriptions`

**Features:**
- Search
- **Filters:**
  - Status
  - Payment method
- **Actions:**
  - Export
  - Add new
- **Table columns:**
  - Subscription
  - Price
  - Cycle
  - Payment method
  - Renewal date
  - Status
- **Row actions:** (view, edit, duplicate, delete)

**Totals at bottom:**
- Total monthly
- Total annually

**Renewal warning rule:**
- Show "Renews in X days" when renewal ≤ 7 days
- Informational only (no blocking)

### 6.2 Empty state

Shown when no subscriptions exist.

**Actions:**
- Add Chrome extension
- Scan emails
- Add manually

### 6.3 Subscription detail (read-only)

- **Route:** `/app/subscription/:id`

- Name + logo
- Status badge (Active / Review / Inactive)
- Price
- Cycle
- Payment method (or warning if unknown)
- Started on
- Renewal date
- Renewal warning if applicable
- CTA: Go to cancellation page
- Notes

Default click from list opens this view.

### 6.4 Review state

**Triggered when:**
- Payment method unknown
- Conflicting or missing data

**UI:**
- Dashed "Review" badge
- Inline helper text
- No blocking behavior

### 6.5 Add subscription

- **Route:** `/app/subscriptions/new`

**Fields:**
- Name (required)
- Price + currency
- Billing cycle
- Payment method
- Started on (optional)
- Renewal date (optional)
- Reminder checkbox (default ON): "Remind me 7 days before renewal"
- Status
- Notes

**CTA:**
- Add subscription
- Cancel

### 6.6 Edit subscription

- **Route:** `/app/subscription/:id/edit`

Same fields as Add.
CTA: Save changes

---

## 7. SETTINGS

**Route:** `/app/settings`

### 7.1 Email scanning

- List connected inboxes
- Status (Connected / Disconnected)
- Last scan date
- Toggle on/off
- Warning when disconnecting:
  "We'll stop scanning this inbox. Your subscriptions won't change."
- CTA: Rescan

### 7.2 Browser extension

Two states:
- Connected → show status
- Not connected → CTA: Add Chrome extension

---

## 8. PROFILE

**Route:** `/app/profile`

### Sections:

**Profile information**
- Avatar
- Name
- Email
- Auth provider
- Last login
- Log out

**Plan & usage**
- Current plan
- Connected inbox count
- Active / inactive subscriptions
- Get Pro CTA

**Privacy & data**
- Read-only email access explanation
- Data storage explanation
- Privacy Policy link

**Danger zone**
- Delete account
- Confirmation required

---

## 9. CHROME EXTENSION (V1)

**Purpose:**
Capture new subscriptions during signup flows

**Behavior:**
- Reads current domain + URL
- Detects checkout / billing pages
- User clicks "Save subscription"
- User confirms details
- Sends data to backend

**Rules:**
- No background scraping
- No auto-adding
- Source tagged as browser

---

## 10. MARKETING WEBSITE

**Routes:**
- `/`
- `/pricing`
- `/faq`

**Landing page**
- Hero: "Track all your subscriptions with a simple list"
- CTAs:
  - Connect your email
  - Add Chrome extension
- Trust note: Secure · Read-only · Cancel anytime
- 3 features only:
  - Email scan
  - Browser reading
  - Renewal alerts
- Pricing preview
- FAQ
- Footer

---

## 11. PRICING & PLANS

### Free
- Email scan (Gmail / Outlook)
- Limited subscriptions
- Manual edits
- Basic renewal reminders

### Pro (Monthly / Yearly)
- Unlimited subscriptions
- Smart renewal alerts
- Browser extension
- Export (CSV / XLS / PDF)

### Lifetime (optional)
- One-time payment
- Everything unlocked

**Rules:**
- No forced trials
- Cancel anytime
- No gating of core visibility

---

## 12. PAYMENTS

- Stripe checkout
- Simple upgrade flow
- Success confirmation
- No upsell modals

---

## 13. DATA MODEL (HIGH LEVEL)

**Subscription:**
- id
- name
- price
- currency
- cycle
- payment_method
- started_on
- renewal_date
- status
- notes
- source (email | browser | manual)

---

## 14. NON-GOALS (DO NOT BUILD)

- Bank integrations
- Spend charts
- AI predictions
- Auto-cancellation
- Push notifications by default
- Shared accounts

---

## 15. PRODUCT RULE (DO NOT VIOLATE)

**Subloop never acts on the user's behalf.**
**It only shows what exists and what's coming next.**

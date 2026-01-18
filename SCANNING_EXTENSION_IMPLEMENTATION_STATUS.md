# Email Scanning & Browser Extension Implementation Status

## Current Status: Mock Implementation Only

This document outlines what's currently implemented vs. what needs to be built according to the requirements.

---

## 1. EMAIL SCANNING FUNCTIONALITY

### ❌ **What's Missing/Not Working:**

#### A. OAuth Integration
- **Gmail OAuth:**
  - ❌ No Google OAuth flow implementation
  - ❌ No redirect to Google authorization URL
  - ❌ No handling of OAuth callback with authorization code
  - ❌ No token exchange for access/refresh tokens

- **Outlook OAuth:**
  - ❌ No Microsoft OAuth flow implementation
  - ❌ No redirect to Microsoft authorization URL
  - ❌ No handling of OAuth callback
  - ❌ No token exchange for access/refresh tokens

#### B. Token Management
- ❌ No secure token storage per user
- ❌ No token refresh logic when tokens expire
- ❌ No encryption for stored tokens
- ❌ No token expiration tracking

#### C. Email API Integration
- ❌ No Gmail API integration (no actual email fetching)
- ❌ No Microsoft Graph API integration (no actual email fetching)
- ❌ No email filtering (e.g., last 12 months)
- ❌ No email parsing to detect subscription signals

#### D. Subscription Detection
- ❌ No email parsing logic to extract:
  - Subscription names
  - Prices
  - Billing cycles
  - Payment methods
  - Renewal dates
- ❌ No pattern matching for subscription signals
- ❌ No heuristics to identify billing emails

#### E. Backend Integration
- ❌ No actual API calls to create email connections
- ❌ No backend endpoint integration for scanning
- ❌ No subscription creation from scanned emails
- ❌ No database writes for detected subscriptions

### ✅ **What's Currently Implemented (UI Only):**
- Toggle UI for selecting Gmail/Outlook providers
- Mock scanning progress page
- Settings page UI with rescan button
- Connected inboxes display (mock data)

---

## 2. BROWSER EXTENSION FUNCTIONALITY

### ❌ **What's Missing/Not Working:**

#### A. Chrome Extension Structure
- ❌ No `manifest.json` (Manifest V3)
- ❌ No extension directory structure
- ❌ No build configuration for extension
- ❌ Extension not packaged/loadable

#### B. Content Scripts
- ❌ No content script to detect signup/billing pages
- ❌ No DOM monitoring for subscription forms
- ❌ No detection of checkout/payment pages
- ❌ No pattern matching for subscription-related pages

#### C. Background Service Worker
- ❌ No background script (MV3 service worker)
- ❌ No message handling between content script and background
- ❌ No communication with backend API

#### D. Extension UI
- ❌ No popup UI for user confirmation
- ❌ No UI to show detected subscription candidate
- ❌ No interface to confirm/deny saving subscription

#### E. Backend Communication
- ❌ No API endpoint to receive subscription candidates from extension
- ❌ No endpoint to create/update subscriptions from extension
- ❌ No authentication mechanism for extension-to-backend communication
- ❌ No tagging of subscriptions with `source: 'browser'`

---

## 3. IMPLEMENTATION REQUIREMENTS

### Email Scanning Requirements:

1. **OAuth Flow Implementation:**
   ```
   User clicks "Connect Gmail" →
   Redirect to Google OAuth →
   User authorizes →
   Receive authorization code →
   Exchange for access_token + refresh_token →
   Store tokens securely →
   Mark email as connected
   ```

2. **Email Scanning Process:**
   ```
   Trigger scan →
   Fetch emails from last 12 months →
   Filter billing/subscription emails →
   Parse emails for subscription signals →
   Extract subscription data →
   Create/update subscription records in DB
   ```

3. **Token Refresh:**
   ```
   Check token expiration →
   If expired, use refresh_token →
   Get new access_token →
   Update stored tokens
   ```

### Browser Extension Requirements:

1. **Content Script:**
   - Monitor page URL changes
   - Detect checkout/billing/signup pages
   - Extract subscription information from page DOM
   - Send message to background script

2. **Background Service Worker:**
   - Receive messages from content script
   - Validate subscription data
   - Send to backend API
   - Handle responses

3. **Backend Endpoints:**
   - `POST /api/subscriptions/from-browser` - Receive subscription candidate
   - Validate and create/update subscription with `source: 'browser'`

---

## 4. FILES TO CREATE/UPDATE

### Email Scanning:
- `src/services/oauth/gmail.ts` - Gmail OAuth flow
- `src/services/oauth/outlook.ts` - Outlook OAuth flow
- `src/services/email/gmailApi.ts` - Gmail API client
- `src/services/email/outlookApi.ts` - Microsoft Graph API client
- `src/services/email/emailParser.ts` - Parse emails for subscription data
- `src/services/email/tokenManager.ts` - Token storage and refresh
- Update: `src/pages/Onboarding/EmailScan.tsx` - Implement OAuth flows
- Update: `src/pages/Settings/Settings.tsx` - Implement real rescan

### Browser Extension:
- `extension/manifest.json` - Extension manifest (MV3)
- `extension/background.js` or `extension/background.ts` - Service worker
- `extension/content.js` or `extension/content.ts` - Content script
- `extension/popup.html` - Extension popup UI
- `extension/popup.js` or `extension/popup.tsx` - Popup logic
- `vite.config.extension.ts` - Build config for extension
- Update backend: Add endpoint for browser-sourced subscriptions

---

## 5. NEXT STEPS

1. **Priority 1: Email Scanning OAuth**
   - Implement Gmail OAuth flow
   - Implement Outlook OAuth flow
   - Set up token storage

2. **Priority 2: Email API Integration**
   - Integrate Gmail API
   - Integrate Microsoft Graph API
   - Implement email fetching

3. **Priority 3: Email Parsing**
   - Build email parser for subscription signals
   - Implement subscription detection logic
   - Create subscriptions from parsed data

4. **Priority 4: Browser Extension**
   - Create extension structure
   - Build content script
   - Build background service worker
   - Create backend endpoint

5. **Priority 5: Token Refresh**
   - Implement automatic token refresh
   - Handle token expiration gracefully

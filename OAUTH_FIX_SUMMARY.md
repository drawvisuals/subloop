# Google OAuth Fix - Complete Implementation

## Root Cause Summary: Why `invalid_client` Happened

The `invalid_client` error occurred due to **multiple conflicting OAuth implementations**:

1. **Flow Mismatch**: Code was using `flow: 'auth-code'` (authorization code flow) which requires redirect URIs, but Google Cloud Console was likely configured for token flow (JavaScript origins only)
2. **Mixed Implementation**: Both redirect-based (`getGoogleAuthUrl`) and library-based (`useGoogleLogin`) OAuth were present, causing confusion
3. **Port/Origin Hardcoding**: References to `localhost:3000` instead of using runtime `window.location.origin`
4. **Client ID Validation**: No startup validation to catch invalid Client IDs early
5. **Missing Debug Info**: No way to verify what Client ID and origin were actually being used at runtime

## Files Changed

### New Files Created
1. **`src/components/OAuthConfigError.tsx`**
   - Startup error page when Client ID is invalid/missing
   - Shows current origin, Client ID, and fix instructions

2. **`src/components/OAuthDebugPanel.tsx`**
   - DEV-only debug panel showing runtime OAuth config
   - Displays origin, Client ID, scopes, and Google Cloud Console checklist

3. **`OAUTH_FIX_SUMMARY.md`** (this file)
   - Complete documentation of fixes

### Files Modified

1. **`src/main.tsx`**
   - ✅ Startup validation with regex: `/.+\.apps\.googleusercontent\.com$/`
   - ✅ Renders error page if Client ID invalid
   - ✅ Logs: `OAUTH_ORIGIN=<origin> CLIENT_ID=<clientId>`
   - ✅ Prevents app from rendering without valid Client ID

2. **`src/pages/Auth/SignUp.tsx`**
   - ✅ Changed from `flow: 'auth-code'` to **TOKEN FLOW** (removed flow parameter)
   - ✅ Uses `tokenResponse.access_token` directly (not code)
   - ✅ Fetches user info from Google API
   - ✅ Better error messages with Google Cloud Console link

3. **`src/pages/Auth/Login.tsx`**
   - ✅ Changed from `flow: 'auth-code'` to **TOKEN FLOW**
   - ✅ Uses `tokenResponse.access_token` directly
   - ✅ Fetches user info from Google API
   - ✅ Better error messages

4. **`src/pages/Marketing/Landing.tsx`**
   - ✅ Changed from `flow: 'auth-code'` to **TOKEN FLOW**
   - ✅ Uses `tokenResponse.access_token` directly
   - ✅ Removed unused `hasClientId` check

5. **`src/pages/Onboarding/EmailScan.tsx`**
   - ✅ Changed from `flow: 'auth-code'` to **TOKEN FLOW**
   - ✅ Uses `tokenResponse.access_token` directly

6. **`src/App.tsx`**
   - ✅ Added OAuth Debug Panel (DEV only)
   - ✅ Commented that `/auth/google/callback` route is not needed for token flow

7. **`src/services/googleOAuth.ts`**
   - ✅ Deprecated `getGoogleAuthUrl()` function (throws error if called)
   - ✅ Marked redirect-based flow as deprecated

8. **`src/services/googleOAuthHelpers.ts`**
   - ✅ Improved error handling for `invalid_client` errors

## Exact Google Cloud Console Configuration Required

**OAuth Client Type:** `Web application`

**Authorized JavaScript origins:**
```
http://localhost:3000
```
*(Note: Use the exact origin shown in the debug panel at runtime)*

**Redirect URIs:**
```
(Leave EMPTY - not required for token flow)
```

**Scopes to add in OAuth Consent Screen:**
- `openid`
- `email`
- `profile`
- `https://www.googleapis.com/auth/gmail.readonly`

## Confirmation: Redirect-Based OAuth Removed

✅ **All redirect-based OAuth code has been removed/disabled:**

1. ✅ `getGoogleAuthUrl()` function is deprecated and throws error
2. ✅ All `useGoogleLogin()` hooks now use **TOKEN FLOW** (no `flow: 'auth-code'`)
3. ✅ No `redirect_uri` parameters in OAuth requests
4. ✅ No `response_type=code` parameters
5. ✅ `/auth/google/callback` route exists but is not used (commented as not needed)
6. ✅ `GoogleCallback.tsx` component exists but is not referenced in active routes

**Current Implementation:**
- Uses `@react-oauth/google` library exclusively
- Token flow via popup (no redirects)
- Gets `access_token` directly from `tokenResponse`
- Uses runtime `window.location.origin` (no hardcoded ports)

## Verification Steps

After restarting dev server:

1. ✅ App starts without crashing
2. ✅ Debug panel (bottom right) shows:
   - Origin: `http://localhost:3000` (or actual port)
   - Client ID: Your Client ID
   - Flow: Token Flow (Popup)
3. ✅ Click "Sign up with Gmail" → Opens Google consent screen (not blocked)
4. ✅ If still blocked, check debug panel for exact Client ID being used
5. ✅ Console log shows: `OAUTH_ORIGIN=... CLIENT_ID=...`

## Troubleshooting

If you still see `invalid_client`:

1. Check debug panel for actual origin and Client ID
2. Verify Client ID in Google Cloud Console matches exactly
3. Ensure "Authorized JavaScript origins" includes the exact origin (including http/https and port)
4. Ensure "Redirect URIs" is **EMPTY** (token flow doesn't need redirects)
5. Verify OAuth Client Type is "Web application" (not Desktop app, etc.)
6. Wait 1-2 minutes after updating Google Cloud Console settings (they cache)

## What Changed: Before vs After

**BEFORE:**
- ❌ Used `flow: 'auth-code'` (required redirect URIs)
- ❌ Mixed redirect-based and library-based OAuth
- ❌ No startup validation
- ❌ Hardcoded port references
- ❌ No debug visibility

**AFTER:**
- ✅ Uses **TOKEN FLOW** (no redirect URIs needed)
- ✅ Only `@react-oauth/google` library
- ✅ Startup validation with error page
- ✅ Runtime origin detection
- ✅ Debug panel showing exact config

# Google OAuth Implementation Summary

## Overview
This document describes the Google OAuth implementation for Gmail authorization and signup flow in the Subloop application.

## Files Changed

### New Files Created
1. **`src/services/googleOAuth.ts`**
   - Google OAuth service with token management
   - Handles OAuth flow, token refresh, and validation
   - Scopes: `openid`, `email`, `profile`, `https://www.googleapis.com/auth/gmail.readonly`
   - Requests `access_type=offline` and `prompt=consent` for refresh tokens

2. **`src/services/gmailApi.ts`**
   - Gmail API integration for email scanning
   - Fetches messages from last 12 months
   - Extracts subscription signals from emails
   - Creates subscription records from detected emails

3. **`src/pages/Auth/GoogleCallback.tsx`**
   - OAuth callback handler page
   - Processes authorization code and redirects appropriately
   - Handles errors including missing refresh tokens

### Modified Files
1. **`src/App.tsx`**
   - Added route for `/auth/google/callback`

2. **`src/pages/Auth/SignUp.tsx`**
   - Updated to use Google OAuth flow instead of mock
   - Primary button now says "Sign up with Gmail"
   - Redirects to Google OAuth authorization URL

3. **`src/pages/Auth/Login.tsx`**
   - Updated to use Google OAuth flow instead of mock
   - Redirects to Google OAuth authorization URL

4. **`src/pages/Marketing/Landing.tsx`**
   - "Connect your email" CTA now directly starts Google OAuth flow
   - No longer links to signup page

5. **`src/pages/Onboarding/EmailScan.tsx`**
   - Gmail connection now uses full OAuth redirect flow
   - Automatically prompts for consent if reconnecting

6. **`src/pages/Onboarding/Scanning.tsx`**
   - Uses real Gmail API scanning via `scanGmailForSubscriptions()`
   - Shows actual scan progress

7. **`src/pages/Settings/Settings.tsx`**
   - Rescan button uses real Gmail API scanning

8. **`src/services/auth.ts`**
   - Exported `setAuthProvider()` function for OAuth service

## OAuth Scopes Requested

The following scopes are requested during Google OAuth:

```
openid
email
profile
https://www.googleapis.com/auth/gmail.readonly
```

## OAuth Parameters

- **`access_type=offline`**: Ensures refresh token is returned
- **`prompt=consent`**: Forces consent screen when reconnecting to ensure refresh token
- **`response_type=code`**: Authorization code flow
- **`state`**: CSRF protection using sessionStorage

## Token Management

### Access Token
- Stored in `EmailConnection` record
- Automatically refreshed when expired (within 5 minutes of expiration)
- Used for Gmail API requests

### Refresh Token
- Stored in `EmailConnection` record (never exposed in API responses)
- Used to refresh access tokens
- If missing, connection is treated as incomplete and user must reconnect

### Token Refresh Logic
- `getValidAccessToken()` checks token expiration
- If expired or about to expire (within 5 minutes), automatically refreshes
- Updates `EmailConnection` with new access token and expiration

## Flow Diagram

```
User clicks "Connect your email" / "Sign up with Gmail"
    ↓
getGoogleAuthUrl() → Redirects to Google OAuth
    ↓
User grants permissions
    ↓
Google redirects to /auth/google/callback?code=...&state=...
    ↓
handleGoogleCallback() exchanges code for tokens
    ↓
Creates/updates EmailConnection with tokens
    ↓
Redirects to /onboarding/scanning
    ↓
scanGmailForSubscriptions() fetches emails via Gmail API
    ↓
Extracts subscriptions and creates records
    ↓
Redirects to /app/subscriptions
```

## Gmail API Integration

### Email Fetching
- Fetches messages from last 12 months
- Processes in batches to respect rate limits
- Uses `getValidAccessToken()` to ensure valid token

### Subscription Detection
- Parses email headers (From, Subject)
- Extracts subscription signals (keywords: subscription, renewal, billing, etc.)
- Extracts price, currency, cycle, renewal date
- Creates `Subscription` records for detected subscriptions

## Environment Variables

Add to `.env`:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Backend Requirements (TODO for Production)

The following should be implemented on the backend for production:

1. **Token Exchange Endpoint** (`POST /api/oauth/google/exchange`)
   - Securely exchanges authorization code for tokens
   - Uses `GOOGLE_CLIENT_SECRET` (never exposed to frontend)

2. **Token Refresh Endpoint** (`POST /api/oauth/google/refresh`)
   - Refreshes access tokens using refresh token
   - Updates database with new tokens

3. **Gmail API Proxy** (Optional)
   - Proxies Gmail API requests through backend
   - Better security and rate limiting control

## Error Handling

### Missing Refresh Token
- Special error code: `REFRESH_TOKEN_MISSING`
- UI shows message to reconnect with explicit consent
- User must grant permissions again with `prompt=consent`

### Token Expiration
- Automatically handled via refresh token
- If refresh fails, connection marked as disconnected
- User must reconnect

### Gmail API Errors
- Logged to console
- Connection scan status updated with error message
- User can retry via Settings page

## Testing Checklist

- [ ] OAuth flow redirects correctly
- [ ] Callback handles authorization code
- [ ] Tokens are stored securely
- [ ] Refresh token is obtained and stored
- [ ] Token refresh works automatically
- [ ] Gmail API calls use valid tokens
- [ ] Email scanning detects subscriptions
- [ ] Subscriptions are created from emails
- [ ] Error states are handled gracefully
- [ ] Reconnection with consent works

## Security Notes

1. **Never expose CLIENT_SECRET in frontend code**
   - Token exchange MUST happen on backend in production

2. **State parameter for CSRF protection**
   - Validated on callback to prevent CSRF attacks

3. **Refresh tokens stored securely**
   - Never exposed in API responses
   - Only used server-side (or in secure storage)

4. **Token expiration**
   - Access tokens expire after 1 hour
   - Automatically refreshed before expiration

## Next Steps for Production

1. Implement backend token exchange endpoint
2. Implement backend token refresh endpoint
3. Replace mock Gmail API calls with real API calls
4. Add proper error handling and retry logic
5. Add rate limiting for Gmail API requests
6. Improve subscription detection algorithm (ML/NLP)
7. Add email parsing for common subscription formats
8. Add support for multiple email accounts
9. Add email filtering (only process billing/subscription emails)
10. Add scanning history and logs

# Fix for "Error 401: invalid_client"

## Problem
You're seeing: "The OAuth client was not found. Error 401: invalid_client"

This means Google doesn't recognize the Client ID in your `.env` file.

## Possible Causes

1. **Client ID doesn't exist** - It was deleted or never created
2. **Wrong Client ID** - Copied from wrong project or wrong credential
3. **Redirect URI mismatch** - The redirect URI configured in Google Cloud doesn't match
4. **Wrong project** - Client ID is from a different Google Cloud project

## Solution Steps

### Step 1: Verify Your Client ID in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select the correct project (top dropdown)
3. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
4. Find your OAuth 2.0 Client ID under "OAuth 2.0 Client IDs"
5. Click on the client ID to view details
6. **Copy the Client ID exactly** (it should end with `.apps.googleusercontent.com`)

### Step 2: Check Redirect URI

In the Client ID details, make sure these redirect URIs are added:
- `http://localhost:3000/auth/google/callback` (for development)

**Important:**
- No trailing slashes
- Exact match (including http vs https)
- No extra spaces

### Step 3: Update Your .env File

1. Open `.env` file in project root
2. Update the Client ID:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_correct_client_id_here.apps.googleusercontent.com
   ```
3. **Remove any duplicate suffixes** (should only have ONE `.apps.googleusercontent.com`)

### Step 4: Create New Client ID (If Needed)

If your Client ID doesn't exist:

1. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" > "OAuth client ID"
3. Application type: **Web application**
4. Name: `Subloop Web Client`
5. Authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
6. Click "Create"
7. Copy the new Client ID
8. Update your `.env` file
9. **Restart your dev server**

### Step 5: Verify OAuth Consent Screen

1. Go to [APIs & Services > OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)
2. Make sure:
   - App is published OR you're added as a test user
   - Required scopes are added:
     - `openid`
     - `email`
     - `profile`
     - `https://www.googleapis.com/auth/gmail.readonly`

### Step 6: Restart Dev Server

**Critical:** After updating `.env`, you MUST restart:
```bash
# Stop server (Ctrl+C)
npm run dev
```

## Verify It's Working

1. Check browser console - should NOT show "VITE_GOOGLE_CLIENT_ID is not set"
2. Click "Sign up with Gmail" or "Connect your email"
3. Should redirect to Google's OAuth page (not show error immediately)

## Common Mistakes

❌ **Wrong:** `VITE_GOOGLE_CLIENT_ID=123.apps.googleusercontent.com.apps.googleusercontent.com` (duplicate)
✅ **Correct:** `VITE_GOOGLE_CLIENT_ID=123.apps.googleusercontent.com`

❌ **Wrong:** Client ID from different project
✅ **Correct:** Client ID from the same project where Gmail API is enabled

❌ **Wrong:** Redirect URI is `http://localhost:3000/` (missing `/auth/google/callback`)
✅ **Correct:** `http://localhost:3000/auth/google/callback`

## Still Not Working?

1. Double-check the Client ID format in `.env` matches exactly what's in Google Cloud Console
2. Verify you're using the same Google account that created the Client ID
3. Try creating a brand new Client ID
4. Wait a few minutes after creating/updating credentials (Google caches them)
5. Clear browser cache and cookies
6. Check browser console for detailed error messages

# Google OAuth Troubleshooting Guide

## If Client ID is Correct But Still Getting `invalid_client`

### Step 1: Verify Runtime Values

1. **Open browser console** (F12)
2. **Look for**: `=== GOOGLE OAUTH DEBUG ===`
3. **Check the debug panel** (bottom-right corner) - shows:
   - Current origin
   - Client ID being used
   - Expected Google Cloud Console settings

### Step 2: Verify Google Cloud Console Configuration

Go to: https://console.cloud.google.com/apis/credentials

**For your OAuth 2.0 Client ID, you MUST have:**

1. **OAuth Client Type**: `Web application` (NOT Desktop app, iOS, Android, etc.)

2. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   ```
   *(Use the EXACT origin from debug panel - may be different port)*

3. **Authorized redirect URIs**:
   ```
   http://localhost:3000
   ```
   *(IMPORTANT: Even for token flow, the library uses redirect URIs. Add your origin here.)*

### Step 3: Common Issues

#### Issue: Client ID from Wrong Project
- **Symptom**: Client ID looks correct but doesn't work
- **Fix**: Make sure Client ID is from the SAME project where:
  - OAuth Consent Screen is configured
  - Gmail API is enabled
  - Your test users are added

#### Issue: Client Deleted/Revoked
- **Symptom**: Worked before, now doesn't
- **Fix**: Check if Client ID was deleted. Create new one if needed.

#### Issue: Origin Mismatch
- **Symptom**: Different port (e.g., 5173 vs 3000)
- **Fix**: Add BOTH origins to Google Cloud Console, or change Vite port to match

#### Issue: HTTP vs HTTPS
- **Symptom**: Localhost works, production doesn't (or vice versa)
- **Fix**: Add both HTTP and HTTPS origins if testing both

#### Issue: Client ID Has Trailing Space
- **Symptom**: Looks correct but still fails
- **Fix**: Check `.env` file for hidden spaces:
  ```env
  # WRONG
  VITE_GOOGLE_CLIENT_ID=123-abc.apps.googleusercontent.com

  # CORRECT (no trailing space)
  VITE_GOOGLE_CLIENT_ID=123-abc.apps.googleusercontent.com
  ```

#### Issue: Multiple .env Files
- **Symptom**: Changed .env but still sees old value
- **Fix**:
  - Check for `.env.local`, `.env.development` that might override
  - Restart dev server after changes

### Step 4: Verification Checklist

After updating Google Cloud Console:

- [ ] Saved changes in Google Cloud Console
- [ ] Waited 1-2 minutes (Google caches settings)
- [ ] Restarted dev server (for .env changes)
- [ ] Cleared browser cache
- [ ] Checked debug panel matches Console settings
- [ ] Verified OAuth Consent Screen has required scopes
- [ ] Added your email as test user (if app is External/unverified)

### Step 5: Test Configuration

1. Click "Sign up with Gmail"
2. If popup opens → Configuration is correct!
3. If you see `invalid_client` → Check:
   - Debug panel Client ID matches Console
   - Debug panel Origin matches Console authorized origins
   - Console has redirect URI set (even for token flow)

### Step 6: Enable Gmail API

Make sure Gmail API is enabled:
1. Go to: https://console.cloud.google.com/apis/library
2. Search "Gmail API"
3. Click "Enable"

### Still Not Working?

1. **Create a NEW OAuth Client ID** in Google Cloud Console:
   - Delete old one (or use new one)
   - Type: Web application
   - Add both JavaScript origins AND redirect URIs
   - Copy new Client ID to .env
   - Restart dev server

2. **Check OAuth Consent Screen**:
   - App name, email filled in
   - Scopes added: `openid`, `email`, `profile`, `https://www.googleapis.com/auth/gmail.readonly`
   - Test users added (your email)

3. **Verify Project**:
   - Make sure all settings are in the SAME Google Cloud Project
   - Check project dropdown in Console

## Exact Values to Set

Based on debug panel showing `http://localhost:3000`:

**Authorized JavaScript origins:**
```
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:3000
```

*(If your debug panel shows a different origin, use that instead)*

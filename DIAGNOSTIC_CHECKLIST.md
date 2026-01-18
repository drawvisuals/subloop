# OAuth Diagnostic Checklist

## Step 1: Check Browser Console (F12)

Open browser DevTools (F12) → Console tab, and look for:

```
=== GOOGLE OAUTH DEBUG ===
OAUTH_ORIGIN=...
CLIENT_ID=...
CLIENT_ID_FORMAT_VALID=...
CLIENT_ID_PREFIX=...
========================
```

**What to check:**
- ✅ `CLIENT_ID_FORMAT_VALID` should be `true`
- ✅ `CLIENT_ID` should end with `.apps.googleusercontent.com`
- ✅ `OAUTH_ORIGIN` should show your current URL (e.g., `http://localhost:3000`)

**If you see:**
- `CLIENT_ID=undefined` → `.env` file not loaded (restart dev server)
- `CLIENT_ID_FORMAT_VALID=false` → Client ID format is wrong
- Wrong origin → Port mismatch (dev server on different port)

---

## Step 2: Check Debug Panel (Bottom-Right Corner)

Look for a panel showing:
- **Origin**: Your current origin
- **Client ID**: Your Client ID (masked or full)
- **Flow**: Token Flow (Popup)
- **Google Cloud Console Checklist**: Required settings

**Note the exact origin shown** - this is what must be in Google Cloud Console.

---

## Step 3: Verify Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials

1. **Select your OAuth 2.0 Client ID**
2. **Check these settings match EXACTLY:**

   **OAuth Client Type**: `Web application`

   **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   ```
   *(Use the EXACT value from debug panel/console)*

   **Authorized redirect URIs**:
   ```
   http://localhost:3000
   ```
   *(Use the EXACT value from debug panel/console)*

**Important:**
- Must match protocol (`http` vs `https`)
- Must match port (e.g., `3000` vs `5173`)
- No trailing slashes
- Case sensitive

---

## Step 4: Common Issues & Fixes

### Issue: Origin Mismatch
**Symptom**: Console shows `http://localhost:5173` but Console has `http://localhost:3000`

**Fix**: Add BOTH origins to Google Cloud Console, OR change Vite port:
```javascript
// vite.config.ts
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Issue: Client ID Not Loading
**Symptom**: Console shows `CLIENT_ID=undefined`

**Fix**:
1. Check `.env` file exists in project root
2. Verify it has: `VITE_GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com`
3. **Restart dev server** (Ctrl+C, then `npm run dev`)
4. Check no spaces in `.env` file

### Issue: Format Invalid
**Symptom**: `CLIENT_ID_FORMAT_VALID=false`

**Fix**:
- Client ID must end with `.apps.googleusercontent.com`
- No duplicate suffixes
- No extra characters

### Issue: Redirect URI Mismatch
**Symptom**: `invalid_client` error still appears

**Fix**:
1. Copy EXACT origin from console/debug panel
2. Add to Google Cloud Console → Authorized redirect URIs
3. Save and wait 1-2 minutes
4. Clear browser cache
5. Try again

---

## Step 5: Test OAuth Flow

1. Click "Sign up with Gmail" button
2. **If popup opens** → Configuration is correct! ✅
3. **If error appears** → Check:
   - Network tab (F12 → Network) for the OAuth request
   - Look at the `redirect_uri` parameter in the request
   - Compare with what's in Google Cloud Console

---

## Step 6: Network Request Inspection

If still not working, check the actual OAuth request:

1. Open DevTools → Network tab
2. Click "Sign up with Gmail"
3. Look for request to `accounts.google.com` or `oauth2.googleapis.com`
4. Check the `redirect_uri` parameter in the request
5. Compare with Google Cloud Console settings

---

## What to Share With Me

Copy and paste:
1. Console output (the `=== GOOGLE OAUTH DEBUG ===` section)
2. Debug panel values (Origin, Client ID prefix)
3. Any error messages from OAuth popup
4. Your Google Cloud Console settings (screenshot or text)

Then I can give you exact next steps!

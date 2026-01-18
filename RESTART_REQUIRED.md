# ⚠️ CLIENT_ID=undefined Fix

## Problem
The console shows `CLIENT_ID=undefined`, which means Vite isn't loading your `.env` file.

## Solution: Restart Dev Server

**Vite only reads `.env` files when the dev server STARTS.** If you created or modified `.env` after starting the server, you must restart it.

### Steps:

1. **Stop the dev server:**
   - In the terminal where `npm run dev` is running
   - Press `Ctrl+C` (Windows) or `Cmd+C` (Mac)

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Check the console again:**
   - You should now see:
     ```
     CLIENT_ID=209262914423-5j7imguea4ohe1djlaeekob53h0tebk0.apps.googleusercontent.com
     CLIENT_ID_FORMAT_VALID=true
     ```

4. **Verify debug panel shows Client ID:**
   - Bottom-right corner should show your Client ID
   - Should show origin: `http://localhost:3000`

## After Restart, Next Steps:

Once you see `CLIENT_ID_FORMAT_VALID=true`:

1. **Check Google Cloud Console:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click your OAuth 2.0 Client ID
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000`
   - Save and wait 1-2 minutes

2. **Test OAuth:**
   - Click "Sign up with Gmail"
   - Should open popup now! ✅

---

**Note:** Any time you modify `.env`, you MUST restart the dev server for changes to take effect.

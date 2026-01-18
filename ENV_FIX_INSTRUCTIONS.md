# Environment Variable Loading Fix

## If CLIENT_ID is still undefined after restart:

### Step 1: Verify File Location
The `.env` file MUST be in the project root (same directory as `package.json` and `vite.config.ts`).

Check: Open terminal in project root and run:
```bash
ls .env
# or on Windows:
dir .env
```

### Step 2: Check for Hidden Characters
The `.env` file should have:
- No BOM (Byte Order Mark)
- No quotes around the value
- No trailing spaces
- Windows line endings (CRLF) are OK

### Step 3: Try Manual Encoding Fix

Delete the current `.env` file and recreate it:

**On Windows (PowerShell):**
```powershell
# Delete old file
Remove-Item .env -ErrorAction SilentlyContinue

# Create new file with explicit UTF-8 encoding (no BOM)
$content = "VITE_GOOGLE_CLIENT_ID=209262914423-5j7imguea4ohe1djlaeekob53h0tebk0.apps.googleusercontent.com"
[System.IO.File]::WriteAllText(".env", $content, [System.Text.UTF8Encoding]::new($false))
```

**Or manually:**
1. Delete `.env` file
2. Create new `.env` file
3. Paste exactly (no quotes):
   ```
   VITE_GOOGLE_CLIENT_ID=209262914423-5j7imguea4ohe1djlaeekob53h0tebk0.apps.googleusercontent.com
   ```
4. Save as UTF-8 (without BOM) if your editor has that option

### Step 4: Verify Vite is Reading It

After recreating `.env`, the console should show:
```
All VITE_ env vars: ['VITE_GOOGLE_CLIENT_ID']
import.meta.env: { ... VITE_GOOGLE_CLIENT_ID: '209262914423-...' }
```

If it doesn't show `VITE_GOOGLE_CLIENT_ID`, Vite isn't loading the file.

### Step 5: Check Vite Process

Make absolutely sure:
1. **The dev server process is completely stopped** (check Task Manager for any node/vite processes)
2. **Start fresh**:
   ```bash
   npm run dev
   ```
3. **Hard refresh browser** (Ctrl+Shift+R or Ctrl+F5)

### Step 6: Alternative - Use .env.local

Sometimes Vite prefers `.env.local`:

1. Create `.env.local` (same content as `.env`)
2. Restart dev server
3. Vite will prioritize `.env.local` over `.env`

### Step 7: Check Vite Config

If still not working, we can explicitly load env vars in `vite.config.ts` (shouldn't be necessary, but can help debug).

---

## Common Issues:

1. **File in wrong location**: Must be in project root (where `package.json` is)
2. **Hidden characters**: Copy/paste can introduce invisible characters
3. **File encoding**: Should be UTF-8 without BOM
4. **Process not fully killed**: Old dev server still running
5. **Browser cache**: Hard refresh needed

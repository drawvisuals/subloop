# Troubleshooting: Test User Still Not Working

## Verification Checklist

### 1. Verify Test User Was Actually Added

Go to: https://console.cloud.google.com/apis/credentials/consent

**Check:**
- Scroll to "Test users" section
- Look for `JGuimaraes000@gmail.com` in the list
- If it's NOT there, add it again
- If it IS there, continue to step 2

### 2. Check Email Match

**Critical:** The email must match EXACTLY:
- Test user: `JGuimaraes000@gmail.com`
- Google account you're signing in with: Must be `JGuimaraes000@gmail.com`

**If you're signing in with a different email**, either:
- Add that email as a test user too, OR
- Sign in with `JGuimaraes000@gmail.com` specifically

### 3. Check Google Cloud Project

**Make sure you're in the SAME project:**
- Where the OAuth Client ID was created
- Where test users are added
- Where OAuth Consent Screen is configured

**To verify:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Check the project dropdown (top of page)
3. Note the project name/ID
4. Go to: https://console.cloud.google.com/apis/credentials/consent
5. Verify it's the SAME project

### 4. Wait for Propagation

Google changes can take:
- **1-5 minutes** for most changes
- **Up to 30 minutes** sometimes

**Try this:**
1. Add test user (if not already added)
2. Wait 5 minutes
3. Clear browser cache (Ctrl+Shift+Delete)
4. Close ALL browser windows
5. Open fresh browser window
6. Try OAuth again

### 5. Check OAuth Consent Screen Status

In OAuth Consent Screen, check:
- **App status**: Should show "Testing" (not "Published")
- **Scopes**: Should include:
  - `openid`
  - `email`
  - `profile`
  - `https://www.googleapis.com/auth/gmail.readonly`

### 6. Alternative: Publish App (If You Have Access)

If test users still don't work, you can publish the app:

**⚠️ Warning:** Publishing may require verification for sensitive scopes like Gmail.

**Steps:**
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Scroll to bottom
3. Click "PUBLISH APP"
4. Confirm
5. Wait 5-10 minutes
6. Try OAuth again

**Note:** Published apps allow ANY Google user, but sensitive scopes may require Google verification.

---

## Step-by-Step Debug

1. **Open incognito/private window** (to avoid cache)
2. **Go to:** http://localhost:3000
3. **Open DevTools Console** (F12)
4. **Click "Sign up with Gmail"**
5. **When modal opens, check:**
   - What email is pre-selected?
   - Are you signing in with `JGuimaraes000@gmail.com`?
6. **After clicking, check the error:**
   - Does it show the exact email you're using?
   - Copy the full error message

---

## Common Issues

### Issue: Different Google Account
**Symptom:** You have multiple Google accounts, signing in with wrong one
**Fix:** In the OAuth modal, make sure to select `JGuimaraes000@gmail.com` specifically

### Issue: Email Mismatch
**Symptom:** Test user is `user@gmail.com` but signing in with `user@hotmail.com`
**Fix:** Add the exact email you're signing in with as a test user

### Issue: Wrong Project
**Symptom:** Test users added in Project A, but OAuth Client ID is in Project B
**Fix:** Make sure everything is in the same Google Cloud project

### Issue: Cache
**Symptom:** Changes made but still seeing old error
**Fix:** Clear browser cache, wait 5 minutes, try again

---

## Verify Everything is Correct

**Run through this checklist:**

- [ ] In Google Cloud Console, OAuth Consent Screen shows:
  - [ ] Status: "Testing"
  - [ ] Test users section lists: `JGuimaraes000@gmail.com`

- [ ] When you click "Sign up with Gmail":
  - [ ] Modal opens
  - [ ] You select/enter: `JGuimaraes000@gmail.com`
  - [ ] (Not a different email)

- [ ] OAuth Client ID credentials:
  - [ ] Same project as Consent Screen
  - [ ] Type: Web application
  - [ ] JavaScript origins: `http://localhost:3000`
  - [ ] Redirect URIs: `http://localhost:3000`

- [ ] You've waited at least 5 minutes after adding test user

- [ ] You've tried in incognito/private window

---

## Still Not Working?

If after all this it still doesn't work:

1. **Double-check the exact email you're using to sign in**
2. **Add that EXACT email as a test user** (case-sensitive)
3. **Wait 10 minutes**
4. **Try in incognito window**
5. **If still failing, try publishing the app** (if allowed)

Share the exact email you're using when the OAuth modal opens, and I can help further!

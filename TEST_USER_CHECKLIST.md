# Test User Issue - Complete Checklist

Since you've added the test user but it's still not working, let's verify everything step by step:

## ✅ Step-by-Step Verification

### 1. Verify Test User is Actually Listed

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Scroll down to **"Test users"** section
3. **Look for your email in the list** (don't just assume it's there)
4. If it's NOT in the list:
   - Click "ADD USERS"
   - Enter: `JGuimaraes000@gmail.com` (exactly, no typos)
   - Click "ADD"
   - **Wait for it to appear in the list**

### 2. Check Email Match (CRITICAL)

**The email you add as a test user MUST match EXACTLY the email you use to sign in.**

- [ ] Test user added: `JGuimaraes000@gmail.com`
- [ ] When OAuth modal opens, what email is shown/selected?
- [ ] Are you clicking on `JGuimaraes000@gmail.com` specifically in the modal?

**If you have multiple Google accounts:**
- Make sure you're selecting `JGuimaraes000@gmail.com` in the OAuth popup
- Not a different email like `user@hotmail.com` or another Gmail account

### 3. Verify Project Match

**Everything must be in the SAME Google Cloud project:**

1. Go to: https://console.cloud.google.com/apis/credentials
2. **Note the project name** at the top (e.g., "My Project" or project ID)
3. Go to: https://console.cloud.google.com/apis/credentials/consent
4. **Verify it's the same project** - check the project dropdown at the top
5. If different projects → That's the problem! Use the same project for everything

### 4. Check OAuth Consent Screen Status

In OAuth Consent Screen (https://console.cloud.google.com/apis/credentials/consent):

- [ ] **Publishing status**: Should say "Testing" (not "Published" or "In production")
- [ ] **User type**: Should be "External" (for testing)
- [ ] **Scopes**: Should include:
  - `openid`
  - `email`
  - `profile`
  - `https://www.googleapis.com/auth/gmail.readonly`

### 5. Wait and Clear Cache

1. **After adding test user**, wait **5-10 minutes** (Google can be slow)
2. **Clear browser cache**:
   - Chrome: Ctrl+Shift+Delete → Clear cached images and files
   - Or use Incognito/Private window
3. **Close ALL browser windows**
4. **Open fresh browser window**
5. **Try OAuth again**

### 6. Try Incognito/Private Window

1. Open Incognito/Private window (Ctrl+Shift+N)
2. Go to: http://localhost:3000
3. Click "Sign up with Gmail"
4. Select `JGuimaraes000@gmail.com` specifically
5. See if it works (bypasses cache issues)

### 7. Verify You're Adding to the Right App

When you go to OAuth Consent Screen, verify:
- **App name**: Should match "Subloop" (or whatever your app is called)
- **App domain**: Should be correct
- Make sure you're not accidentally editing a different OAuth app

---

## 🔍 Debug: What Email Are You Actually Using?

When the OAuth modal opens:
1. **Take a screenshot** of the modal
2. **Note which email is pre-selected** or which one you click
3. **Verify it matches** the test user email exactly

Common issues:
- Modal shows `ze_casal@hotmail.com` but test user is `JGuimaraes000@gmail.com` → Won't work!
- Modal shows `user@gmail.com` but test user is `user@hotmail.com` → Won't work!

---

## 🔄 Alternative: Publish App

If test users still don't work after all checks:

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Scroll to bottom
3. Click **"PUBLISH APP"** button
4. Confirm publishing
5. ⚠️ **Warning**: Published apps may require verification for sensitive scopes like Gmail
6. Wait 5-10 minutes
7. Try OAuth again

**Note**: Publishing allows ANY Google user (not just test users), but Gmail scope might require Google verification.

---

## 📝 Quick Verification Steps

**Do this in order:**

1. [ ] Open: https://console.cloud.google.com/apis/credentials/consent
2. [ ] Check "Test users" section - is `JGuimaraes000@gmail.com` actually in the list?
3. [ ] If not → Add it, wait for it to appear, then continue
4. [ ] Note the project name
5. [ ] Open: https://console.cloud.google.com/apis/credentials
6. [ ] Verify it's the SAME project
7. [ ] Click your OAuth Client ID
8. [ ] Verify Client ID matches your `.env` file
9. [ ] Close browser, wait 5 minutes
10. [ ] Open Incognito window
11. [ ] Go to http://localhost:3000
12. [ ] Click "Sign up with Gmail"
13. [ ] Select `JGuimaraes000@gmail.com` specifically (not a different account)
14. [ ] See if it works

---

## Still Not Working?

If after all this it still doesn't work, please provide:

1. **Screenshot** of the "Test users" section showing the list
2. **The exact email** that appears in the OAuth modal when you click "Sign up with Gmail"
3. **The project name/ID** you're using for both Credentials and Consent Screen
4. **When you added the test user** (how long ago?)

This will help identify what's still wrong!

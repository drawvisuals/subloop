# Fix: "Access blocked - App not verified" Error

## Problem
The Google OAuth modal opens, but you see:
```
Access blocked: Subloop has not completed the Google verification process
Error 403: access_denied
```

This means your app is in "Testing" mode and your email isn't added as a test user.

## Solution: Add Test User

### Step 1: Go to OAuth Consent Screen
1. Open: https://console.cloud.google.com/apis/credentials/consent
2. Make sure you're in the correct Google Cloud project

### Step 2: Add Your Email as Test User
1. Scroll down to **"Test users"** section
2. Click **"ADD USERS"** button
3. Enter your email: `JGuimaraes000@gmail.com`
4. Click **"ADD"**
5. You can add multiple test users if needed

### Step 3: Save and Wait
1. Make sure to **Save** any changes
2. Wait 1-2 minutes for changes to propagate
3. Try OAuth again - should work now! ✅

## Alternative: Publish App (For Production)

If you want to allow any Google user to sign in:

1. Go to OAuth Consent Screen
2. Scroll to bottom
3. Click **"PUBLISH APP"** button
4. Confirm publishing
5. ⚠️ Note: Published apps may require verification for sensitive scopes

**For development/testing, adding test users is recommended.**

## Quick Checklist

- [ ] Opened: https://console.cloud.google.com/apis/credentials/consent
- [ ] Clicked "ADD USERS" in Test users section
- [ ] Added: `JGuimaraes000@gmail.com`
- [ ] Saved changes
- [ ] Waited 1-2 minutes
- [ ] Tried OAuth again

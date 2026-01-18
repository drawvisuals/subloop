# Google OAuth Setup Guide

## Quick Fix for "Missing required parameter: client_id" Error

This error occurs because the Google OAuth Client ID is not configured. Follow these steps:

## Step 1: Create .env File

Create a `.env` file in the root directory of your project with the following content:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

## Step 2: Get Google OAuth Client ID

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click the project dropdown at the top
   - Click "New Project" or select an existing one

3. **Enable Gmail API**
   - Go to: https://console.cloud.google.com/apis/library
   - Search for "Gmail API"
   - Click on "Gmail API"
   - Click "Enable"

4. **Configure OAuth Consent Screen** (if not already done)
   - Go to: https://console.cloud.google.com/apis/credentials/consent
   - Select "External" user type (for testing)
   - Click "Create"
   - Fill in:
     - App name: `Subloop`
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue"
   - On "Scopes" page, click "Add or Remove Scopes"
   - Add these scopes:
     - `openid`
     - `email`
     - `profile`
     - `https://www.googleapis.com/auth/gmail.readonly`
   - Click "Update" then "Save and Continue"
   - On "Test users" page, click "Add Users"
   - Add your email address
   - Click "Save and Continue"
   - Review and click "Back to Dashboard"

5. **Create OAuth Client ID**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: Select **"Web application"**
   - Name: `Subloop Web Client`
   - Authorized redirect URIs: Add these:
     - `http://localhost:3000/auth/google/callback` (for development)
     - `https://yourdomain.com/auth/google/callback` (for production, when ready)
   - Click "Create"
   - **Copy the Client ID** (it looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
   - ⚠️ **DO NOT** share or commit the Client Secret - we don't need it for frontend

6. **Add Client ID to .env File**
   - Open your `.env` file
   - Replace `your_google_client_id_here.apps.googleusercontent.com` with your actual Client ID

## Step 3: Restart Development Server

**Important:** After adding the environment variable, you must restart the dev server:

1. Stop the current server (press `Ctrl+C` in the terminal)
2. Run `npm run dev` again
3. The new environment variable will be loaded

## Step 4: Test

1. Go to: http://localhost:3000
2. Click "Connect your email" or go to Sign Up page
3. Click "Sign up with Gmail"
4. You should be redirected to Google's OAuth page
5. Sign in and grant permissions
6. You'll be redirected back to the app

## Troubleshooting

### "Missing required parameter: client_id" Error
- ✅ Make sure `.env` file exists in the project root
- ✅ Make sure `VITE_GOOGLE_CLIENT_ID` is set correctly
- ✅ **Restart the dev server** after creating/updating `.env`
- ✅ Check that there are no extra spaces in the `.env` file

### "Redirect URI mismatch" Error
- ✅ Make sure `http://localhost:3000/auth/google/callback` is added to Authorized redirect URIs in Google Cloud Console
- ✅ Make sure there's no trailing slash in the redirect URI
- ✅ Wait a few minutes after updating redirect URIs (Google caches them)

### "Access blocked" Error
- ✅ Make sure your email is added as a test user in OAuth consent screen
- ✅ Make sure Gmail API is enabled
- ✅ Make sure all required scopes are added to the consent screen

### Environment Variable Not Loading
- ✅ Make sure the `.env` file is in the **root directory** (same level as `package.json`)
- ✅ Make sure the variable starts with `VITE_` prefix
- ✅ **Restart the dev server** - Vite only loads env vars on startup
- ✅ Check browser console for any errors

## Example .env File

```env
# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com

# Stripe Publishable Key (optional, for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
```

## Security Notes

- ⚠️ **Never commit `.env` file to git** (it's already in `.gitignore`)
- ⚠️ **Client Secret is NOT needed** for frontend OAuth - only Client ID
- ⚠️ For production, use separate OAuth credentials with production redirect URIs
- ⚠️ Keep your Client ID private - don't share it publicly

## Need Help?

If you're still having issues:
1. Check the browser console for error messages
2. Check the terminal where `npm run dev` is running
3. Verify your `.env` file format (no quotes around values)
4. Make sure the dev server was restarted after adding the env variable

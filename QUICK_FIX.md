# Quick Fix for 403 Error

## Most Common Cause: Email Mismatch

**The test user email must match EXACTLY the email you use to sign in.**

### Check This First:

1. **When OAuth modal opens**, what email is shown?
   - Is it `JGuimaraes000@gmail.com`?
   - Or a different email like `ze_casal@hotmail.com`?

2. **If it's a different email:**
   - Add THAT email as a test user too, OR
   - Make sure to select `JGuimaraes000@gmail.com` in the modal

### Quick Test:

1. **Open incognito window** (Ctrl+Shift+N)
2. Go to: http://localhost:3000
3. Click "Sign up with Gmail"
4. **When modal opens, note the email shown**
5. If it's NOT `JGuimaraes000@gmail.com`, that's the problem!

### Solution:

Either:
- **Option A**: Add the email shown in the modal as a test user
- **Option B**: Sign out of Google, sign in with `JGuimaraes000@gmail.com`, then try OAuth

---

## Second Most Common: Project Mismatch

**Everything must be in the same Google Cloud project.**

### Quick Check:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Note project name (top of page)
3. Go to: https://console.cloud.google.com/apis/credentials/consent
4. Verify it's the SAME project

If different → Use the same project for both!

---

## Third: Cache/Wait Time

1. **Wait 5-10 minutes** after adding test user
2. **Use incognito window**
3. **Clear browser cache**

---

## Still Not Working?

The error message in the UI should now show detailed instructions. Check what it says!

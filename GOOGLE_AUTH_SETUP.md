# Google Authentication Setup Guide

## Issues Fixed

1. ✅ Added missing `requests` library dependency
2. ✅ Fixed CORS configuration to support credentials
3. ✅ Added error handling for OAuth callback
4. ✅ Fixed redirect URLs to match actual frontend structure
5. ✅ Added login status notifications in frontend

## Important: Google Cloud Console Configuration

**CRITICAL STEP**: You must add the callback URL to your Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:5000/auth/google/callback
   ```
6. Click **Save**

## Running the Application

### 1. Start the Backend Server

```powershell
cd backend
python app.py
```

The backend will run on `http://localhost:5000`

### 2. Start the Frontend Server

Open a new terminal:

```powershell
cd frontend/hackathontrial
python -m http.server 3000
```

The frontend will be available at `http://localhost:3000/hackathontrial/`

### 3. Test Google Sign-In

1. Open `http://localhost:3000/hackathontrial/hackathontrial/login.html`
2. Click **Sign in with Google**
3. Select your Google account
4. You'll be redirected back to the site after successful authentication

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure `http://localhost:5000/auth/google/callback` is added to Google Cloud Console
- Check that both servers are running on the correct ports (backend:5000, frontend:3000)

### Error: "Invalid client"
- Verify your `client_id` and `client_secret` in `backend/app.py`
- Make sure they match your Google Cloud Console credentials

### CORS Errors
- Ensure the backend server is running
- Check that CORS is properly configured (already fixed)

### Session Not Persisting
- Make sure cookies are enabled in your browser
- Try clearing browser cache and cookies

## Security Notes

⚠️ **Before deploying to production:**

1. Change `app.secret_key` to a strong random string
2. Never commit OAuth credentials to version control
3. Use environment variables for sensitive data:
   ```python
   app.secret_key = os.environ.get('SECRET_KEY', 'dev-key-only')
   client_id = os.environ.get('GOOGLE_CLIENT_ID')
   client_secret = os.environ.get('GOOGLE_CLIENT_SECRET')
   ```

# Instagram Clone - Setup Instructions

## Environment Variables Setup

1. Create a `.env` file in the root directory
2. Copy the contents from `.env.example`
3. Replace the placeholder values with your actual Firebase configuration

```bash
# Create .env file
cp .env.example .env
```

Then edit `.env` with your Firebase credentials:

```
REACT_APP_FIREBASE_API_KEY=your_actual_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_actual_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_actual_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_actual_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
REACT_APP_FIREBASE_APP_ID=your_actual_app_id
```

## Firebase Configuration

Get your Firebase credentials from:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Copy the config values

## Important Notes

- **Never commit `.env` file to Git** - it's already in `.gitignore`
- The `.env.example` file is safe to commit (it has no real credentials)
- Restart your development server after changing `.env` values

## Installation

```bash
npm install
npm start
```

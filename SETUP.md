# Quick Setup Guide

## ⚠️ IMPORTANT: Add Your Google Gemini API Key

Before the app will work, you need to add your Google Gemini API key:

### Option 1: Create .env.local file manually
1. Create a file named `.env.local` in the root directory
2. Add this line:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
   ```
3. Replace `your_actual_api_key_here` with your real Gemini API key
4. Restart the dev server

### Option 2: Use PowerShell command
Run this in the project root (replace with your actual key):
```powershell
echo "GOOGLE_GENERATIVE_AI_API_KEY=your-key-here" > .env.local
```

## Getting a Google Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API key"
4. Choose "Create API key in new project" or select an existing project
5. Copy the key
6. Add it to `.env.local`

**Note:** Gemini has a generous free tier, so you can test the app without any costs!

## Test the App

Once you've added your API key:
1. The dev server should be running at http://localhost:3000
2. Fill in the form with:
   - Product: "I sell eco-friendly water bottles"
   - Audience: "College students interested in sustainability"
   
   OR click one of the "Example 1/2/3" buttons to auto-fill
3. Click "Generate Campaign"
4. Watch the magic happen! ✨

## Troubleshooting

**Error: "Failed to generate campaign"**
- Check that your API key is correct in `.env.local`
- Make sure you're using the correct environment variable name: `GOOGLE_GENERATIVE_AI_API_KEY`
- Restart the dev server after adding the key
- Check that you have API quota available (free tier is generous)

**Port 3000 already in use**
- Run: `npm run dev -- -p 3001` to use port 3001 instead

**API Key not being recognized**
- Make sure the `.env.local` file is in the root directory (same level as `package.json`)
- Check there are no extra spaces or quotes around the API key
- Restart the dev server completely (Ctrl+C, then `npm run dev`)

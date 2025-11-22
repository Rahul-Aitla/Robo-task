# Deployment Guide - Vercel

## Prerequisites
- GitHub account
- Vercel account (free tier is fine)
- OpenAI API key

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: CampaignAI Studio"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/campaign-studio.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

### 3. Add Environment Variables

In the Vercel project settings:
1. Go to "Settings" → "Environment Variables"
2. Add:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (starts with `sk-`)
   - **Environment**: Production, Preview, Development (select all)
3. Click "Save"

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete (~2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

### 5. Test Your Deployment

1. Visit your deployed URL
2. Try generating a campaign
3. If it works, you're done! 🎉

## Troubleshooting

### Build Fails
- Check the build logs in Vercel
- Ensure all dependencies are in `package.json`
- Make sure TypeScript has no errors

### API Errors in Production
- Verify your `OPENAI_API_KEY` is set correctly in Vercel
- Check you have credits in your OpenAI account
- Look at the Function Logs in Vercel dashboard

### Custom Domain (Optional)
1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

## Alternative Deployment Options

### Netlify
```bash
npm run build
# Deploy the .next folder
```

### Railway
1. Connect your GitHub repo
2. Add `OPENAI_API_KEY` environment variable
3. Deploy

### Docker (Self-hosted)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Post-Deployment Checklist

- [ ] App loads correctly
- [ ] Campaign generation works
- [ ] All copy buttons function
- [ ] Responsive design works on mobile
- [ ] SEO metadata is correct (check page source)
- [ ] No console errors

## Updating Your Deployment

Vercel auto-deploys when you push to `main`:
```bash
git add .
git commit -m "Update: description of changes"
git push
```

Your changes will be live in ~2 minutes!

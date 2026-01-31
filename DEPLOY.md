# Deploying ARIA Prototypes to Vercel

## Quick Deploy Guide

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Login to Vercel** (one-time setup):
   ```bash
   vercel login
   ```
   This will open your browser for authentication.

2. **Deploy to Production**:
   ```bash
   cd /Users/connectshadman/Documents/Vibe\ Coding/_work/aria-prototype
   vercel --prod
   ```

3. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `aria-prototype` (or your preference)
   - Directory? `.` (current directory)
   - Override settings? **N**

4. **Get your URLs**:
   - Main site: `https://aria-prototype.vercel.app`
   - Prototype 1: `https://aria-prototype.vercel.app/prototype1.html`
   - Prototype 2: `https://aria-prototype.vercel.app/prototype2.html`

### Option 2: Deploy via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/new
2. Import the GitHub repository (if you've pushed to GitHub)
   OR
3. Drag and drop the `/Users/connectshadman/Documents/Vibe Coding/_work/aria-prototype` folder
4. Click **Deploy**

### Option 3: GitHub Integration (Best for ongoing updates)

1. **Push to GitHub**:
   ```bash
   cd /Users/connectshadman/Documents/Vibe\ Coding/_work/aria-prototype
   git init
   git add .
   git commit -m "Add ARIA prototypes"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Import from GitHub
   - Select the aria-prototype repository
   - Click Deploy

3. **Automatic Deployments**:
   - Every push to `main` will automatically deploy

---

## Files Ready for Deployment

All files are in: `/Users/connectshadman/Documents/Vibe Coding/_work/aria-prototype`

- ✅ `index.html` - Landing page
- ✅ `prototype1.html` - Chat widget version  
- ✅ `prototype2.html` - Conversational search version
- ✅ `aria-engine.js` - Conversation engine
- ✅ `shared-styles.css` - Brand styles
- ✅ `prototype1.js` & `prototype2.js` - Interaction scripts
- ✅ `educations-logo.png` - Logo image
- ✅ `hero-image.png` - Hero background
- ✅ `vercel.json` - Deployment config
- ✅ `README.md` - Documentation

---

## After Deployment

### Share These URLs:
- **Landing Page**: `https://your-project.vercel.app`
- **Prototype 1**: `https://your-project.vercel.app/prototype1.html`
- **Prototype 2**: `https://your-project.vercel.app/prototype2.html`

### For Leadership Presentation:
1. Open landing page to show both options
2. Demo Prototype 1 first (familiar search + AI option)
3. Demo Prototype 2 second (conversational search)
4. Highlight key differences and use cases

---

## Troubleshooting

**If login times out:**
```bash
vercel logout
vercel login
```

**If deployment fails:**
- Ensure all files are in the correct directory
- Check `vercel.json` is valid
- Try deploying from dashboard instead

**Custom domain:**
After deployment, you can add a custom domain in Vercel dashboard:
Settings → Domains → Add Domain

# GitHub & Deployment Guide

This guide covers pushing your project to GitHub and deploying to Vercel (Frontend) and Railway/Render (Backend).

---

## 🚀 STEP 1: Prepare Your Local Repository

### 1.1 Initialize Git (if not already done)
```powershell
cd C:\Users\maste\OneDrive\Desktop\My_Inventory
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 1.2 Create or update `.gitignore`
Your `.gitignore` already exists and looks good! It includes:
- `backend/.venv/` - Python virtual environment
- `frontend/node_modules/` - Node dependencies
- `frontend/dist/` - Build artifacts
- `.env` - Environment files with secrets
- `__pycache__/` - Python cache files

> **⚠️ IMPORTANT**: Never commit `.env` file with real secrets!

---

## 📝 STEP 2: Push to GitHub

### 2.1 Create a GitHub Repository
1. Go to [github.com](https://github.com)
2. Click **"New"** button (top-left)
3. Repository name: `My_Inventory`
4. Description: `A complete inventory management system with FastAPI backend and React frontend`
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README (you already have one)
7. Click **"Create repository"**

### 2.2 Add Remote and Push Code
```powershell
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/My_Inventory.git

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Full-stack inventory management system"

# Push to GitHub (replace 'main' if you use 'master')
git branch -M main
git push -u origin main
```

### 2.3 Verify on GitHub
Visit `https://github.com/YOUR_USERNAME/My_Inventory` - your repo should now be live!

---

## 🌍 STEP 3: Prepare for Deployment

### 3.1 Backend Deployment (Vercel or Railway/Render)

#### Option A: Vercel (Recommended for Serverless)
Vercel can run FastAPI applications using serverless functions.

**Create `vercel.json` in backend root:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "app/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app/main.py"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url"
  }
}
```

**Requirements:**
- PostgreSQL database (use Vercel Postgres, Railway, or similar)
- Environment variable: `DATABASE_URL`

#### Option B: Railway or Render (Better for FastAPI)
These platforms are better suited for always-on applications.

**Create `render.yaml` for Render:**
```yaml
services:
  - type: web
    name: inventory-backend
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: DATABASE_URL
        scope: runtime
```

### 3.2 Frontend Deployment (Vercel - Recommended)

Vercel is perfect for React applications!

**Create `vercel.json` in frontend root:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@backend_url"
  }
}
```

---

## 🔧 STEP 4: Deploy Backend

### Option A: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → **"Deploy from GitHub repo"**
4. Connect your GitHub account and select `My_Inventory`
5. Railway will auto-detect and suggest FastAPI
6. Set environment variables:
   ```
   DATABASE_URL = (Railway provides PostgreSQL)
   ```
7. Deploy!

### Option B: Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create new → **"Web Service"**
4. Connect GitHub repository
5. Settings:
   - **Name**: `inventory-backend`
   - **Runtime**: Python 3.12
   - **Build command**: `pip install -r requirements.txt`
   - **Start command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables
7. Deploy!

### Option C: Deploy to Vercel (Advanced)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import repository
4. Select `backend` directory as root
5. Set up environment variables
6. Deploy!

---

## 🎨 STEP 5: Deploy Frontend

### Deploy to Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Import Project"** → Select your GitHub repo
4. **Framework Preset**: React
5. **Root Directory**: `frontend`
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`
8. **Environment Variables**:
   ```
   VITE_API_URL = https://your-backend-url.com
   ```
9. Click **"Deploy"**

Your frontend will be live at `https://your-project.vercel.app`

---

## 📊 STEP 6: Update API Base URL

After deploying backend, update frontend API URL:

**File: `frontend/src/api/client.js`**
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000';
```

This will use the `VITE_API_URL` environment variable from Vercel.

---

## 🔐 STEP 7: Environment Variables & Secrets

### Backend Variables Needed:
```
DATABASE_URL = postgresql://user:password@host:5432/dbname
```

### Frontend Variables Needed:
```
VITE_API_URL = https://your-backend-api.com
```

**Set these in deployment platform's dashboard (not in `.env` file)!**

---

## ✅ STEP 8: Final Checklist

- [ ] `.gitignore` includes `.env`
- [ ] `.env.example` is committed (without secrets)
- [ ] Repository pushed to GitHub
- [ ] Database setup on Railway/Render/Vercel
- [ ] Backend deployed with correct DATABASE_URL
- [ ] Frontend deployed with correct VITE_API_URL
- [ ] Test API endpoints from deployed frontend
- [ ] Enable CORS on backend for deployed frontend URL

---

## 🐛 Troubleshooting

### Backend won't start
```
Error: Cannot connect to PostgreSQL
```
**Solution**: Check `DATABASE_URL` environment variable is correct

### Frontend API calls fail
```
CORS error or 404 errors
```
**Solution**: Verify `VITE_API_URL` matches your backend domain

### Build fails
```
Dependencies not found
```
**Solution**: Ensure `requirements.txt` (backend) and `package.json` (frontend) are correct

---

## 📚 Useful Links

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Railway Deployment Docs](https://railway.app/docs)
- [Render Deployment Docs](https://render.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React + Vite Deployment](https://vitejs.dev/guide/build.html)



# GitHub & Deployment Checklist

## ✅ Pre-GitHub Checklist

- [ ] Project folder is NOT inside OneDrive sync (keep a copy outside if needed)
- [ ] `.gitignore` exists and looks correct
- [ ] `.env` file is in `.gitignore` (NOT tracked by git)
- [ ] `.env.example` has example values (IS tracked by git)
- [ ] Run `git status` and see no sensitive files

## 🔄 GitHub Commands to Run (In Order)

```powershell
# 1. Navigate to your project
cd C:\Users\maste\OneDrive\Desktop\My_Inventory

# 2. Check git status (should NOT show .env or venv)
git status

# 3. Initialize git if needed
git init

# 4. Configure git with your info
git config user.name "Your Full Name"
git config user.email "your.email@github.com"

# 5. Add all files
git add .

# 6. Create commit
git commit -m "Initial commit: Full-stack inventory management system"

# 7. Create GitHub repo at https://github.com/new
# Then add it as remote:
git remote add origin https://github.com/YOUR_USERNAME/My_Inventory.git

# 8. Push to GitHub
git branch -M main
git push -u origin main

# 9. Verify at https://github.com/YOUR_USERNAME/My_Inventory
```

---

## 🌐 Backend Deployment (Choose One)

### Option 1: Railway (⭐ RECOMMENDED)
**Pros:** Best for FastAPI, free credits, auto-detects, simple  
**Cons:** Free credits eventually run out

```
1. https://railway.app
2. Sign up with GitHub
3. New Project → Deploy GitHub Repo
4. Select My_Inventory
5. Railway auto-detects FastAPI
6. Environment Variables:
   - DATABASE_URL (provided by Railway Postgres)
7. Deploy
8. Copy backend URL (looks like: https://xxx.railway.app)
```

### Option 2: Render
**Pros:** Good free tier, easy dashboard  
**Cons:** Cold starts on free tier

```
1. https://render.com
2. New Web Service
3. Connect GitHub
4. Settings:
   - Name: inventory-backend
   - Runtime: Python 3.12
   - Build: pip install -r requirements.txt
   - Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
5. Add PostgreSQL database
6. Deploy
7. Copy backend URL (looks like: https://xxx.onrender.com)
```

### Option 3: Vercel + Serverless (Advanced)
**Pros:** Same CDN as frontend  
**Cons:** Requires Postgres adapter, more complex

```
1. https://vercel.com
2. Import Git repo
3. Root Directory: backend
4. Database: Add Vercel Postgres
5. Deploy
```

---

## 🎨 Frontend Deployment (⭐ ALWAYS Vercel)

```
1. https://vercel.com
2. Click "Import Project"
3. Select GitHub repo
4. Settings:
   Framework: React
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist

5. Environment Variables:
   VITE_API_URL = https://your-backend-url-here.railway.app
   (Replace with your actual backend URL from step above)

6. Click Deploy
7. Copy Frontend URL (looks like: https://xxx.vercel.app)
```

---

## 🗄️ Database Setup

### Option A: Railway Postgres (Easiest)
- Comes with Railway backend deployment
- Free tier included
- Just use the provided DATABASE_URL

### Option B: Supabase (Free & Reliable)
```
1. https://supabase.com
2. Create new project
3. Copy DATABASE_URL
4. Add to Railway/Render environment variables
```

### Option C: Neon (Serverless)
```
1. https://neon.tech
2. Create database
3. Copy connection string
4. Format: postgresql://user:password@host/dbname
5. Add to backend environment
```

---

## 🔐 Environment Variables Reference

### Backend Environment Variables
```
DATABASE_URL = postgresql://user:password@host:5432/dbname
POSTGRES_USER = inventory (only for local docker)
POSTGRES_PASSWORD = inventory (only for local docker)
POSTGRES_DB = inventory (only for local docker)
```

### Frontend Environment Variables
```
VITE_API_URL = https://your-deployed-backend.railway.app
```

**IMPORTANT:** Never put real values in `.env` file that's committed to GitHub!

---

## 🔗 Connecting Frontend to Backend

After backend is deployed, get its URL and add to Vercel:

1. Get backend URL from Railway/Render dashboard
2. Go to Vercel project settings
3. Environment Variables
4. Add:
   ```
   VITE_API_URL = https://your-backend-url.com
   ```
5. Redeploy (usually auto-redeploys)

---

## ✅ Post-Deployment Checklist

- [ ] GitHub repo created and code pushed
- [ ] Backend deployed and URL copied
- [ ] Database created with valid connection string
- [ ] Backend environment variable set
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set
- [ ] Visited frontend URL and got content
- [ ] Tested creating product (API call succeeded)
- [ ] Tested creating customer
- [ ] Checked network tab shows no CORS errors

---

## 🐛 Troubleshooting

### "git not found" error
```
Install Git: https://git-scm.com/download/win
Restart terminal after install
```

### "Could not resolve host: github.com"
```
Check internet connection
Or try: git remote set-url origin https://github.com/YOUR_USERNAME/My_Inventory.git
```

### Frontend shows "API Error"
```
1. Check VITE_API_URL is set in Vercel env
2. Backend URL might be wrong
3. Backend might be sleeping (free tier) - wait 1 min
```

### Backend won't start
```
1. Check DATABASE_URL is correct
2. Verify PostgreSQL is running
3. Check logs in Railway/Render dashboard
```

### Database connection fails
```
1. Test connection string locally
2. Check IP whitelist (if PostgreSQL requires it)
3. Verify database exists with correct name
```

---

## 📚 Useful Resources

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://railway.app/docs)
- [Render Docs](https://render.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React Vite Build](https://vitejs.dev/guide/build.html)

---

## 📞 Next Steps After Deployment

1. **Share your GitHub repo**
   ```
   https://github.com/YOUR_USERNAME/My_Inventory
   ```

2. **Share your live app**
   ```
   Frontend: https://xxx.vercel.app
   Backend API: https://xxx.railway.app/docs
   ```

3. **Optional: Enable auto-deployment**
   - GitHub Actions (we created a template)
   - Vercel auto-deploys on push to main
   - Railway auto-deploys on push to main

4. **Monitor your deployments**
   - Vercel Dashboard: https://vercel.com/dashboard
   - Railway Dashboard: https://railway.app/dashboard
   - Both show logs and usage stats

---

🎉 **You're ready to deploy!**



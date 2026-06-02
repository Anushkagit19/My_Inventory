# Deployment Configuration for My_Inventory

This directory contains deployment-related files and documentation.

## Files Overview

### Production Files
- `docker-compose.prod.yml` - Production Docker Compose with external env variables
- `backend/Dockerfile.prod` - Optimized Dockerfile for backend production builds
- `backend/vercel.json` - Vercel configuration for FastAPI backend
- `frontend/vercel.json` - Vercel configuration for React frontend
- `render.yaml` - Render.com deployment configuration

### GitHub Actions
- `.github/workflows/deploy.yml` - Auto-deployment workflow (optional)

## Quick Deploy Steps

### 1. Backend Deployment Options

#### **Railway** (Recommended - Best for Python/FastAPI)
```
Visit: https://railway.app
1. Connect GitHub
2. Create project from this repo
3. Railway auto-detects FastAPI
4. Set DATABASE_URL in environment
5. Deploy (auto on push to main)
```

#### **Render** (Alternative - Free tier available)
```
Visit: https://render.com
1. New Web Service
2. Connect GitHub repo
3. Settings:
   - Runtime: Python 3.12
   - Build: pip install -r requirements.txt
   - Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
4. Add PostgreSQL database
5. Set DATABASE_URL
```

#### **Vercel** (If using serverless)
```
Visit: https://vercel.com/new
1. Import repository
2. Root Directory: backend
3. Deploy
```

### 2. Frontend Deployment

#### **Vercel** (Recommended - Optimized for React/Vite)
```
Visit: https://vercel.com/new
1. Import repository
2. Root Directory: frontend
3. Build Command: npm run build
4. Output Directory: dist
5. Environment Variables:
   - VITE_API_URL = your-backend-api-url
6. Deploy
```

### 3. Database Setup

Choose one:
- **Railway Postgres** (Built-in, easiest)
- **Supabase** (Free PostgreSQL hosting)
- **Neon** (Serverless PostgreSQL)
- **AWS RDS** (Enterprise)

Get the DATABASE_URL connection string and add to backend environment.

## Environment Variables Checklist

### Backend Needs:
```
DATABASE_URL = postgresql://user:pass@host:5432/dbname
```

### Frontend Needs:
```
VITE_API_URL = https://your-deployed-backend.com
```

**Never commit real secrets to .env!** Use deployment platform's secret management.

## Monitoring & Logs

### Railway
- Dashboard: https://railway.app/dashboard
- View logs directly in UI
- Automatic error notifications

### Render
- Dashboard: https://dashboard.render.com
- Real-time logs in web UI
- Environment variable dashboard

### Vercel
- Dashboard: https://vercel.com/dashboard
- Analytics: Automatic
- Preview deployments: On every PR

## Common Issues & Solutions

### Backend deployment fails
- Check `DATABASE_URL` format
- Ensure Python 3.12+ compatible code
- Run `pip install -r requirements.txt` locally to verify

### Frontend won't load API
- Verify `VITE_API_URL` is set correctly
- Check backend CORS settings allow frontend domain
- Use browser dev tools to see actual API calls

### Database connection error
- Confirm DATABASE_URL is correct
- Add IP whitelist if needed
- Test connection locally first



@echo off
REM Quick Setup Script for GitHub & Deployment (Windows)
REM Run this script after cloning the repository

echo.
echo ================================
echo 🚀 My_Inventory Setup Script
echo ================================
echo.

REM Check if Git is initialized
if not exist ".git" (
    echo 📍 Initializing Git repository...
    git init
    git config user.name "Your Name"
    git config user.email "your.email@example.com"
)

REM Backend setup
echo.
echo ⚙️  Setting up Backend...
cd backend

REM Check Python version
python --version
echo ✓ Python is installed

REM Create virtual environment if it doesn't exist
if not exist "venv312" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv312

    REM Activate venv
    call venv312\Scripts\activate.bat

    REM Install dependencies
    echo 📥 Installing Python dependencies...
    pip install -r requirements.txt
) else (
    echo ✓ Virtual environment already exists
    call venv312\Scripts\activate.bat
)

cd ..

REM Frontend setup
echo.
echo ⚙️  Setting up Frontend...
cd frontend

REM Check Node version
node --version
echo ✓ Node is installed

REM Install npm dependencies
if not exist "node_modules" (
    echo 📥 Installing npm dependencies...
    npm install
) else (
    echo ✓ node_modules already exists
)

cd ..

REM Environment setup
echo.
echo ⚙️  Environment Configuration...
if not exist ".env" (
    echo 📋 Creating .env from .env.example...
    copy .env.example .env
    echo ⚠️  Please edit .env with your database credentials
) else (
    echo ✓ .env already exists
)

echo.
echo ================================
echo ✅ Setup Complete!
echo ================================
echo.
echo 📚 Next Steps:
echo 1. Edit .env with your database details
echo 2. Run 'docker-compose up' to start local development
echo 3. Frontend: http://localhost
echo 4. Backend API: http://localhost:8000
echo.
echo 🚀 For GitHub ^& Deployment:
echo    Read: GITHUB_DEPLOYMENT_GUIDE.md
echo    Or: DEPLOYMENT.md
echo.
pause


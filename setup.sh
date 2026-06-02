#!/bin/bash

# Quick Setup Script for GitHub & Deployment
# Run this script after cloning the repository

echo "================================"
echo "🚀 My_Inventory Setup Script"
echo "================================"

# Check if Git is initialized
if [ ! -d ".git" ]; then
    echo "📍 Initializing Git repository..."
    git init
    git config user.name "Your Name"
    git config user.email "your.email@example.com"
fi

# Backend setup
echo ""
echo "⚙️  Setting up Backend..."
cd backend

# Check Python version
PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $PYTHON_VERSION"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python -m venv venv

    # Activate venv
    source venv/bin/activate || . venv/Scripts/activate

    # Install dependencies
    echo "📥 Installing Python dependencies..."
    pip install -r requirements.txt
else
    echo "✓ Virtual environment already exists"
    source venv/bin/activate || . venv/Scripts/activate
fi

cd ..

# Frontend setup
echo ""
echo "⚙️  Setting up Frontend..."
cd frontend

# Check Node version
NODE_VERSION=$(node --version 2>&1)
echo "✓ Node version: $NODE_VERSION"

# Install npm dependencies
if [ ! -d "node_modules" ]; then
    echo "📥 Installing npm dependencies..."
    npm install
else
    echo "✓ node_modules already exists"
fi

cd ..

# Environment setup
echo ""
echo "⚙️  Environment Configuration..."
if [ ! -f ".env" ]; then
    echo "📋 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your database credentials"
else
    echo "✓ .env already exists"
fi

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "📚 Next Steps:"
echo "1. Edit .env with your database details"
echo "2. Run 'docker-compose up' to start local development"
echo "3. Frontend: http://localhost"
echo "4. Backend API: http://localhost:8000"
echo ""
echo "🚀 For GitHub & Deployment:"
echo "   Read: GITHUB_DEPLOYMENT_GUIDE.md"
echo "   Or: DEPLOYMENT.md"
echo ""


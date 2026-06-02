#!/usr/bin/env powershell

# GitHub Push Script for My_Inventory Project
# This script automates pushing your project to GitHub

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   My_Inventory - GitHub Push Script (Windows)              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get GitHub URL
Write-Host "📋 STEP 1: Enter Your GitHub Repository Information" -ForegroundColor Yellow
Write-Host ""
Write-Host "First, create a new repository at: https://github.com/new" -ForegroundColor Green
Write-Host "Then use the URL it gives you below." -ForegroundColor Green
Write-Host ""

$gitHubUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/My_Inventory.git)"

if ([string]::IsNullOrWhiteSpace($gitHubUrl)) {
    Write-Host "❌ Error: GitHub URL cannot be empty!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ GitHub URL: $gitHubUrl" -ForegroundColor Green
Write-Host ""

# Step 2: Get user info
Write-Host "📋 STEP 2: Configure Git User Information" -ForegroundColor Yellow
$userName = Read-Host "Enter your name (e.g., John Doe)"
$userEmail = Read-Host "Enter your GitHub email"

if ([string]::IsNullOrWhiteSpace($userName) -or [string]::IsNullOrWhiteSpace($userEmail)) {
    Write-Host "❌ Error: Name and email cannot be empty!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ Name: $userName" -ForegroundColor Green
Write-Host "✓ Email: $userEmail" -ForegroundColor Green
Write-Host ""

# Step 3: Confirm
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Ready to push? Summary:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Repository: $gitHubUrl"
Write-Host "  User Name:  $userName"
Write-Host "  User Email: $userEmail"
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  ✓ Initialize Git repository"
Write-Host "  ✓ Configure git user"
Write-Host "  ✓ Stage all files"
Write-Host "  ✓ Create first commit"
Write-Host "  ✓ Push to GitHub"
Write-Host ""

$confirm = Read-Host "Continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 4: Execute git commands
Write-Host "🚀 STEP 3: Executing Git Commands" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "1️⃣  Initializing Git repository..." -ForegroundColor Cyan
    git init
    if ($LASTEXITCODE -ne 0) { throw "Git init failed" }
    Write-Host "   ✓ Done" -ForegroundColor Green
    Write-Host ""

    Write-Host "2️⃣  Configuring git user..." -ForegroundColor Cyan
    git config user.name $userName
    git config user.email $userEmail
    Write-Host "   ✓ Done" -ForegroundColor Green
    Write-Host ""

    Write-Host "3️⃣  Checking git status..." -ForegroundColor Cyan
    Write-Host ""
    git status
    Write-Host ""
    Write-Host "   ⚠️  Make sure .env, venv312, node_modules are NOT listed!" -ForegroundColor Yellow
    Write-Host ""

    Write-Host "4️⃣  Staging all files..." -ForegroundColor Cyan
    git add .
    if ($LASTEXITCODE -ne 0) { throw "Git add failed" }
    Write-Host "   ✓ Done" -ForegroundColor Green
    Write-Host ""

    Write-Host "5️⃣  Creating initial commit..." -ForegroundColor Cyan
    git commit -m "Initial commit: Full-stack inventory management system with FastAPI backend and React frontend"
    if ($LASTEXITCODE -ne 0) { throw "Git commit failed" }
    Write-Host "   ✓ Done" -ForegroundColor Green
    Write-Host ""

    Write-Host "6️⃣  Adding GitHub as remote..." -ForegroundColor Cyan
    git remote add origin $gitHubUrl
    if ($LASTEXITCODE -ne 0) { throw "Git remote add failed" }
    Write-Host "   ✓ Done" -ForegroundColor Green
    Write-Host ""

    Write-Host "7️⃣  Renaming branch to main..." -ForegroundColor Cyan
    git branch -M main
    if ($LASTEXITCODE -ne 0) { throw "Git branch rename failed" }
    Write-Host "   ✓ Done" -ForegroundColor Green
    Write-Host ""

    Write-Host "8️⃣  Pushing to GitHub..." -ForegroundColor Cyan
    Write-Host "   (This may take a minute and ask for authentication...)" -ForegroundColor Yellow
    git push -u origin main
    if ($LASTEXITCODE -ne 0) { throw "Git push failed" }
    Write-Host "   ✓ Done" -ForegroundColor Green
    Write-Host ""

    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ SUCCESS! Your code is now on GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 View your repository at:" -ForegroundColor Yellow
    Write-Host "   $gitHubUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📚 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Read QUICK_START.md for deployment instructions"
    Write-Host "   2. Deploy backend to Railway or Render"
    Write-Host "   3. Deploy frontend to Vercel"
    Write-Host "   4. Connect database and test everything"
    Write-Host ""
    Write-Host "📖 Documentation files:" -ForegroundColor Yellow
    Write-Host "   • QUICK_START.md - Fast reference"
    Write-Host "   • DEPLOYMENT.md - Detailed deployment guide"
    Write-Host "   • DEPLOYMENT_CHECKLIST.md - Step-by-step checklist"
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   • Make sure Git is installed: git --version"
    Write-Host "   • Make sure GitHub URL is correct"
    Write-Host "   • Check internet connection"
    Write-Host "   • May need GitHub authentication (token/SSH key)"
    Write-Host ""
    Write-Host "For help, read: GITHUB_SETUP_INSTRUCTIONS.md" -ForegroundColor Yellow
    exit 1
}


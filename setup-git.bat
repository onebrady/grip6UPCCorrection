@echo off
echo 🚀 Setting up Git repository and pushing to GitHub...

REM Initialize Git repository
git init

REM Add all files
git add .

REM Create initial commit
git commit -m "Initial commit: UPC Management Dashboard

- Modern React/TypeScript dashboard for UPC management
- Smart filtering (excludes test products, products without SKUs, products with existing UPCs)
- Inline UPC editing with SKU-specific updates
- Local storage persistence
- Export functionality
- Beautiful responsive UI with Tailwind CSS
- Ready for Vercel deployment"

REM Add remote repository
git remote add origin https://github.com/onebrady/grip6UPCCorrection.git

REM Push to master branch
git branch -M master
git push -u origin master

echo ✅ Successfully pushed to GitHub!
echo 📱 Your repository is now live at: https://github.com/onebrady/grip6UPCCorrection
echo.
echo 🌐 To deploy to Vercel:
echo 1. Go to https://vercel.com
echo 2. Import your GitHub repository
echo 3. Deploy automatically!
pause 
@echo off
setlocal enabledelayedexpansion

echo ===============================
echo Mini-blog: start (Backend + Frontend)
echo ===============================

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install Node.js LTS and run again.
  pause
  exit /b 1
)

REM Go to project root (directory of this .bat)
cd /d "%~dp0"

if not exist "backend\package.json" (
  echo [ERROR] Missing backend\package.json. You are running .bat from wrong folder.
  pause
  exit /b 1
)

echo [1/2] Installing backend dependencies (only if needed)...
pushd backend
if not exist "node_modules\" (
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    popd
    pause
    exit /b 1
  )
) else (
  echo (node_modules exists - skip npm install)
)
popd

echo [2/2] Starting backend on http://localhost:3000 ...
echo Frontend static files available in: backend/frontend/
echo.
start "mini-blog-backend" cmd /k "cd /d %~dp0backend && npm run dev"

echo.
echo Done. Backend is starting...
echo.
echo Access via:
echo - Render (production): https://mini-blog-d103.onrender.com
echo - GitHub Pages: https://katyakkk33.github.io/mini-blog/
echo - Local: http://localhost:3000 (API + static files)
echo.
echo Debug:
echo - http://localhost:3000/?debug=1
echo.
pause
pause

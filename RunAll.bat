@echo off
setlocal enabledelayedexpansion

echo ===============================
echo Mini-blog: START (Backend + Frontend)
echo ===============================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install Node.js LTS first.
  pause
  exit /b 1
)

REM Go to project root directory
cd /d "%~dp0"

REM Check if backend exists
if not exist "backend\package.json" (
  echo [ERROR] Missing backend\package.json. Wrong directory!
  pause
  exit /b 1
)

REM Install backend dependencies if needed
echo [1/2] Installing backend dependencies...
pushd backend
if not exist "node_modules" (
  echo Installing npm packages...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed!
    popd
    pause
    exit /b 1
  )
) else (
  echo node_modules exists - skipping npm install
)
popd

REM Start backend server
echo.
echo [2/2] Starting backend server...
echo.
echo Frontend static files: backend/frontend/
start "mini-blog-backend" cmd /k "cd /d %~dp0backend && npm run dev"

echo.
echo ===================================
echo Backend should be starting...
echo ===================================
echo.
echo Access the app:
echo - Local: http://localhost:3000
echo - Debug: http://localhost:3000/?debug=1
echo.
echo Production versions:
echo - Render: https://mini-blog-d103.onrender.com
echo - GitHub Pages: https://katyakkk33.github.io/mini-blog/
echo.
echo Press any key to close this window...
pause

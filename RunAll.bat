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

echo [1/4] Installing backend dependencies (only if needed)...
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

echo [2/4] Starting backend on http://localhost:3000 ...
start "mini-blog-backend" cmd /k "cd /d %~dp0backend && npm run dev"

echo [3/4] Starting frontend static server on http://localhost:5173 ...
start "mini-blog-frontend" cmd /k "cd /d %~dp0 && npx --yes serve frontend -l 5173"

echo [4/4] Done.
echo Open:
echo - http://localhost:5173
echo Debug:
echo - http://localhost:5173/?debug=1
echo.
pause

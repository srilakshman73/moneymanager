@echo off
echo ==========================================
echo   Money Manager App - Automatic Setup
echo ==========================================

echo.
echo [1/2] Installing Dependencies...
call npm run install-all

echo.
echo [2/2] Starting Servers...
echo Starting Backend and Frontend concurrently...
call npm run dev

pause

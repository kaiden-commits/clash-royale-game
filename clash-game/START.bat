@echo off
title Neon Blitz Tactics Launcher
cd /d "%~dp0"
echo Starting Neon Blitz Tactics server...
start "Neon Blitz Server" cmd /k node server.js
echo Waiting for the server to come up...
timeout /t 2 /nobreak >nul
echo Opening Player 1 and Player 2 windows...
start "" "http://localhost:3000"
start "" "http://localhost:3000?p=2"
echo.
echo Done. Two browser windows should be open:
echo   Player 1: http://localhost:3000
echo   Player 2: http://localhost:3000?p=2
echo Keep the server window open while you play.
echo If a window says node is not recognized, install Node.js from nodejs.org.
timeout /t 4 /nobreak >nul

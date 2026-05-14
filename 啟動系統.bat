@echo off
chcp 65001 >nul
echo =========================================
echo       正在啟動 SECS 專案進度系統...
echo =========================================
echo.
echo 系統啟動後會自動開啟瀏覽器，請稍候。
echo (若要關閉系統，請直接關閉此黑色視窗)
echo.

set PATH=C:\Users\Lu\CLAUDE-CC;%PATH%
cd /d "%~dp0"
call npm run dev

@echo off
echo 🚀 Syncing Radiology Portfolio to GitHub...
git add .
git commit -m "Auto-sync update: %date% %time%"
git push origin main
echo ✅ Sync Complete!
pause

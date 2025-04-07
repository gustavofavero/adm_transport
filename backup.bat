@echo off
echo Realizando backup no GitHub...
git add .
git commit -m "Backup automático"
git push
pause

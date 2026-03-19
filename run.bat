@echo off
echo Starting LifeQuest...
cd /d "F:\Рабочий стол\игры\Learn\0JS-Again\Study\life-quest"
npm install
if %errorlevel% neq 0 (
  echo Error installing dependencies
  pause
  exit /b 1
)
cmd /k npm run dev
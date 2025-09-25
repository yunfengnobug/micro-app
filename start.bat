@echo off
echo ====================================
echo    微前端项目启动脚本
echo ====================================
echo.
echo 正在启动所有项目...
echo - 主应用: http://localhost:8000
echo - 子应用1: http://localhost:8001
echo - 子应用2: http://localhost:8002
echo.
echo 按 Ctrl+C 停止所有服务
echo ====================================
echo.

npm run dev

pause

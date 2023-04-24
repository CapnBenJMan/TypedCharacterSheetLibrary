@echo off

echo %~0
echo %cd%
echo %__CD__%

call git add .

set /p "message=Enter commit message: "

call git commit -m "%message%"

call git push

call clasp push
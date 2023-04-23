@echo off

@REM call git add .

@REM if "%1" == "" (
@REM 	call git commit
@REM ) else (
@REM 	call git commit -m "%1"
@REM )

echo %~0
echo %cd%
echo %__CD__%
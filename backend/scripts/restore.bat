@echo off
REM Restore the SQLite database from a backup
set BACKUP_DIR=backups

if not exist "%BACKUP_DIR%" (
    echo Backup directory not found: %BACKUP_DIR%
    exit /b 1
)

echo Available backups:
dir /b /o-n "%BACKUP_DIR%\backup_*.db"

echo.
set /p SELECTION="Enter backup filename to restore (or press Enter for most recent): "

if "%SELECTION%"=="" (
    for /f "delims=" %%i in ('dir /b /o-n "%BACKUP_DIR%\backup_*.db" ^| findstr /n "^1:" ^| findstr /c:"1:"') do (
        for %%j in ("%%i") do set SELECTION=%%~nxi
    )
)

if not exist "%BACKUP_DIR%\%SELECTION%" (
    echo Backup not found: %SELECTION%
    exit /b 1
)

set /p CONFIRM="This will replace the current database. Continue? (y/N): "
if "%CONFIRM%" neq "y" if "%CONFIRM%" neq "Y" (
    echo Restore cancelled.
    exit /b 0
)

set DB_PATH=prisma\dev.db
copy "%BACKUP_DIR%\%SELECTION%" "%DB_PATH%"
echo Database restored from: %SELECTION%
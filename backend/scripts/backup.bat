@echo off
REM Backup the SQLite database
set TIMESTAMP=%date:~-4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_DIR=backups
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

set DB_PATH=prisma\dev.db
set BACKUP_FILE=%BACKUP_DIR%\backup_%TIMESTAMP%.db

if exist "%DB_PATH%" (
    copy "%DB_PATH%" "%BACKUP_FILE%"
    echo Backup created: %BACKUP_FILE%
) else (
    echo Database file not found: %DB_PATH%
    exit /b 1
)

REM Keep only the last 10 backups
for /f "skip=10 delims=" %%i in ('dir /b /o-n "%BACKUP_DIR%\backup_*.db"') do del "%BACKUP_DIR%\%%i"

echo Backup completed. Current backups:
dir /b "%BACKUP_DIR%\backup_*.db"
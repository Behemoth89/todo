#!/bin/bash

# Backup the SQLite database
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

DB_PATH="./prisma/dev.db"
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.db"

if [ -f "$DB_PATH" ]; then
    cp "$DB_PATH" "$BACKUP_FILE"
    echo "Backup created: $BACKUP_FILE"
else
    echo "Database file not found: $DB_PATH"
    exit 1
fi

# Keep only the last 10 backups
ls -t "$BACKUP_DIR"/backup_*.db | tail -n +11 | xargs -r rm

echo "Backup completed. Current backups:"
ls -lh "$BACKUP_DIR"
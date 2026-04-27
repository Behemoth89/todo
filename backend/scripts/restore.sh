#!/bin/bash

# Restore the SQLite database from a backup
BACKUP_DIR="./backups"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "Backup directory not found: $BACKUP_DIR"
    exit 1
fi

echo "Available backups:"
ls -1t "$BACKUP_DIR"/backup_*.db 2>/dev/null

echo ""
echo -n "Enter backup filename to restore (or press Enter for most recent): "
read SELECTION

if [ -z "$SELECTION" ]; then
    SELECTION=$(ls -1t "$BACKUP_DIR"/backup_*.db | head -1)
fi

if [ ! -f "$BACKUP_DIR/$SELECTION" ]; then
    echo "Backup not found: $SELECTION"
    exit 1
fi

echo -n "This will replace the current database. Continue? (y/N): "
read CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "Restore cancelled."
    exit 0
fi

DB_PATH="./prisma/dev.db"
cp "$BACKUP_DIR/$SELECTION" "$DB_PATH"
echo "Database restored from: $SELECTION"
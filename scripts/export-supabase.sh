#!/bin/bash

# Supabase Export Script
# Replace these variables with your actual values

SUPABASE_HOST="db.yfudntcihbkanjavsggz.supabase.co"
SUPABASE_DB="postgres"
SUPABASE_USER="postgres"
SUPABASE_PORT="5432"
OUTPUT_FILE="supabase_backup_$(date +%Y%m%d_%H%M%S).sql"


echo "🚀 Starting Supabase database export..."
echo "Host: $SUPABASE_HOST"
echo "Database: $SUPABASE_DB"
echo "Output: $OUTPUT_FILE"
echo ""

# Check if pg_dump is installed
if ! command -v pg_dump &> /dev/null; then
    echo "❌ Error: pg_dump is not installed"
    echo "Please install PostgreSQL client tools first"
    exit 1
fi

# Prompt for password
echo -n "Enter database password: "
read -s PGPASSWORD
echo ""
export PGPASSWORD

# Run pg_dump with error handling
echo "📦 Exporting database..."
if pg_dump \
    -h "$SUPABASE_HOST" \
    -U "$SUPABASE_USER" \
    -d "$SUPABASE_DB" \
    -p "$SUPABASE_PORT" \
    --schema=public \
    --no-owner \
    --no-privileges \
    --verbose \
    --no-password \
    -f "$OUTPUT_FILE" 2>&1 | tee export.log; then
    
    echo "✅ Export completed successfully!"
    echo "📄 Backup saved to: $OUTPUT_FILE"
    echo "📊 File size: $(ls -lh $OUTPUT_FILE | awk '{print $5}')"
else
    echo "❌ Export failed! Check export.log for details"
    exit 1
fi

# Clean up
unset PGPASSWORD
rm -f export.log

echo ""
echo "🎯 Next steps:"
echo "1. Review the exported file: $OUTPUT_FILE"
echo "2. Import to Neon using:"
echo "   psql YOUR_NEON_CONNECTION_STRING < $OUTPUT_FILE"
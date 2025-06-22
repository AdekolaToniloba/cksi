// scripts/migrate-data.ts
import { createClient } from "@supabase/supabase-js";
import { Pool } from "@neondatabase/serverless";

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const NEON_DATABASE_URL = process.env.DATABASE_URL!;

// Initialize clients
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const neonPool = new Pool({ connectionString: NEON_DATABASE_URL });

async function migrateTable(tableName: string, batchSize = 100) {
  console.log(`Migrating ${tableName}...`);

  let offset = 0;
  let hasMore = true;
  let totalMigrated = 0;

  while (hasMore) {
    // Fetch batch from Supabase
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .range(offset, offset + batchSize - 1);

    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      break;
    }

    if (!data || data.length === 0) {
      hasMore = false;
      break;
    }

    // Insert batch into Neon
    const client = await neonPool.connect();
    try {
      await client.query("BEGIN");

      for (const row of data) {
        const columns = Object.keys(row);
        const values = Object.values(row);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

        const insertQuery = `
          INSERT INTO ${tableName} (${columns.join(", ")})
          VALUES (${placeholders})
          ON CONFLICT (id) DO NOTHING
        `;

        await client.query(insertQuery, values);
      }

      await client.query("COMMIT");
      totalMigrated += data.length;
      console.log(`  Migrated ${totalMigrated} rows...`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(`Error inserting into ${tableName}:`, err);
      throw err;
    } finally {
      client.release();
    }

    offset += batchSize;
    hasMore = data.length === batchSize;
  }

  console.log(`✓ Completed migrating ${tableName}: ${totalMigrated} rows`);
}

async function main() {
  console.log("Starting data migration from Supabase to Neon...\n");

  const tables = [
    "admin_users",
    "blog_posts",
    "programs",
    "gallery_items",
    "homepage_content",
    "donations",
  ];

  try {
    for (const table of tables) {
      await migrateTable(table);
    }

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await neonPool.end();
  }
}

// Run migration
main().catch(console.error);

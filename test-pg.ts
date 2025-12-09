import { Pool } from "pg";
import "dotenv/config";

async function testPg() {
  const connectionString = process.env.DATABASE_URL;
  console.log("Testing PG connection...");
  console.log("Connection string:", connectionString?.replace(/:[^:@]+@/, ":****@"));

  try {
    const pool = new Pool({ connectionString });
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("✅ Connection successful!");
    console.log("Time from DB:", result.rows[0]);
    client.release();
    await pool.end();
  } catch (error) {
    console.error("❌ Connection failed:", error);
  }
}

testPg();

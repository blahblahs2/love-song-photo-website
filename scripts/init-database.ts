import { neon } from "@neondatabase/serverless"

async function initializeDatabase() {
  try {
    console.log("🚀 Initializing database...")

    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL environment variable is not set")
      console.log("📝 Please add DATABASE_URL to your .env.local file")
      console.log("🔗 Get a free database at: https://neon.tech")
      return
    }

    // Create a connection to the database
    const sql = neon(process.env.DATABASE_URL!)

    // Test connection
    console

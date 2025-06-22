import { neon } from "@neondatabase/serverless"

async function testConnection() {
  try {
    console.log("🔍 Testing database connection...")

    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL is not set!")
      console.log("💡 Create a .env.local file with your DATABASE_URL")
      return
    }

    console.log("🔗 DATABASE_URL found:", process.env.DATABASE_URL.substring(0, 30) + "...")

    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT 1 as test`

    console.log("✅ Database connection successful!")
    console.log("📊 Test result:", result)
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    console.log("💡 Check your DATABASE_URL and internet connection")
  }
}

testConnection()

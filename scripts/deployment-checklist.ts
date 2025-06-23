import { neon } from "@neondatabase/serverless"

async function checkDeploymentReadiness() {
  console.log("🔍 Checking deployment readiness...")

  // Check environment variables
  const requiredEnvVars = [
    "DATABASE_URL",
    "ADMIN_USERNAME",
    "ADMIN_PASSWORD",
    "NEXT_PUBLIC_ADMIN_USERNAME",
    "NEXT_PUBLIC_ADMIN_PASSWORD",
  ]

  console.log("\n📋 Environment Variables Check:")
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar]
    if (value) {
      console.log(`✅ ${envVar}: Set`)
    } else {
      console.log(`❌ ${envVar}: Missing`)
    }
  }

  // Check database connection
  console.log("\n🔌 Database Connection Check:")
  try {
    if (!process.env.DATABASE_URL) {
      console.log("❌ DATABASE_URL not set")
      return
    }

    const sql = neon(process.env.DATABASE_URL)
    await sql`SELECT 1 as test`
    console.log("✅ Database connection successful")

    // Check tables exist
    console.log("\n📊 Database Tables Check:")
    const tables = ["members", "photos", "songs", "memories"]

    for (const table of tables) {
      try {
        const result = await sql`
          SELECT COUNT(*) as count 
          FROM information_schema.tables 
          WHERE table_name = ${table}
        `
        if (Number(result[0].count) > 0) {
          const rowCount = await sql.unsafe(`SELECT COUNT(*) as count FROM ${table}`)
          console.log(`✅ ${table} table exists (${rowCount[0].count} rows)`)
        } else {
          console.log(`❌ ${table} table missing`)
        }
      } catch (error) {
        console.log(`❌ ${table} table error: ${error}`)
      }
    }
  } catch (error) {
    console.log(`❌ Database connection failed: ${error}`)
  }

  console.log("\n🚀 Deployment Status:")
  console.log("If all checks show ✅, your app is ready for deployment!")
  console.log("If any show ❌, run the deploy-setup script first.")
}

checkDeploymentReadiness()

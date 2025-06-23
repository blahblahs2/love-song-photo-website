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
  let allEnvVarsSet = true
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar]
    if (value) {
      console.log(`✅ ${envVar}: Set`)
    } else {
      console.log(`❌ ${envVar}: Missing`)
      allEnvVarsSet = false
    }
  }

  // Check database connection
  console.log("\n🔌 Database Connection Check:")
  try {
    if (!process.env.DATABASE_URL) {
      console.log("❌ DATABASE_URL not set")
      return false
    }

    const sql = neon(process.env.DATABASE_URL)
    await sql`SELECT 1 as test`
    console.log("✅ Database connection successful")

    // Check tables exist
    console.log("\n📊 Database Tables Check:")
    const tables = ["members", "photos", "songs", "memories"]
    let allTablesExist = true

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
          allTablesExist = false
        }
      } catch (error) {
        console.log(`❌ ${table} table error: ${error}`)
        allTablesExist = false
      }
    }

    console.log("\n🚀 Deployment Status:")
    if (allEnvVarsSet && allTablesExist) {
      console.log("✅ All checks passed! Your app is ready for deployment!")
      console.log("\n📝 Next Steps:")
      console.log("1. Push your code to GitHub")
      console.log("2. Connect your GitHub repo to Vercel")
      console.log("3. Set environment variables in Vercel dashboard")
      console.log("4. Deploy!")
      return true
    } else {
      console.log("❌ Some checks failed. Please fix the issues above.")
      if (!allTablesExist) {
        console.log("💡 Run 'npm run setup-db' to create missing tables")
      }
      return false
    }
  } catch (error) {
    console.log(`❌ Database connection failed: ${error}`)
    return false
  }
}

checkDeploymentReadiness()

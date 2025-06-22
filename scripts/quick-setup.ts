import fs from "fs"
import path from "path"

async function quickSetup() {
  console.log("🚀 Quick Setup for Local Development")

  const envPath = path.join(process.cwd(), ".env.local")

  // Check if .env.local exists
  if (!fs.existsSync(envPath)) {
    console.log("📝 Creating .env.local file...")

    const envContent = `# Your Database URL - Replace with your actual database URL
DATABASE_URL="postgresql://friend_owner:npg_FASnNjRyx46E@ep-dry-meadow-a8i6bfv7-pooler.eastus2.azure.neon.tech/friend?sslmode=require"

# Admin Credentials - Change these to your preferred login
ADMIN_USERNAME="kimhour"
ADMIN_PASSWORD="mypassword123"
NEXT_PUBLIC_ADMIN_USERNAME="kimhour"
NEXT_PUBLIC_ADMIN_PASSWORD="mypassword123"
`

    fs.writeFileSync(envPath, envContent)
    console.log("✅ .env.local file created!")
  } else {
    console.log("✅ .env.local file already exists!")
  }

  console.log("🔧 Next steps:")
  console.log("1. Edit .env.local with your database URL")
  console.log("2. Run: npm run setup-db")
  console.log("3. Run: npm run dev")
}

quickSetup()

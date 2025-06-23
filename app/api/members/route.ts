import { type NextRequest, NextResponse } from "next/server"
import { getAllMembersFromDB, initDatabase } from "@/lib/db"

// Initialize database on server start
let dbInitialized = false
async function ensureDbInitialized() {
  if (!dbInitialized) {
    try {
      console.log("🔄 Initializing database...")
      const success = await initDatabase()
      if (success) {
        dbInitialized = true
        console.log("✅ Database initialized successfully")
      } else {
        console.warn("⚠️ Database initialization failed, but continuing...")
      }
    } catch (error) {
      console.error("❌ Database initialization error:", error)
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("📡 API: Fetching members...")
    await ensureDbInitialized()

    // Get all active members
    const members = await getAllMembersFromDB()
    console.log(`📊 API: Retrieved ${members.length} members`)

    return NextResponse.json({
      success: true,
      members: members,
      count: members.length,
      message: members.length === 0 ? "No members found" : `Found ${members.length} members`,
    })
  } catch (error) {
    console.error("❌ API Error fetching members:", error)
    return NextResponse.json(
      {
        success: false,
        members: [],
        count: 0,
        message: "Failed to fetch members",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

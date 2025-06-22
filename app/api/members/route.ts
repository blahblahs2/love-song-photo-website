import { type NextRequest, NextResponse } from "next/server"
import { getAllMembersFromDB, initDatabase } from "@/lib/db"

// Initialize database on server start
let dbInitialized = false
async function ensureDbInitialized() {
  if (!dbInitialized) {
    try {
      const success = await initDatabase()
      if (success) {
        dbInitialized = true
      } else {
        console.warn("Database initialization failed, but continuing...")
      }
    } catch (error) {
      console.error("Database initialization error:", error)
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized()

    // Get all active members
    const members = await getAllMembersFromDB()

    return NextResponse.json({
      success: true,
      members: members,
      message: members.length === 0 ? "No members found" : undefined,
    })
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json(
      {
        success: false,
        members: [],
        message: "Failed to fetch members",
      },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getAllMemoriesFromDB, initDatabase } from "@/lib/db"

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

    // Get all active memories
    const memories = await getAllMemoriesFromDB()

    return NextResponse.json({
      success: true,
      memories: memories,
      message: memories.length === 0 ? "No memories found" : undefined,
    })
  } catch (error) {
    console.error("Error fetching memories:", error)
    return NextResponse.json(
      {
        success: false,
        memories: [],
        message: "Failed to fetch memories",
      },
      { status: 500 },
    )
  }
}

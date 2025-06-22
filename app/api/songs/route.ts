import { getApprovedSongsAction } from "@/app/actions/song-actions"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set")
      return NextResponse.json({
        success: true,
        songs: [],
        message: "Database not configured - using demo mode",
      })
    }

    const songs = await getApprovedSongsAction()
    return NextResponse.json({ success: true, songs })
  } catch (error) {
    console.error("Failed to fetch songs:", error)

    // Return empty array instead of error to prevent UI breaking
    return NextResponse.json({
      success: true,
      songs: [],
      message: "Database connection failed - showing demo mode",
    })
  }
}

// app/api/songs/route.ts

import { getApprovedSongsAction } from "@/app/actions/song-actions"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check for DATABASE_URL
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL not set. Check your .env.local file.")
      return NextResponse.json({
        success: true,
        songs: [],
        message: "Database not configured - using demo mode",
      })
    }

    // Fetch approved songs from database
    const songs = await getApprovedSongsAction()

    return NextResponse.json({ success: true, songs })
  } catch (error) {
    console.error("❌ Failed to fetch songs:", error)
    return NextResponse.json({
      success: true,
      songs: [],
      message: "Database connection failed - showing demo mode",
    })
  }
}

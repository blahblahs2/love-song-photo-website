import { type NextRequest, NextResponse } from "next/server"
import { addSongToDB, initDatabase } from "@/lib/db"

// Extract YouTube video ID from URL
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

// Get YouTube thumbnail URL
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

export async function POST(request: NextRequest) {
  try {
    // Initialize database
    await initDatabase()

    const formData = await request.formData()

    // Extract data from the form
    const title = formData.get("title") as string
    const artist = formData.get("artist") as string
    const youtubeUrl = formData.get("youtubeUrl") as string
    const description = formData.get("description") as string
    const addedBy = formData.get("addedBy") as string
    const tagsString = formData.get("tags") as string
    const mood = formData.get("mood") as string
    const lyrics = formData.get("lyrics") as string

    // Validate required fields
    if (!title || !artist || !youtubeUrl || !addedBy) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Extract YouTube video ID
    const youtubeId = extractYouTubeId(youtubeUrl)
    if (!youtubeId) {
      return NextResponse.json({ success: false, message: "Invalid YouTube URL" }, { status: 400 })
    }

    // Process tags
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : []

    // Get thumbnail URL
    const thumbnailUrl = getYouTubeThumbnail(youtubeId)

    // Create new song object
    const newSong = {
      title,
      artist,
      youtube_url: youtubeUrl,
      youtube_id: youtubeId,
      thumbnail_url: thumbnailUrl,
      description,
      added_by: addedBy,
      tags,
      mood,
      lyrics,
    }

    // Add to database
    const savedSong = await addSongToDB(newSong)

    return NextResponse.json({
      success: true,
      message: "Song uploaded successfully! It will appear in the playlist after admin approval.",
      songId: savedSong.id,
    })
  } catch (error) {
    console.error("Upload failed:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to upload song",
      },
      { status: 500 },
    )
  }
}

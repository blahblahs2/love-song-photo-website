"use server"

import { revalidatePath } from "next/cache"
import {
  initDatabase,
  getAllSongsFromDB,
  getApprovedSongsFromDB,
  getPendingSongsFromDB,
  addSongToDB,
  approveSongInDB,
  deleteSongFromDB,
  getSongByIdFromDB,
} from "@/lib/db"

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
      // Don't throw error, just log it and continue
    }
  }
}

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

export async function uploadSong(formData: FormData) {
  try {
    await ensureDbInitialized()

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
      throw new Error("Missing required fields")
    }

    // Extract YouTube video ID
    const youtubeId = extractYouTubeId(youtubeUrl)
    if (!youtubeId) {
      throw new Error("Invalid YouTube URL")
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

    // Revalidate pages
    revalidatePath("/songs")
    revalidatePath("/admin")

    return {
      success: true,
      message: "Song uploaded successfully! It will appear in the playlist after admin approval.",
      songId: savedSong.id,
    }
  } catch (error) {
    console.error("Upload failed:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload song",
    }
  }
}

export async function getAllSongsAction() {
  try {
    await ensureDbInitialized()
    return await getAllSongsFromDB()
  } catch (error) {
    console.error("Error getting all songs:", error)
    return []
  }
}

export async function getApprovedSongsAction() {
  try {
    await ensureDbInitialized()
    return await getApprovedSongsFromDB()
  } catch (error) {
    console.error("Error getting approved songs:", error)
    return []
  }
}

export async function getPendingSongsAction() {
  try {
    await ensureDbInitialized()
    return await getPendingSongsFromDB()
  } catch (error) {
    console.error("Error getting pending songs:", error)
    return []
  }
}

export async function approveSongAction(id: number) {
  try {
    await ensureDbInitialized()
    const success = await approveSongInDB(id)
    if (success) {
      revalidatePath("/songs")
      revalidatePath("/admin")
      return { success: true, message: "Song approved successfully!" }
    }
    return { success: false, message: "Song not found" }
  } catch (error) {
    console.error("Error approving song:", error)
    return { success: false, message: "Failed to approve song" }
  }
}

export async function deleteSongAction(id: number) {
  try {
    await ensureDbInitialized()
    const success = await deleteSongFromDB(id)
    if (success) {
      revalidatePath("/songs")
      revalidatePath("/admin")
      return { success: true, message: "Song deleted successfully!" }
    }
    return { success: false, message: "Song not found" }
  } catch (error) {
    console.error("Error deleting song:", error)
    return { success: false, message: "Failed to delete song" }
  }
}

export async function getSongByIdAction(id: number) {
  try {
    await ensureDbInitialized()
    return await getSongByIdFromDB(id)
  } catch (error) {
    console.error("Error getting song by ID:", error)
    return null
  }
}

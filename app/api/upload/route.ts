import { type NextRequest, NextResponse } from "next/server"
import { addPhotoToDB, initDatabase } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Initialize database
    await initDatabase()

    const formData = await request.formData()

    // Extract data from the form
    const photo = formData.get("photo") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const date = formData.get("date") as string
    const location = formData.get("location") as string
    const uploadedBy = formData.get("uploadedBy") as string
    const tagsString = formData.get("tags") as string

    // Validate required fields
    if (!photo || !title || !date || !uploadedBy) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Process tags
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : []

    // Convert image to base64
    const arrayBuffer = await photo.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")
    const imageUrl = `data:${photo.type};base64,${base64}`

    // Create new photo object
    const newPhoto = {
      title,
      description,
      date,
      location,
      uploaded_by: uploadedBy,
      tags,
      image_url: imageUrl,
    }

    // Add to database
    const savedPhoto = await addPhotoToDB(newPhoto)

    return NextResponse.json({
      success: true,
      message: "Photo uploaded successfully! It will appear in the gallery after admin approval.",
      photoId: savedPhoto.id,
    })
  } catch (error) {
    console.error("Upload failed:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to upload photo",
      },
      { status: 500 },
    )
  }
}

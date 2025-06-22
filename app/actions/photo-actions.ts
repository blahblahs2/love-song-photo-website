"use server"

import { revalidatePath } from "next/cache"
import {
  initDatabase,
  getAllPhotosFromDB,
  getApprovedPhotosFromDB,
  getPendingPhotosFromDB,
  addPhotoToDB,
  approvePhotoInDB,
  deletePhotoFromDB,
  getPhotoByIdFromDB,
} from "@/lib/db"

// Initialize database on server start
let dbInitialized = false
async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase()
    dbInitialized = true
  }
}

export async function uploadPhoto(formData: FormData) {
  try {
    await ensureDbInitialized()

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
      throw new Error("Missing required fields")
    }

    // Process tags
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : []

    // Convert image to base64 for storage (server-side)
    const imageUrl = await convertFileToBase64(photo)

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

    // Revalidate all relevant pages
    revalidatePath("/our-pictures")
    revalidatePath("/admin")
    revalidatePath("/")

    return {
      success: true,
      message: "Photo uploaded successfully! It will appear in the gallery after admin approval.",
      photoId: savedPhoto.id,
    }
  } catch (error) {
    console.error("Upload failed:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload photo",
    }
  }
}

// Server-side file to base64 conversion
async function convertFileToBase64(file: File): Promise<string> {
  try {
    // Get the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Convert to Buffer (Node.js)
    const buffer = Buffer.from(arrayBuffer)

    // Convert to base64
    const base64 = buffer.toString("base64")

    // Return with proper data URL format
    return `data:${file.type};base64,${base64}`
  } catch (error) {
    console.error("Error converting file to base64:", error)
    throw new Error("Failed to process image file")
  }
}

export async function getAllPhotosAction() {
  await ensureDbInitialized()
  return await getAllPhotosFromDB()
}

export async function getApprovedPhotosAction() {
  await ensureDbInitialized()
  return await getApprovedPhotosFromDB()
}

export async function getPendingPhotosAction() {
  await ensureDbInitialized()
  return await getPendingPhotosFromDB()
}

export async function approvePhotoAction(id: number) {
  try {
    await ensureDbInitialized()
    const success = await approvePhotoInDB(id)
    if (success) {
      // Revalidate all pages that show photos
      revalidatePath("/our-pictures")
      revalidatePath("/admin")
      revalidatePath("/")
      revalidatePath("/api/photos")

      return { success: true, message: "Photo approved successfully!" }
    }
    return { success: false, message: "Photo not found" }
  } catch (error) {
    console.error("Error approving photo:", error)
    return { success: false, message: "Failed to approve photo" }
  }
}

export async function deletePhotoAction(id: number) {
  try {
    await ensureDbInitialized()
    const success = await deletePhotoFromDB(id)
    if (success) {
      // Revalidate all pages that show photos
      revalidatePath("/our-pictures")
      revalidatePath("/admin")
      revalidatePath("/")
      revalidatePath("/api/photos")

      return { success: true, message: "Photo deleted successfully!" }
    }
    return { success: false, message: "Photo not found" }
  } catch (error) {
    console.error("Error deleting photo:", error)
    return { success: false, message: "Failed to delete photo" }
  }
}

export async function getPhotoByIdAction(id: number) {
  await ensureDbInitialized()
  return await getPhotoByIdFromDB(id)
}

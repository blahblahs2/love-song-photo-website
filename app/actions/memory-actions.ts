"use server"

import { revalidatePath } from "next/cache"
import {
  initDatabase,
  getAllMemoriesFromDB,
  addMemoryToDB,
  updateMemoryInDB,
  deleteMemoryFromDB,
  getMemoryByIdFromDB,
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
    }
  }
}

export async function getAllMemoriesAction() {
  try {
    await ensureDbInitialized()
    return await getAllMemoriesFromDB()
  } catch (error) {
    console.error("Error getting all memories:", error)
    return []
  }
}

export async function addMemoryAction(formData: FormData) {
  try {
    await ensureDbInitialized()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const emoji = formData.get("emoji") as string
    const gradient = formData.get("gradient") as string
    const displayOrder = Number.parseInt(formData.get("displayOrder") as string) || 0

    if (!title || !description || !emoji || !gradient) {
      throw new Error("Missing required fields")
    }

    const newMemory = {
      title,
      description,
      emoji,
      gradient,
      display_order: displayOrder,
    }

    const savedMemory = await addMemoryToDB(newMemory)

    revalidatePath("/")
    revalidatePath("/admin")

    return {
      success: true,
      message: "Memory added successfully!",
      memoryId: savedMemory.id,
    }
  } catch (error) {
    console.error("Add memory failed:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to add memory",
    }
  }
}

export async function updateMemoryAction(id: number, formData: FormData) {
  try {
    await ensureDbInitialized()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const emoji = formData.get("emoji") as string
    const gradient = formData.get("gradient") as string
    const displayOrder = Number.parseInt(formData.get("displayOrder") as string) || 0

    const updateData: any = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (emoji) updateData.emoji = emoji
    if (gradient) updateData.gradient = gradient
    if (displayOrder !== undefined) updateData.display_order = displayOrder

    const updatedMemory = await updateMemoryInDB(id, updateData)

    if (updatedMemory) {
      revalidatePath("/")
      revalidatePath("/admin")

      return { success: true, message: "Memory updated successfully!" }
    }
    return { success: false, message: "Memory not found" }
  } catch (error) {
    console.error("Error updating memory:", error)
    return { success: false, message: "Failed to update memory" }
  }
}

export async function deleteMemoryAction(id: number) {
  try {
    await ensureDbInitialized()
    const success = await deleteMemoryFromDB(id)
    if (success) {
      revalidatePath("/")
      revalidatePath("/admin")

      return { success: true, message: "Memory deleted successfully!" }
    }
    return { success: false, message: "Memory not found" }
  } catch (error) {
    console.error("Error deleting memory:", error)
    return { success: false, message: "Failed to delete memory" }
  }
}

export async function getMemoryByIdAction(id: number) {
  try {
    await ensureDbInitialized()
    return await getMemoryByIdFromDB(id)
  } catch (error) {
    console.error("Error getting memory by ID:", error)
    return null
  }
}

"use server"

import { revalidatePath } from "next/cache"
import {
  initDatabase,
  getAllMembersFromDB,
  addMemberToDB,
  updateMemberInDB,
  deleteMemberFromDB,
  getMemberByIdFromDB,
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

export async function getAllMembersAction() {
  try {
    await ensureDbInitialized()
    return await getAllMembersFromDB()
  } catch (error) {
    console.error("Error getting all members:", error)
    return []
  }
}

export async function addMemberAction(formData: FormData) {
  try {
    await ensureDbInitialized()

    const name = formData.get("name") as string
    const nickname = formData.get("nickname") as string
    const role = formData.get("role") as string
    const bio = formData.get("bio") as string

    // Validate required fields
    if (!name) {
      throw new Error("Name is required")
    }

    // Create new member object
    const newMember = {
      name: name.trim(),
      nickname: nickname?.trim() || "",
      role: role?.trim() || "Member",
      bio: bio?.trim() || "",
    }

    // Add to database
    const savedMember = await addMemberToDB(newMember)

    // Revalidate all relevant pages
    revalidatePath("/admin")
    revalidatePath("/our-pictures")
    revalidatePath("/songs")
    revalidatePath("/")

    return {
      success: true,
      message: "Member added successfully!",
      memberId: savedMember.id,
    }
  } catch (error) {
    console.error("Add member failed:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to add member",
    }
  }
}

export async function updateMemberAction(id: number, formData: FormData) {
  try {
    await ensureDbInitialized()

    const name = formData.get("name") as string
    const nickname = formData.get("nickname") as string
    const role = formData.get("role") as string
    const bio = formData.get("bio") as string

    // Validate required fields
    if (!name) {
      throw new Error("Name is required")
    }

    // Create update object
    const updateData = {
      name: name.trim(),
      nickname: nickname?.trim() || "",
      role: role?.trim() || "Member",
      bio: bio?.trim() || "",
    }

    // Update in database
    const updatedMember = await updateMemberInDB(id, updateData)

    if (!updatedMember) {
      throw new Error("Member not found")
    }

    // Revalidate all relevant pages
    revalidatePath("/admin")
    revalidatePath("/our-pictures")
    revalidatePath("/songs")
    revalidatePath("/")

    return {
      success: true,
      message: "Member updated successfully!",
    }
  } catch (error) {
    console.error("Update member failed:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update member",
    }
  }
}

export async function deleteMemberAction(id: number) {
  try {
    await ensureDbInitialized()
    const success = await deleteMemberFromDB(id)
    if (success) {
      // Revalidate all pages that show members
      revalidatePath("/admin")
      revalidatePath("/our-pictures")
      revalidatePath("/songs")
      revalidatePath("/")

      return { success: true, message: "Member removed successfully!" }
    }
    return { success: false, message: "Member not found" }
  } catch (error) {
    console.error("Error deleting member:", error)
    return { success: false, message: "Failed to remove member" }
  }
}

export async function getMemberByIdAction(id: number) {
  try {
    await ensureDbInitialized()
    return await getMemberByIdFromDB(id)
  } catch (error) {
    console.error("Error getting member by ID:", error)
    return null
  }
}

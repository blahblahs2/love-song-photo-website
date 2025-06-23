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
        console.log("✅ Database initialized successfully")
      } else {
        console.warn("⚠️ Database initialization failed, but continuing...")
      }
    } catch (error) {
      console.error("❌ Database initialization error:", error)
    }
  }
}

export async function getAllMembersAction() {
  try {
    await ensureDbInitialized()
    const members = await getAllMembersFromDB()
    console.log(`📊 Retrieved ${members.length} members from database`)
    return members
  } catch (error) {
    console.error("❌ Error getting all members:", error)
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

    console.log("📝 Adding member with data:", { name, nickname, role, bio })

    // Validate required fields
    if (!name || name.trim() === "") {
      throw new Error("Name is required")
    }

    // Create new member object
    const newMember = {
      name: name.trim(),
      nickname: nickname?.trim() || "",
      role: role?.trim() || "Member",
      bio: bio?.trim() || "",
    }

    console.log("💾 Saving member to database:", newMember)

    // Add to database
    const savedMember = await addMemberToDB(newMember)
    console.log("✅ Member saved successfully:", savedMember)

    // Force revalidation of all relevant pages
    revalidatePath("/admin", "page")
    revalidatePath("/our-pictures", "page")
    revalidatePath("/songs", "page")
    revalidatePath("/", "page")
    revalidatePath("/api/members", "page")

    return {
      success: true,
      message: `Member "${name}" added successfully!`,
      memberId: savedMember.id,
      member: savedMember,
    }
  } catch (error) {
    console.error("❌ Add member failed:", error)
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

    console.log(`📝 Updating member ${id} with data:`, { name, nickname, role, bio })

    // Validate required fields
    if (!name || name.trim() === "") {
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

    console.log("✅ Member updated successfully:", updatedMember)

    // Force revalidation of all relevant pages
    revalidatePath("/admin", "page")
    revalidatePath("/our-pictures", "page")
    revalidatePath("/songs", "page")
    revalidatePath("/", "page")
    revalidatePath("/api/members", "page")

    return {
      success: true,
      message: `Member "${name}" updated successfully!`,
      member: updatedMember,
    }
  } catch (error) {
    console.error("❌ Update member failed:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update member",
    }
  }
}

export async function deleteMemberAction(id: number) {
  try {
    await ensureDbInitialized()
    console.log(`🗑️ Deleting member with ID: ${id}`)

    const success = await deleteMemberFromDB(id)
    if (success) {
      console.log("✅ Member deleted successfully")

      // Force revalidation of all pages that show members
      revalidatePath("/admin", "page")
      revalidatePath("/our-pictures", "page")
      revalidatePath("/songs", "page")
      revalidatePath("/", "page")
      revalidatePath("/api/members", "page")

      return { success: true, message: "Member removed successfully!" }
    }
    return { success: false, message: "Member not found" }
  } catch (error) {
    console.error("❌ Error deleting member:", error)
    return { success: false, message: "Failed to remove member" }
  }
}

export async function getMemberByIdAction(id: number) {
  try {
    await ensureDbInitialized()
    const member = await getMemberByIdFromDB(id)
    console.log(`📋 Retrieved member ${id}:`, member)
    return member
  } catch (error) {
    console.error("❌ Error getting member by ID:", error)
    return null
  }
}

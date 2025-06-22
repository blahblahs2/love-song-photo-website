import { getAllMemoriesAction } from "@/app/actions/memory-actions"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const memories = await getAllMemoriesAction()
    return NextResponse.json({ success: true, memories })
  } catch (error) {
    console.error("Failed to fetch memories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch memories" }, { status: 500 })
  }
}

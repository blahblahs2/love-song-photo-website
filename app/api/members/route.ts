import { getAllMembersAction } from "@/app/actions/member-actions"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const members = await getAllMembersAction()
    return NextResponse.json({ success: true, members })
  } catch (error) {
    console.error("Failed to fetch members:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch members" }, { status: 500 })
  }
}

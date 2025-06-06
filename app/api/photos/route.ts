import { getApprovedPhotosAction } from "@/app/actions/photo-actions"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const photos = await getApprovedPhotosAction()
    return NextResponse.json({ success: true, photos })
  } catch (error) {
    console.error("Failed to fetch photos:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch photos" }, { status: 500 })
  }
}

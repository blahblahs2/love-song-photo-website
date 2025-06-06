import { getPendingPhotosAction, getAllPhotosAction } from "@/app/actions/photo-actions"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (type === "pending") {
      const photos = await getPendingPhotosAction()
      return NextResponse.json({ success: true, photos })
    } else {
      const photos = await getAllPhotosAction()
      return NextResponse.json({ success: true, photos })
    }
  } catch (error) {
    console.error("Failed to fetch admin photos:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch photos" }, { status: 500 })
  }
}

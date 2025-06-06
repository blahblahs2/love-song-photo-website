import { getPhotoByIdAction } from "@/app/actions/photo-actions"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const photoId = Number.parseInt(params.id)
    const photo = await getPhotoByIdAction(photoId)

    if (!photo) {
      return NextResponse.json({ success: false, error: "Photo not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, photo })
  } catch (error) {
    console.error("Failed to fetch photo:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch photo" }, { status: 500 })
  }
}

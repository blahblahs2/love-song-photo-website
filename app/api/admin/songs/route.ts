import { getPendingSongsAction, getAllSongsAction } from "@/app/actions/song-actions"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (type === "pending") {
      const songs = await getPendingSongsAction()
      return NextResponse.json({ success: true, songs })
    } else {
      const songs = await getAllSongsAction()
      return NextResponse.json({ success: true, songs })
    }
  } catch (error) {
    console.error("Failed to fetch admin songs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch songs" }, { status: 500 })
  }
}

// app/api/admin/songs/route.ts
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

async function getApprovedSongsAction() {
  try {
    const result = await sql`SELECT * FROM songs WHERE approved = true ORDER BY created_at DESC`;
    return result;
  } catch (error) {
    console.error("Error in getApprovedSongsAction:", error);
    return [];
  }
}

export async function GET() {
  const songs = await getApprovedSongsAction();
  return NextResponse.json(songs);
}

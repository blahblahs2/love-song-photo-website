import { NextResponse } from "next/server"

// Admin credentials - in production, these should be environment variables
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "kim@",
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      return NextResponse.json({ success: true, message: "Login successful" })
    } else {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Login failed" }, { status: 500 })
  }
}

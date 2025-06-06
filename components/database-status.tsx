"use client"

import { useState, useEffect } from "react"
import { Database, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function DatabaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking")
  const [photoCount, setPhotoCount] = useState(0)

  useEffect(() => {
    async function checkDatabase() {
      try {
        const response = await fetch("/api/photos")
        const data = await response.json()

        if (data.success) {
          setStatus("connected")
          setPhotoCount(data.photos.length)
        } else {
          setStatus("error")
        }
      } catch (error) {
        setStatus("error")
      }
    }

    checkDatabase()
  }, [])

  return (
    <Card className="mb-6 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Database className="h-5 w-5 text-blue-500" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              {status === "checking" && (
                <>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Checking database connection...</span>
                </>
              )}
              {status === "connected" && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-700">Database connected • {photoCount} photos stored</span>
                </>
              )}
              {status === "error" && (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700">Database connection failed</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

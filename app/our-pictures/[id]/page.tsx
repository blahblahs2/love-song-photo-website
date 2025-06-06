"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Tag, Heart, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Photo {
  id: number
  title: string
  description: string
  date: string
  location: string
  uploaded_by: string
  tags: string[]
  image_url: string
  created_at: string
}

export default function PhotoDetailPage() {
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading photo (no API)
    const fakePhoto: Photo = {
      id: 1,
      title: "A Memory With You",
      description: "This was one of the happiest days we shared together.",
      date: "2025-01-14",
      location: "Rome, Italy",
      uploaded_by: "You ❤️ Me",
      tags: ["Love", "Vacation", "Forever"],
      image_url: "/my-photo.jpg", // Must be in public/ folder
      created_at: "2025-01-14T12:00:00Z",
    }

    setTimeout(() => {
      setPhoto(fakePhoto)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple-500 mb-4" />
          <p className="text-lg text-gray-600">Loading photo...</p>
        </div>
      </div>
    )
  }

  if (!photo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Photo Not Found</h1>
          <p className="text-gray-600 mb-6">The photo you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/our-pictures">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-16 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/our-pictures">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Link>
        </Button>

        <Card className="overflow-hidden bg-white/90 backdrop-blur-sm">
          <div className="relative">
            <img
              src={photo.image_url || "/placeholder.svg"}
              alt={photo.title}
              className="w-full h-auto max-h-[600px] object-contain bg-black"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg"
              }}
            />
            <div className="absolute top-4 right-4">
              <Heart className="h-8 w-8 text-pink-500 fill-current" />
            </div>
          </div>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{photo.title}</h1>
            <p className="text-gray-600 mb-6 text-lg">{photo.description}</p>

            {photo.tags && photo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {photo.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Date</p>
                  <p>{new Date(photo.date).toLocaleDateString()}</p>
                </div>
              </div>

              {photo.location && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-pink-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p>{photo.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Uploaded by</p>
                  <p>{photo.uploaded_by}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

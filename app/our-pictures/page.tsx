"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Upload, Heart, Calendar, MapPin, Users, Tag, Search, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Photo {
  id: number
  title: string
  description: string
  date: string
  location: string
  uploaded_by: string
  tags: string[]
  image_url: string
  approved: boolean
  created_at: string
}

export default function OurPicturesPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    uploadedBy: "",
    tags: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const formRef = useRef<HTMLFormElement>(null)

  const friendNames = ["Senghuot", "Kimhour", "Chanleang", "Dyheng", "Somiet", "Ratanak", "Lyteng", "Lyheng"]

  // Load approved photos from the API
  useEffect(() => {
    async function loadPhotos() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/photos")
        const data = await response.json()

        if (data.success) {
          setPhotos(data.photos)
        } else {
          setError("Failed to load photos")
        }
      } catch (error) {
        console.error("Failed to load photos:", error)
        setError("Failed to load photos. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadPhotos()
  }, [])

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, error])

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      uploadedBy: "",
      tags: "",
    })
    setSelectedFile(null)
    if (formRef.current) {
      formRef.current.reset()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setSelectedFile(file || null)
  }

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUploading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Validate required fields
      if (!selectedFile || !formData.title || !formData.date || !formData.uploadedBy) {
        setError("Please fill in all required fields")
        setUploading(false)
        return
      }

      // Create FormData object
      const uploadFormData = new FormData()
      uploadFormData.append("photo", selectedFile)
      uploadFormData.append("title", formData.title)
      uploadFormData.append("description", formData.description)
      uploadFormData.append("date", formData.date)
      uploadFormData.append("location", formData.location)
      uploadFormData.append("uploadedBy", formData.uploadedBy)
      uploadFormData.append("tags", formData.tags)

      // Use fetch to upload via API route
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      const result = await response.json()

      if (result.success) {
        setSuccessMessage(result.message)
        setShowUploadForm(false)
        resetForm()
        // Note: Don't refresh photos here since they need approval first
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Upload failed:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch =
      photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.uploaded_by.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTag = selectedTag === "" || (photo.tags && photo.tags.includes(selectedTag))

    return matchesSearch && matchesTag
  })

  // Get all unique tags from photos
  const allTags = [...new Set(photos.flatMap((photo) => photo.tags || []))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Squad Memory Gallery
          </h1>
          <p className="text-xl text-gray-600 mb-8">Every picture tells a story of our amazing friendship</p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              onClick={() => {
                setShowUploadForm(!showUploadForm)
                if (!showUploadForm) {
                  resetForm()
                  setError(null)
                  setSuccessMessage(null)
                }
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Upload className="h-5 w-5 mr-2" />
              Add New Memory
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert className="max-w-2xl mx-auto mb-6 border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert className="max-w-2xl mx-auto mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Upload Form */}
        {showUploadForm && (
          <Card className="max-w-2xl mx-auto mb-12 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-6 text-center">Share a New Memory</h3>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  📝 <strong>Note:</strong> Your photo will be reviewed by an admin before appearing in the gallery.
                </p>
              </div>
              <form ref={formRef} onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Photo <span className="text-red-500">*</span>
                  </label>
                  <Input type="file" accept="image/*" required className="w-full" onChange={handleFileChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Give this memory an awesome title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Story</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us the story behind this photo!"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <Input name="date" type="date" value={formData.date} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Where did this happen?"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="uploadedBy"
                      value={formData.uploadedBy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select your name</option>
                      {friendNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tags</label>
                    <Input
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="e.g., Beach Day, Funny, Adventure"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Share Memory"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowUploadForm(false)
                      resetForm()
                      setError(null)
                      setSuccessMessage(null)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple-500 mb-4" />
            <p className="text-lg text-gray-600">Loading memories...</p>
          </div>
        )}

        {/* Photo Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotos.map((photo) => (
              <Card
                key={photo.id}
                className="overflow-hidden hover:shadow-xl transition-all hover:scale-105 bg-white/90 backdrop-blur-sm"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo.image_url || "/placeholder.svg"}
                    alt={photo.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{photo.title}</h3>
                    <Heart className="h-5 w-5 text-pink-500" />
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{photo.description}</p>

                  {photo.tags && photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {photo.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(photo.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {photo.uploaded_by}
                    </div>
                  </div>
                  {photo.location && (
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {photo.location}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No memories found</h3>
            <p className="text-gray-500">Try adjusting your search or add some new photos!</p>
          </div>
        )}
      </div>
    </div>
  )
}

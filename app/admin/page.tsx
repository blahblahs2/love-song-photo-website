"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, Clock, ImageIcon, Trash2, Eye, LogOut, User, Lock, Music, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { approvePhotoAction, deletePhotoAction } from "@/app/actions/photo-actions"
import { approveSongAction, deleteSongAction } from "@/app/actions/song-actions"
import DatabaseStatus from "@/components/database-status"

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

interface Song {
  id: number
  title: string
  artist: string
  youtube_url: string
  youtube_id: string
  thumbnail_url?: string
  description?: string
  added_by: string
  tags: string[]
  mood?: string
  lyrics?: string
  approved: boolean
  created_at: string
}

// Admin credentials - Change these to your desired username and password
const ADMIN_CREDENTIALS = {
  username: process.env.NEXT_PUBLIC_ADMIN_USERNAME || "kimhour",
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "mypassword123",
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")
  const [pendingPhotos, setPendingPhotos] = useState<Photo[]>([])
  const [allPhotos, setAllPhotos] = useState<Photo[]>([])
  const [pendingSongs, setPendingSongs] = useState<Song[]>([])
  const [allSongs, setAllSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"pending-photos" | "all-photos" | "pending-songs" | "all-songs">(
    "pending-photos",
  )
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Check if already authenticated (simple session check)
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("admin_logged_in")
    if (isLoggedIn === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated, activeTab])

  // Clear messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setLoading(true)

    try {
      // Simple client-side authentication for demo
      if (loginForm.username === ADMIN_CREDENTIALS.username && loginForm.password === ADMIN_CREDENTIALS.password) {
        setIsAuthenticated(true)
        sessionStorage.setItem("admin_logged_in", "true")
        console.log("Admin login successful!")
      } else {
        setLoginError("Invalid credentials")
      }
    } catch (error) {
      setLoginError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin_logged_in")
    setLoginForm({ username: "", password: "" })
  }

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab.includes("photos")) {
        const endpoint = activeTab === "pending-photos" ? "/api/admin/photos?type=pending" : "/api/admin/photos"
        const response = await fetch(endpoint)
        const data = await response.json()

        if (data.success) {
          if (activeTab === "pending-photos") {
            setPendingPhotos(data.photos)
          } else {
            setAllPhotos(data.photos)
          }
        }
      } else {
        const endpoint = activeTab === "pending-songs" ? "/api/admin/songs?type=pending" : "/api/admin/songs"
        const response = await fetch(endpoint)
        const data = await response.json()

        if (data.success) {
          if (activeTab === "pending-songs") {
            setPendingSongs(data.songs)
          } else {
            setAllSongs(data.songs)
          }
        }
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprovePhoto = async (photoId: number) => {
    try {
      const result = await approvePhotoAction(photoId)
      if (result.success) {
        setMessage({ type: "success", text: result.message })
        loadData() // Reload photos
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to approve photo" })
    }
  }

  const handleDeletePhoto = async (photoId: number) => {
    if (confirm("Are you sure you want to delete this photo? This action cannot be undone.")) {
      try {
        const result = await deletePhotoAction(photoId)
        if (result.success) {
          setMessage({ type: "success", text: result.message })
          loadData() // Reload photos
        } else {
          setMessage({ type: "error", text: result.message })
        }
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete photo" })
      }
    }
  }

  const handleApproveSong = async (songId: number) => {
    try {
      const result = await approveSongAction(songId)
      if (result.success) {
        setMessage({ type: "success", text: result.message })
        loadData() // Reload songs
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to approve song" })
    }
  }

  const handleDeleteSong = async (songId: number) => {
    if (confirm("Are you sure you want to delete this song? This action cannot be undone.")) {
      try {
        const result = await deleteSongAction(songId)
        if (result.success) {
          setMessage({ type: "success", text: result.message })
          loadData() // Reload songs
        } else {
          setMessage({ type: "error", text: result.message })
        }
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete song" })
      }
    }
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-16 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Admin Login</CardTitle>
            <p className="text-gray-600">Enter your credentials to access the admin panel</p>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Current Credentials:</p>
              <p className="text-sm text-blue-700">Username: {ADMIN_CREDENTIALS.username}</p>
              <p className="text-sm text-blue-700">Password: {ADMIN_CREDENTIALS.password}</p>
              <p className="text-xs text-blue-600 mt-2">
                💡 To change these, update the ADMIN_CREDENTIALS in the code or set environment variables
              </p>
            </div>

            {loginError && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{loginError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <div className="relative">
                  <User className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="Enter username"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Enter password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage photos and songs</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Database Status */}
        <DatabaseStatus />

        {/* Message */}
        {message && (
          <Alert
            className={`mb-6 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <Button
            onClick={() => setActiveTab("pending-photos")}
            variant={activeTab === "pending-photos" ? "default" : "outline"}
            className={activeTab === "pending-photos" ? "bg-gradient-to-r from-orange-500 to-red-500" : ""}
          >
            <Clock className="h-4 w-4 mr-2" />
            Pending Photos ({pendingPhotos.length})
          </Button>
          <Button
            onClick={() => setActiveTab("all-photos")}
            variant={activeTab === "all-photos" ? "default" : "outline"}
            className={activeTab === "all-photos" ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
          >
            <Eye className="h-4 w-4 mr-2" />
            All Photos ({allPhotos.length})
          </Button>
          <Button
            onClick={() => setActiveTab("pending-songs")}
            variant={activeTab === "pending-songs" ? "default" : "outline"}
            className={activeTab === "pending-songs" ? "bg-gradient-to-r from-orange-500 to-red-500" : ""}
          >
            <Clock className="h-4 w-4 mr-2" />
            Pending Songs ({pendingSongs.length})
          </Button>
          <Button
            onClick={() => setActiveTab("all-songs")}
            variant={activeTab === "all-songs" ? "default" : "outline"}
            className={activeTab === "all-songs" ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
          >
            <Eye className="h-4 w-4 mr-2" />
            All Songs ({allSongs.length})
          </Button>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="text-center py-20">
            <Clock className="h-12 w-12 animate-spin mx-auto text-purple-500 mb-4" />
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {(activeTab === "pending-photos"
              ? pendingPhotos
              : activeTab === "all-photos"
                ? allPhotos
                : activeTab === "pending-songs"
                  ? pendingSongs
                  : allSongs
            ).map((item) => {
              if ("image_url" in item) {
                const photo = item as Photo
                return (
                  <Card key={photo.id} className="bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg">{photo.title}</h3>
                        <Badge variant={photo.approved ? "default" : "secondary"}>
                          {photo.approved ? "Approved" : "Pending"}
                        </Badge>
                      </div>

                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={photo.image_url || "/placeholder.svg"}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{photo.description}</p>

                      <div className="space-y-2 text-xs text-gray-500 mb-4">
                        <p>
                          <strong>Date:</strong> {new Date(photo.date).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Uploaded by:</strong> {photo.uploaded_by}
                        </p>
                        {photo.location && (
                          <p>
                            <strong>Location:</strong> {photo.location}
                          </p>
                        )}
                      </div>

                      {photo.tags && photo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {photo.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {!photo.approved && (
                          <Button
                            onClick={() => handleApprovePhoto(photo.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeletePhoto(photo.id)}
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              } else {
                const song = item as Song
                return (
                  <Card key={song.id} className="bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg">{song.title}</h3>
                        <Badge variant={song.approved ? "default" : "secondary"}>
                          {song.approved ? "Approved" : "Pending"}
                        </Badge>
                      </div>

                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 overflow-hidden">
                        {song.thumbnail_url ? (
                          <img
                            src={song.thumbnail_url || "/placeholder.svg"}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Music className="h-12 w-12 text-gray-500" />
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-3">
                        <strong>Artist:</strong> {song.artist}
                      </p>
                      {song.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{song.description}</p>
                      )}

                      <div className="space-y-2 text-xs text-gray-500 mb-4">
                        <p>
                          <strong>Added by:</strong> {song.added_by}
                        </p>
                        {song.mood && (
                          <p>
                            <strong>Mood:</strong> {song.mood}
                          </p>
                        )}
                      </div>

                      {song.tags && song.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {song.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 mb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(song.youtube_url, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          YouTube
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        {!song.approved && (
                          <Button
                            onClick={() => handleApproveSong(song.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteSong(song.id)}
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              }
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading &&
          (activeTab === "pending-photos"
            ? pendingPhotos
            : activeTab === "all-photos"
              ? allPhotos
              : activeTab === "pending-songs"
                ? pendingSongs
                : allSongs
          ).length === 0 && (
            <div className="text-center py-20">
              {activeTab.includes("photos") ? (
                <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              ) : (
                <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              )}
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                {activeTab === "pending-photos"
                  ? "No Pending Photos"
                  : activeTab === "all-photos"
                    ? "No Photos Found"
                    : activeTab === "pending-songs"
                      ? "No Pending Songs"
                      : "No Songs Found"}
              </h3>
              <p className="text-gray-500">
                {activeTab.includes("pending") ? "All items have been reviewed." : "No items have been uploaded yet."}
              </p>
            </div>
          )}
      </div>
    </div>
  )
}

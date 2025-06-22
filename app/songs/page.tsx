"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Music,
  User,
  Upload,
  Loader2,
  AlertCircle,
  ExternalLink,
  Database,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Song {
  id: number
  title: string
  artist: string
  youtube_url: string
  youtube_id: string
  duration?: string
  thumbnail_url?: string
  description?: string
  added_by: string
  tags: string[]
  mood?: string
  lyrics?: string
  approved: boolean
  created_at: string
}

interface Member {
  id: number
  name: string
  nickname?: string
  role: string
  active: boolean
}

// Demo songs for when database is not available
const demoSongs: Song[] = [
  {
    id: 1,
    title: "Squad Anthem",
    artist: "Our Group",
    youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtube_id: "dQw4w9WgXcQ",
    thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    description: "The song that represents our friendship",
    added_by: "Lyteng",
    tags: ["Squad", "Anthem", "Friendship"],
    mood: "Energetic",
    lyrics:
      "We're the squad that never breaks\nThrough all the laughs and all mistakes\nTogether we're unstoppable\nOur friendship is unstoppable",
    approved: true,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    title: "Memory Lane",
    artist: "Nostalgia Crew",
    youtube_url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    youtube_id: "kJQP7kiw5Fk",
    thumbnail_url: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
    description: "For all our beautiful memories together",
    added_by: "Lyheng",
    tags: ["Memories", "Nostalgia", "Friendship"],
    mood: "Nostalgic",
    lyrics:
      "Walking down our memory lane\nEvery step removes the pain\nOf missing all those golden days\nWhen we were young and free to play",
    approved: true,
    created_at: "2023-01-02T00:00:00Z",
  },
  {
    id: 3,
    title: "Best Day Ever",
    artist: "Happy Vibes",
    youtube_url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    youtube_id: "9bZkp7q19f0",
    thumbnail_url: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
    description: "For those perfect sunny days with the squad",
    added_by: "Senghuot",
    tags: ["Happy", "Upbeat", "Sunshine"],
    mood: "Happy",
    lyrics:
      "Today's gonna be the best day ever\nWith my friends, we'll stay together\nLaughing, dancing, having fun\nUntil the setting of the sun",
    approved: true,
    created_at: "2023-01-03T00:00:00Z",
  },
]

// Declare YouTube API
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(75)
  const [showLyrics, setShowLyrics] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const [apiLoaded, setApiLoaded] = useState(false)
  const [playerError, setPlayerError] = useState<string | null>(null)

  // YouTube player ref
  const playerRef = useRef<any>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const apiLoadAttempts = useRef(0)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    youtubeUrl: "",
    description: "",
    addedBy: "",
    tags: "",
    mood: "",
    lyrics: "",
  })

  const formRef = useRef<HTMLFormElement>(null)
  const moods = ["Energetic", "Happy", "Chill", "Nostalgic", "Adventurous", "Romantic", "Uplifting", "Melancholic"]

  // Load YouTube API with retry mechanism
  useEffect(() => {
    const loadYouTubeAPI = () => {
      // Check if API is already loaded
      if (window.YT && window.YT.Player) {
        setApiLoaded(true)
        setPlayerReady(true)
        return
      }

      // Check if script is already loading
      if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        return
      }

      console.log("Loading YouTube IFrame API...")

      // Load YouTube IFrame API
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      tag.async = true
      tag.onerror = () => {
        console.error("Failed to load YouTube API")
        setPlayerError("Failed to load YouTube API. Please check your internet connection.")
      }

      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      // Setup API ready callback
      window.onYouTubeIframeAPIReady = () => {
        console.log("YouTube API loaded successfully!")
        setApiLoaded(true)
        setPlayerReady(true)
        setPlayerError(null)
      }

      // Timeout fallback
      setTimeout(() => {
        if (!apiLoaded && apiLoadAttempts.current < 3) {
          apiLoadAttempts.current++
          console.log(`YouTube API load attempt ${apiLoadAttempts.current}`)
          loadYouTubeAPI()
        } else if (!apiLoaded) {
          setPlayerError("YouTube API failed to load after multiple attempts. Please refresh the page.")
        }
      }, 10000) // 10 second timeout
    }

    loadYouTubeAPI()

    return () => {
      // Cleanup
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy()
        } catch (e) {
          console.log("Player cleanup error:", e)
        }
      }
    }
  }, [])

  // Initialize YouTube player when ready
  useEffect(() => {
    if (apiLoaded && currentSong && playerContainerRef.current && window.YT && window.YT.Player) {
      console.log("Initializing YouTube player for:", currentSong.title)

      // Destroy existing player
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy()
        } catch (e) {
          console.log("Error destroying previous player:", e)
        }
      }

      // Create new player
      try {
        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          height: "0",
          width: "0",
          videoId: currentSong.youtube_id,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              console.log("Player ready!")
              event.target.setVolume(volume)
              const videoDuration = event.target.getDuration()
              setDuration(videoDuration || 0)
              setPlayerError(null)
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true)
                startTimeUpdate()
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false)
                stopTimeUpdate()
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false)
                stopTimeUpdate()
                nextSong()
              }
            },
            onError: (event: any) => {
              console.error("YouTube player error:", event.data)
              let errorMessage = "Video playback error"
              switch (event.data) {
                case 2:
                  errorMessage = "Invalid video ID"
                  break
                case 5:
                  errorMessage = "HTML5 player error"
                  break
                case 100:
                  errorMessage = "Video not found or private"
                  break
                case 101:
                case 150:
                  errorMessage = "Video not available for embedded playback"
                  break
              }
              setPlayerError(errorMessage)
            },
          },
        })
      } catch (error) {
        console.error("Error creating YouTube player:", error)
        setPlayerError("Failed to create video player")
      }
    }
  }, [apiLoaded, currentSong])

  // Time update interval
  const timeUpdateInterval = useRef<NodeJS.Timeout | null>(null)

  const startTimeUpdate = () => {
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current)
    }
    timeUpdateInterval.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        try {
          setCurrentTime(Math.floor(playerRef.current.getCurrentTime()))
        } catch (e) {
          console.log("Error getting current time:", e)
        }
      }
    }, 1000)
  }

  const stopTimeUpdate = () => {
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current)
      timeUpdateInterval.current = null
    }
  }

  // Update volume when changed
  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume) {
      try {
        playerRef.current.setVolume(volume)
      } catch (e) {
        console.log("Error setting volume:", e)
      }
    }
  }, [volume])

  // Load approved songs and members from the API
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      try {
        // Load members
        const membersResponse = await fetch("/api/members")
        const membersData = await membersResponse.json()
        if (membersData.success) {
          setMembers(membersData.members)
        }

        // Load songs
        const songsResponse = await fetch("/api/songs")
        const songsData = await songsResponse.json()

        if (songsData.success) {
          if (songsData.songs.length === 0 && songsData.message) {
            // Database not available, use demo songs
            setSongs(demoSongs)
            setIsDemoMode(true)
          } else {
            setSongs(songsData.songs)
            setIsDemoMode(false)
          }
        } else {
          // Fallback to demo songs
          setSongs(demoSongs)
          setIsDemoMode(true)
        }
      } catch (error) {
        console.error("Failed to load data:", error)
        // Fallback to demo songs
        setSongs(demoSongs)
        setIsDemoMode(true)
      } finally {
        setLoading(false)
      }
    }

    loadData()
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimeUpdate()
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy()
        } catch (e) {
          console.log("Cleanup error:", e)
        }
      }
    }
  }, [])

  const resetForm = () => {
    setFormData({
      title: "",
      artist: "",
      youtubeUrl: "",
      description: "",
      addedBy: "",
      tags: "",
      mood: "",
      lyrics: "",
    })
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

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isDemoMode) {
      setError("Upload feature is not available in demo mode. Please configure your database.")
      return
    }

    setUploading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Validate required fields
      if (!formData.title || !formData.artist || !formData.youtubeUrl || !formData.addedBy) {
        setError("Please fill in all required fields")
        setUploading(false)
        return
      }

      // Create FormData object
      const uploadFormData = new FormData()
      uploadFormData.append("title", formData.title)
      uploadFormData.append("artist", formData.artist)
      uploadFormData.append("youtubeUrl", formData.youtubeUrl)
      uploadFormData.append("description", formData.description)
      uploadFormData.append("addedBy", formData.addedBy)
      uploadFormData.append("tags", formData.tags)
      uploadFormData.append("mood", formData.mood)
      uploadFormData.append("lyrics", formData.lyrics)

      // Use fetch to upload via API route
      const response = await fetch("/api/songs/upload", {
        method: "POST",
        body: uploadFormData,
      })

      const result = await response.json()

      if (result.success) {
        setSuccessMessage(result.message)
        setShowUploadForm(false)
        resetForm()
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

  const selectSong = (song: Song) => {
    console.log("Selecting song:", song.title)
    setCurrentSong(song)
    setCurrentTime(0)
    setIsPlaying(false)
    setShowLyrics(true)
    setPlayerError(null)
    stopTimeUpdate()
  }

  const playPause = () => {
    if (!playerRef.current) {
      setPlayerError("Player not ready. Please wait or refresh the page.")
      return
    }

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo()
        stopTimeUpdate()
      } else {
        playerRef.current.playVideo()
        startTimeUpdate()
      }
    } catch (error) {
      console.error("Error controlling playback:", error)
      setPlayerError("Playback control error. Please try again.")
    }
  }

  const nextSong = () => {
    if (!currentSong) return
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id)
    const nextIndex = (currentIndex + 1) % songs.length
    setCurrentSong(songs[nextIndex])
    setCurrentTime(0)
    setIsPlaying(false)
    stopTimeUpdate()
  }

  const prevSong = () => {
    if (!currentSong) return
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id)
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1
    setCurrentSong(songs[prevIndex])
    setCurrentTime(0)
    setIsPlaying(false)
    stopTimeUpdate()
  }

  const seekTo = (time: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      try {
        playerRef.current.seekTo(time, true)
        setCurrentTime(time)
      } catch (error) {
        console.error("Error seeking:", error)
      }
    }
  }

  const retryPlayer = () => {
    setPlayerError(null)
    setPlayerReady(false)
    setApiLoaded(false)
    apiLoadAttempts.current = 0

    // Remove existing script
    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]')
    if (existingScript) {
      existingScript.remove()
    }

    // Reload the page to restart everything
    window.location.reload()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Our Squad Playlist
          </h1>
          <p className="text-xl text-gray-600 mb-8">Songs that define our friendship</p>

          {/* Demo Mode Alert */}
          {isDemoMode && (
            <Alert className="max-w-2xl mx-auto mb-6 border-blue-200 bg-blue-50">
              <Database className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Demo Mode:</strong> Database not configured. Showing sample songs. Configure your database to
                add real songs.
              </AlertDescription>
            </Alert>
          )}

          {/* Player Error Alert */}
          {playerError && (
            <Alert className="max-w-2xl mx-auto mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 flex items-center justify-between">
                <span>{playerError}</span>
                <Button onClick={retryPlayer} size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

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
              disabled={isDemoMode}
            >
              <Upload className="h-5 w-5 mr-2" />
              Add YouTube Song
            </Button>
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
        {showUploadForm && !isDemoMode && (
          <Card className="max-w-2xl mx-auto mb-12 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-6 text-center">Add a YouTube Song</h3>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  🎵 <strong>Note:</strong> Your song will be reviewed by an admin before appearing in the playlist.
                </p>
              </div>
              <form ref={formRef} onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    YouTube URL <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Song Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter song title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Artist <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="artist"
                      value={formData.artist}
                      onChange={handleInputChange}
                      placeholder="Enter artist name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Why is this song special to our squad?"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="addedBy"
                      value={formData.addedBy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select your name</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.name}>
                          {member.name} {member.nickname && `(${member.nickname})`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Mood</label>
                    <select
                      name="mood"
                      value={formData.mood}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select mood</option>
                      {moods.map((mood) => (
                        <option key={mood} value={mood}>
                          {mood}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., Squad Anthem, Road Trip, Chill Vibes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Lyrics (Optional)</label>
                  <Textarea
                    name="lyrics"
                    value={formData.lyrics}
                    onChange={handleInputChange}
                    placeholder="Add lyrics if you want..."
                    rows={4}
                  />
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
                        Adding Song...
                      </>
                    ) : (
                      "Add Song"
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

        {/* Hidden YouTube Player */}
        <div ref={playerContainerRef} style={{ display: "none" }} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Song List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">All Songs</h2>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-20">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple-500 mb-4" />
                <p className="text-lg text-gray-600">Loading songs...</p>
              </div>
            )}

            {/* Songs Grid */}
            {!loading && (
              <div className="space-y-4">
                {songs.map((song) => (
                  <Card
                    key={song.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      currentSong?.id === song.id ? "ring-2 ring-purple-500 bg-purple-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => selectSong(song)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {song.thumbnail_url ? (
                            <img
                              src={song.thumbnail_url || "/placeholder.svg"}
                              alt={song.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                              <Music className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{song.title}</h3>
                          <p className="text-sm text-gray-600">{song.artist}</p>
                          {song.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{song.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <User className="h-3 w-3 mr-1" />
                            Added by {song.added_by}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(song.youtube_url, "_blank")
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            YouTube
                          </Button>
                        </div>
                        {song.mood && (
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              song.mood === "Energetic"
                                ? "bg-red-100 text-red-800"
                                : song.mood === "Happy"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : song.mood === "Chill"
                                    ? "bg-blue-100 text-blue-800"
                                    : song.mood === "Nostalgic"
                                      ? "bg-purple-100 text-purple-800"
                                      : song.mood === "Adventurous"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-pink-100 text-pink-800"
                            }`}
                          >
                            {song.mood}
                          </div>
                        )}
                      </div>
                      {song.tags && song.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {song.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && songs.length === 0 && (
              <div className="text-center py-12">
                <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">No songs yet</h3>
                <p className="text-gray-500">Be the first to add a song to our playlist!</p>
              </div>
            )}
          </div>

          {/* Player & Lyrics */}
          <div className="space-y-6">
            {/* Player */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {currentSong ? (
                  <>
                    <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                      {currentSong.thumbnail_url ? (
                        <img
                          src={currentSong.thumbnail_url || "/placeholder.svg"}
                          alt={currentSong.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <Music className="h-16 w-16 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{currentSong.title}</h3>
                    <p className="text-gray-600 mb-4">{currentSong.artist}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <Slider
                        value={[currentTime]}
                        max={duration || 100}
                        step={1}
                        className="w-full"
                        onValueChange={(value) => seekTo(value[0])}
                        disabled={!apiLoaded || !!playerError}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <Button variant="ghost" size="sm" onClick={prevSong} disabled={!apiLoaded || !!playerError}>
                        <SkipBack className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={playPause}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                        disabled={!apiLoaded || !!playerError}
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={nextSong} disabled={!apiLoaded || !!playerError}>
                        <SkipForward className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Volume */}
                    <div className="flex items-center space-x-2 mb-4">
                      <Volume2 className="h-4 w-4 text-gray-500" />
                      <Slider
                        value={[volume]}
                        max={100}
                        step={1}
                        className="flex-1"
                        onValueChange={(value) => setVolume(value[0])}
                        disabled={!apiLoaded || !!playerError}
                      />
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(currentSong.youtube_url, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch on YouTube
                      </Button>

                      {currentSong.lyrics && (
                        <Button variant="outline" className="w-full" onClick={() => setShowLyrics(!showLyrics)}>
                          {showLyrics ? "Hide" : "Show"} Lyrics
                        </Button>
                      )}
                    </div>

                    {/* Player Status */}
                    {!apiLoaded && !playerError && (
                      <div className="text-center text-sm text-gray-500 mt-2">
                        <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                        Loading YouTube player...
                      </div>
                    )}

                    {playerError && (
                      <div className="text-center text-sm text-red-500 mt-2">
                        <AlertCircle className="h-4 w-4 inline mr-2" />
                        {playerError}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a song to start playing</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lyrics */}
            {currentSong && currentSong.lyrics && showLyrics && (
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-pink-500" />
                    Lyrics
                  </h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {currentSong.lyrics.split("\n").map((line, index) => (
                      <p key={index} className={`${line === "" ? "mb-4" : "text-gray-700"} leading-relaxed`}>
                        {line}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { getApprovedPhotosAction } from "@/app/actions/photo-actions"
import { getApprovedSongsAction } from "@/app/actions/song-actions"
import { getAllMembersAction } from "@/app/actions/member-actions"
import { Users, Camera, Music, Star, Heart, Zap, Coffee, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { getAllMemoriesAction } from "@/app/actions/memory-actions"

// Helper function to format relative time
function getRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? "s" : ""} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`
}

export default async function HomePage() {
  // Fetch actual counts from database
  const photos = await getApprovedPhotosAction()
  const songs = await getApprovedSongsAction()
  const members = await getAllMembersAction()
  const memories = await getAllMemoriesAction()

  // Get recent activities (most recent photo and song)
  const recentPhoto = photos.length > 0 ? photos[0] : null
  const recentSong = songs.length > 0 ? songs[0] : null

  // Create activities array with actual data
  const recentActivities = []

  if (recentPhoto) {
    recentActivities.push({
      icon: Camera,
      activity: "Photo Added",
      time: getRelativeTime(recentPhoto.created_at),
      user: recentPhoto.uploaded_by,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    })
  }

  if (recentSong) {
    recentActivities.push({
      icon: Music,
      activity: "Song Added",
      time: getRelativeTime(recentSong.created_at),
      user: recentSong.added_by,
      color: "bg-gradient-to-r from-indigo-500 to-blue-500",
    })
  }

  // Sort by most recent first (if we have both)
  recentActivities.sort((a, b) => {
    // Simple sorting - in a real app you'd compare actual dates
    if (a.activity === "Photo Added" && recentPhoto && recentSong) {
      return new Date(recentPhoto.created_at) > new Date(recentSong.created_at) ? -1 : 1
    }
    return 0
  })

  // Take only the 2 most recent
  const displayActivities = recentActivities.slice(0, 2)

  const friendQuotes = [
    "\"We're not just friends, we're a chaotic family!\" - The Squad",
    '"Best memories are made with the craziest friends" - Us',
    '"Friends who laugh together, stay together" - Our Motto',
    "\"Life's better when you're laughing with your squad\" - Always",
    '"We don\'t remember days, we remember moments" - True Story',
  ]

  const stats = [
    {
      icon: Users,
      label: "Squad Members",
      value: members.length.toString(),
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Camera,
      label: "Memories Captured",
      value: photos.length.toString(),
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      icon: Music,
      label: "Songs in Playlist",
      value: songs.length.toString(),
      color: "text-cyan-600",
      bg: "bg-cyan-100",
    },
    { icon: Coffee, label: "Coffee Dates", value: "∞", color: "text-sky-600", bg: "bg-sky-100" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-cyan-200/30 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                <Users className="h-12 w-12 text-white animate-pulse" />
              </div>
              <Heart className="h-8 w-8 text-red-500 absolute -top-2 -right-2 animate-bounce" />
              <Star className="h-6 w-6 text-yellow-400 absolute -bottom-1 -left-2 animate-spin" />
              <Sparkles className="h-5 w-5 text-blue-400 absolute top-2 -left-3 animate-pulse" />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-6 drop-shadow-sm">
            The Friend Group
          </h1>

          <div className="h-16 flex items-center justify-center mb-8">
            <p className="text-2xl text-gray-700 font-medium">{friendQuotes[0]}</p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg"
            >
              <Link href="/songs">
                <Music className="h-5 w-5 mr-2" />
                Listen to Our Playlist
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg"
            >
              <Link href="/our-pictures">
                <Camera className="h-5 w-5 mr-2" />
                View Memories
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Squad Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 ${stat.bg} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-4xl font-bold text-gray-800 mb-3">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activities */}
      <section className="py-20 px-4 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Recent Squad Activities
          </h2>

          {displayActivities.length > 0 ? (
            <div className="space-y-6">
              {displayActivities.map((activity, index) => (
                <Card
                  key={index}
                  className="hover:shadow-2xl transition-all duration-300 transform hover:scale-102 bg-white/90 backdrop-blur-sm border-0 shadow-lg"
                >
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-6">
                      <div className={`p-4 rounded-2xl ${activity.color} shadow-lg`}>
                        <activity.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{activity.activity}</h3>
                        <p className="text-gray-600 font-medium">{activity.time}</p>
                        <p className="text-sm text-gray-500">by {activity.user}</p>
                      </div>
                      <Zap className="h-6 w-6 text-yellow-500 animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Recent Activities</h3>
              <p className="text-gray-500 mb-6">Be the first to add a photo or song!</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-600">
                  <Link href="/our-pictures">
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photo
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-blue-500 text-blue-600">
                  <Link href="/songs">
                    <Music className="h-4 w-4 mr-2" />
                    Add Song
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Memories Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Latest Squad Memories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {memories.length > 0
              ? memories.slice(0, 3).map((memory, index) => (
                  <Card
                    key={memory.id}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg"
                  >
                    <CardContent className="p-8 text-center">
                      <div
                        className={`w-20 h-20 bg-gradient-to-r ${memory.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                      >
                        <span className="text-4xl">{memory.emoji}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">{memory.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{memory.description}</p>
                      <div className="flex justify-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              : // Fallback to default memories if none exist
                [
                  {
                    title: "Beach Day Chaos",
                    description: "When we tried to build a sandcastle but ended up in a sand fight",
                    emoji: "🏖️",
                    gradient: "from-blue-400 to-cyan-500",
                  },
                  {
                    title: "Game Night Madness",
                    description: "The night Sarah flipped the Monopoly board",
                    emoji: "🎮",
                    gradient: "from-indigo-400 to-blue-500",
                  },
                  {
                    title: "Coffee Shop Takeover",
                    description: "We literally stayed for 6 hours and they had to kick us out",
                    emoji: "☕",
                    gradient: "from-cyan-400 to-teal-500",
                  },
                ].map((memory, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg"
                  >
                    <CardContent className="p-8 text-center">
                      <div
                        className={`w-20 h-20 bg-gradient-to-r ${memory.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                      >
                        <span className="text-4xl">{memory.emoji}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">{memory.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{memory.description}</p>
                      <div className="flex justify-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
          <div className="text-center mt-12">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg"
            >
              <Link href="/our-pictures">
                <Camera className="h-5 w-5 mr-2" />
                See All Our Crazy Memories
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold mb-8">Ready to Add More Memories?</h2>
          <p className="text-xl mb-12 opacity-90 leading-relaxed">
            Upload your photos, add songs, and keep our squad story growing!
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button
              asChild
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg font-semibold"
            >
              <Link href="/our-pictures">
                <Camera className="h-5 w-5 mr-2" />
                Upload Photos
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg font-semibold"
            >
              <Link href="/songs">
                <Music className="h-5 w-5 mr-2" />
                Add Songs
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

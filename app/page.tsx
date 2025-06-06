"use client"

import { useState, useEffect } from "react"
import { Users, Camera, Music, Star, Heart, Zap, Coffee, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const friendQuotes = [
    "\"We're not just friends, we're a chaotic family!\" - The Squad",
    '"Best memories are made with the craziest friends" - Us',
    '"Friends who laugh together, stay together" - Our Motto',
    "\"Life's better when you're laughing with your squad\" - Always",
    '"We don\'t remember days, we remember moments" - True Story',
  ]

  const stats = [
    { icon: Users, label: "Squad Members", value: "8", color: "text-purple-600" },
    { icon: Camera, label: "Memories Captured", value: "247", color: "text-pink-600" },
    { icon: Music, label: "Songs in Playlist", value: "42", color: "text-orange-600" },
    { icon: Coffee, label: "Coffee Dates", value: "∞", color: "text-amber-600" },
  ]

  const recentActivities = [
    { icon: Camera, activity: "Beach Trip Photos", time: "2 days ago", color: "bg-blue-500" },
    { icon: Music, activity: "New Song Added", time: "1 week ago", color: "bg-purple-500" },
    { icon: Gamepad2, activity: "Game Night Pics", time: "2 weeks ago", color: "bg-green-500" },
    { icon: Coffee, activity: "Cafe Hangout", time: "3 weeks ago", color: "bg-amber-500" },
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % friendQuotes.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsVisible(false)
    const timeout = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timeout)
  }, [currentQuote])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Users className="h-20 w-20 text-purple-600 animate-bounce" />
              <Heart className="h-8 w-8 text-pink-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-6">
            Our Squad
          </h1>
          <div className="h-16 flex items-center justify-center">
            <p
              className={`text-2xl text-gray-700 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
            >
              {friendQuotes[currentQuote]}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              asChild
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Link href="/songs">
                <Music className="h-5 w-5 mr-2" />
                Listen to Our Playlist
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50">
              <Link href="/our-pictures">
                <Camera className="h-5 w-5 mr-2" />
                View Memories
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Squad Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                  <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activities */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Recent Squad Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:scale-105 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${activity.color}`}>
                      <activity.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{activity.activity}</h3>
                      <p className="text-gray-600">{activity.time}</p>
                    </div>
                    <Zap className="h-5 w-5 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Memories Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Latest Squad Memories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Beach Day Chaos",
                desc: "When we tried to build a sandcastle but ended up in a sand fight",
                emoji: "🏖️",
              },
              { title: "Game Night Madness", desc: "The night Sarah flipped the Monopoly board", emoji: "🎮" },
              {
                title: "Coffee Shop Takeover",
                desc: "We literally stayed for 6 hours and they had to kick us out",
                emoji: "☕",
              },
            ].map((memory, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-white to-purple-50"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{memory.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{memory.title}</h3>
                  <p className="text-gray-600 mb-4">{memory.desc}</p>
                  <div className="flex justify-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              asChild
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Add More Memories?</h2>
          <p className="text-xl mb-8 opacity-90">Upload your photos, add songs, and keep our squad story growing!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/our-pictures">
                <Camera className="h-5 w-5 mr-2" />
                Upload Photos
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
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

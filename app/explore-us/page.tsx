"use client"

import { useState } from "react"
import { Heart, Music, Camera, MapPin, Star, Coffee, Sunset } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ExploreUsPage() {
  const [activeTab, setActiveTab] = useState("memories")

  const tabs = [
    { id: "memories", label: "Memories", icon: Camera },
    { id: "places", label: "Places", icon: MapPin },
    { id: "music", label: "Our Playlist", icon: Music },
    { id: "dreams", label: "Dreams", icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">Explore Us</h1>
          <p className="text-xl text-gray-600">Dive deeper into our world of love and memories</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`${
                activeTab === tab.id ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" : "hover:bg-pink-50"
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "memories" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "First Coffee Date",
                  description: "The nervous excitement of our first official date",
                  icon: Coffee,
                  color: "from-amber-400 to-orange-500",
                },
                {
                  title: "Sunset Walks",
                  description: "Our favorite evening ritual together",
                  icon: Sunset,
                  color: "from-orange-400 to-pink-500",
                },
                {
                  title: "Dancing in the Rain",
                  description: "That spontaneous moment that became our favorite memory",
                  icon: Heart,
                  color: "from-blue-400 to-purple-500",
                },
                {
                  title: "Cooking Together",
                  description: "Creating delicious disasters and perfect moments",
                  icon: Heart,
                  color: "from-green-400 to-teal-500",
                },
                {
                  title: "Movie Marathons",
                  description: "Cozy nights with popcorn and endless laughter",
                  icon: Heart,
                  color: "from-purple-400 to-pink-500",
                },
                {
                  title: "Adventure Days",
                  description: "Exploring new places and making memories",
                  icon: MapPin,
                  color: "from-red-400 to-pink-500",
                },
              ].map((memory, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${memory.color} rounded-full flex items-center justify-center mb-4`}
                    >
                      <memory.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{memory.title}</h3>
                    <p className="text-gray-600">{memory.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "places" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: "Central Park",
                  description: "Where we had our first picnic and countless walks",
                  significance: "Our special place for quiet conversations",
                },
                {
                  name: "The Coffee Shop on 5th",
                  description: "Our regular spot for morning coffee and weekend brunches",
                  significance: "Where we planned our future together",
                },
                {
                  name: "Sunset Beach",
                  description: "Our favorite spot to watch the sun disappear into the horizon",
                  significance: "Where we shared our first 'I love you'",
                },
                {
                  name: "The Little Bookstore",
                  description: "Where we spend hours browsing and sharing book recommendations",
                  significance: "Our intellectual connection grows here",
                },
              ].map((place, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <MapPin className="h-8 w-8 text-pink-500 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-800">{place.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-3">{place.description}</p>
                    <div className="bg-pink-50 p-3 rounded-lg">
                      <p className="text-pink-800 font-medium">{place.significance}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "music" && (
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Music className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Love Playlist</h2>
                  <p className="text-gray-600">Songs that soundtrack our love story</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Our Forever", artist: "Original Song", note: "The song we wrote together" },
                    { title: "Perfect", artist: "Ed Sheeran", note: "Our first dance song" },
                    { title: "All of Me", artist: "John Legend", note: "Reminds us of our wedding dreams" },
                    { title: "Thinking Out Loud", artist: "Ed Sheeran", note: "Our road trip anthem" },
                    { title: "A Thousand Years", artist: "Christina Perri", note: "How long we want to love" },
                    { title: "Make You Feel My Love", artist: "Adele", note: "Our rainy day comfort song" },
                  ].map((song, index) => (
                    <div key={index} className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800">{song.title}</h4>
                      <p className="text-gray-600 text-sm mb-1">by {song.artist}</p>
                      <p className="text-pink-700 text-sm italic">{song.note}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "dreams" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <Star className="h-12 w-12 text-yellow-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Short-term Dreams</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <Heart className="h-4 w-4 text-pink-500 mr-2" />
                      Plan our dream vacation to Paris
                    </li>
                    <li className="flex items-center">
                      <Heart className="h-4 w-4 text-pink-500 mr-2" />
                      Learn to dance together
                    </li>
                    <li className="flex items-center">
                      <Heart className="h-4 w-4 text-pink-500 mr-2" />
                      Create a photo book of our memories
                    </li>
                    <li className="flex items-center">
                      <Heart className="h-4 w-4 text-pink-500 mr-2" />
                      Take cooking classes together
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <Star className="h-12 w-12 text-purple-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Long-term Dreams</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <Heart className="h-4 w-4 text-pink-500 mr-2" />
                      Build our dream home together
                    </li>
                    <li className="flex items-center">
                      <Heart className="h-4 w-4 text-pink-500 mr-2" />
                      Travel the world hand in hand
                    </li>
                    <li className="flex items-center">
                      <Heart className="h-4 w-4 text-pink-500 mr-2" />
                      Grow old together gracefully
                    </li>
                    <li className="flex items-center">
                      <Heart className="h-4 w-4 text-pink-500 mr-2" />
                      Create a legacy of love
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { Heart, Calendar, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">About Us</h1>
          <p className="text-xl text-gray-600">The story of how two hearts became one</p>
        </div>

        <div className="space-y-12">
          {/* Our Story */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <Heart className="h-12 w-12 text-pink-500" />
              </div>
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Our Love Story</h2>
              <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Our journey began like a beautiful melody, two souls finding harmony in each other's presence. From
                  the very first moment we met, there was something magical in the air - a connection that transcended
                  words and touched the deepest parts of our hearts.
                </p>
                <p className="mb-4">
                  Through laughter and tears, adventures and quiet moments, we've built a love that grows stronger with
                  each passing day. Every sunrise brings new reasons to cherish what we have, and every sunset reminds
                  us of the beautiful memories we've created together.
                </p>
                <p>
                  This website is our digital love letter to the world - a place where we can share our journey, our
                  photos, and the song that plays in our hearts whenever we're together.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Timeline</h2>
              <div className="space-y-8">
                {[
                  {
                    date: "First Meeting",
                    title: "When Our Eyes First Met",
                    description: "The moment that changed everything - a chance encounter that felt like destiny.",
                    icon: Star,
                  },
                  {
                    date: "First Date",
                    title: "Coffee and Conversations",
                    description: "Hours felt like minutes as we talked about dreams, hopes, and everything in between.",
                    icon: Heart,
                  },
                  {
                    date: "First 'I Love You'",
                    title: "Three Little Words",
                    description: "The words that sealed our hearts together forever, spoken under a starlit sky.",
                    icon: Heart,
                  },
                  {
                    date: "Today",
                    title: "Still Writing Our Story",
                    description: "Every day is a new chapter in our beautiful love story that continues to unfold.",
                    icon: Calendar,
                  },
                ].map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                        <milestone.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{milestone.title}</h3>
                        <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                          {milestone.date}
                        </span>
                      </div>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fun Facts */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Fun Facts About Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Favorite Song Together", value: "Our Forever (the one on our homepage!)" },
                  { label: "Dream Destination", value: "Paris, the city of love" },
                  { label: "Favorite Activity", value: "Watching sunsets together" },
                  { label: "Our Anniversary", value: "Every day feels like one!" },
                  { label: "Shared Hobby", value: "Photography and making memories" },
                  { label: "Future Plans", value: "Growing old together, hand in hand" },
                ].map((fact, index) => (
                  <div key={index} className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-1">{fact.label}</h4>
                    <p className="text-gray-600">{fact.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

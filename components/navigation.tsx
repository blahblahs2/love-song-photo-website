"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Users, Music, Camera, Heart, Star } from "lucide-react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-xl fixed top-0 w-full z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <Star className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                The Friend Group
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-blue-200 transition-all duration-300 flex items-center group">
              <Heart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Home
            </Link>
            <Link
              href="/our-pictures"
              className="hover:text-blue-200 transition-all duration-300 flex items-center group"
            >
              <Camera className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Our Pictures
            </Link>
            <Link href="/songs" className="hover:text-blue-200 transition-all duration-300 flex items-center group">
              <Music className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Songs
            </Link>
            <Link
              href="/admin"
              className="hover:text-blue-200 transition-all duration-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-blue-200 transition-colors">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-blue-800/95 backdrop-blur-sm rounded-lg mt-2 mb-4">
            <div className="px-4 pt-2 pb-3 space-y-2">
              <Link
                href="/"
                className="block hover:text-blue-200 transition-colors py-2 px-2 rounded hover:bg-white/10"
              >
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Home
                </div>
              </Link>
              <Link
                href="/our-pictures"
                className="block hover:text-blue-200 transition-colors py-2 px-2 rounded hover:bg-white/10"
              >
                <div className="flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  Our Pictures
                </div>
              </Link>
              <Link
                href="/songs"
                className="block hover:text-blue-200 transition-colors py-2 px-2 rounded hover:bg-white/10"
              >
                <div className="flex items-center">
                  <Music className="h-4 w-4 mr-2" />
                  Songs
                </div>
              </Link>
              <Link
                href="/admin"
                className="block hover:text-blue-200 transition-colors py-2 px-2 rounded hover:bg-white/10"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

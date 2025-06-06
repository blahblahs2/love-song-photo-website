"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Users, Music, Camera, Heart } from "lucide-react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-white mr-2" />
            <span className="font-bold text-xl">Our Squad Memories</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-yellow-200 transition-colors flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              Home
            </Link>
            <Link href="/about-us" className="hover:text-yellow-200 transition-colors flex items-center">
              <Users className="h-4 w-4 mr-1" />
              About Us
            </Link>
            <Link href="/our-pictures" className="hover:text-yellow-200 transition-colors flex items-center">
              <Camera className="h-4 w-4 mr-1" />
              Our Pictures
            </Link>
            <Link href="/songs" className="hover:text-yellow-200 transition-colors flex items-center">
              <Music className="h-4 w-4 mr-1" />
              Songs
            </Link>
            <Link href="/explore-us" className="hover:text-yellow-200 transition-colors">
              Explore Us
            </Link>
            <Link href="/admin" className="hover:text-yellow-200 transition-colors">
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-yellow-200">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block hover:text-yellow-200 transition-colors py-2">
                Home
              </Link>
              <Link href="/about-us" className="block hover:text-yellow-200 transition-colors py-2">
                About Us
              </Link>
              <Link href="/our-pictures" className="block hover:text-yellow-200 transition-colors py-2">
                Our Pictures
              </Link>
              <Link href="/songs" className="block hover:text-yellow-200 transition-colors py-2">
                Songs
              </Link>
              <Link href="/explore-us" className="block hover:text-yellow-200 transition-colors py-2">
                Explore Us
              </Link>
              <Link href="/admin" className="block hover:text-yellow-200 transition-colors py-2">
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

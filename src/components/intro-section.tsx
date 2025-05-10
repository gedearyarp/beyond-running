"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function IntroSection() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled down
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
      console.log(scrolled)
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  return (
    <>
      {/* Full-screen intro section */}
      <div className="relative h-screen w-full">
        {/* GIF Background */}
        <div className="absolute inset-0">
          <Image src="/images/intro.gif" alt="Nature trail" fill className="object-cover" priority />
        </div>

        {/* Brand Text */}
        <div className="absolute bottom-20 left-0 right-0 text-center text-white">
          <p className="text-sm font-bold font-avant-garde mb-2 underline">SCROLL DOWN TO EXPLORE</p>
        </div>

        {/* Subtle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-70">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          overflow-x: hidden;
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  )
}

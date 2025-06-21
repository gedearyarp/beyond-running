"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

export default function IntroSection() {
  const [removed, setRemoved] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Jika intro section sudah tidak terlihat (scrolled past)
        if (!entries[0].isIntersecting && entries[0].boundingClientRect.y < 0) {
          // Tunggu sebentar untuk memastikan user benar-benar scroll ke bawah
          setTimeout(() => {
            setRemoved(true)
          }, 100)

          // Hapus observer setelah digunakan
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current)
          }
        }
      },
      { threshold: 0.1 }, // Trigger ketika 10% section sudah tidak terlihat
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  if (removed) return null

  return (
    <div ref={sectionRef} className="relative h-screen w-full z-50 -mt-[88px]">
      {/* GIF Background */}
      <div className="absolute inset-0">
        <Image src="/images/intro.gif" alt="Nature trail" fill className="object-cover" priority />
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Brand Text */}
      <div className="absolute bottom-20 left-0 right-0 text-center text-white">
        <p className="text-sm font-itc-bold mb-2 underline animate-pulse">SCROLL DOWN TO EXPLORE</p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-70">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center relative overflow-hidden">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
          <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-ping"></div>
        </div>
      </div>
    </div>
  )
}

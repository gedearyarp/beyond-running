"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, Search, ShoppingBag } from "lucide-react"

interface MobileHeaderProps {
  onMenuClick?: () => void
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  // Mendeteksi scroll untuk memberikan efek visual pada header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      {/* Announcement Bar */}
      <div className="w-full bg-black text-white text-center py-2 text-xs fixed top-0 left-0 right-0 z-50">
        Free Shipping On All Orders Above Rp 599,999
      </div>

      <header
        className={`fixed top-8 left-0 right-0 flex items-center justify-between px-4 py-4 bg-white z-50 md:hidden transition-shadow ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <button onClick={onMenuClick} aria-label="Menu">
          <Menu className="h-6 w-6" />
        </button>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-4 text-lg font-bold">
          <Link href="/">BEYOND:RUNNING</Link>
        </div>

        <div className="flex items-center space-x-4">
          <button aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
          <Link href="/cart" aria-label="Shopping cart">
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </header>
    </>
  )
}

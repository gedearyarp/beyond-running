"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, Search, ShoppingBag, X } from "lucide-react"
import { useCartStore } from "@/store/cart"

interface MobileHeaderProps {
  onMenuClick: () => void
  onCartClick: () => void
  isMenuOpen: boolean
  onSearchClick: () => void
}

export default function MobileHeader({ onMenuClick, onCartClick, isMenuOpen, onSearchClick }: MobileHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { getTotalItems } = useCartStore()
  const cartItemCount = getTotalItems()

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

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Announcement Bar */}
      <div className="w-full bg-black text-white text-center py-2 text-xs fixed top-0 left-0 right-0 z-50 animate-slide-down">
        Free Shipping On All Orders Above Rp 599,999
      </div>

      <header
        className={`fixed top-8 left-0 right-0 flex items-center justify-between px-4 py-4 bg-white z-50 md:hidden transition-all duration-500 ease-in-out transform ${
          isScrolled ? "shadow-md" : ""
        } animate-slide-down`}
      >
        <button
          onClick={onMenuClick}
          className="p-2 -m-2 text-gray-400 hover:text-gray-500"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-4 text-lg font-folio-bold">
          <Link href="/">BEYOND:RUNNING</Link>
        </div>

        <div className="flex items-center space-x-4">
          <button aria-label="Search" onClick={onSearchClick}>
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={onCartClick}
            className="relative p-2 -m-2 text-gray-400 hover:text-gray-500"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {mounted && cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  )
}

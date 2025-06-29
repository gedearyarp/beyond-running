"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { X, Search, ShoppingBag } from "lucide-react"
import ShopSubmenu from "./mobile-menu/shop-submenu"
import PeripheralsSubmenu from "./mobile-menu/peripherals-submenu"
import CommunitySubmenu from "./mobile-menu/community-submenu"
import { useCollectionsStore } from "@/store/collections"

type MenuView = "main" | "shop" | "peripherals" | "community"

interface MobileMenuProps {
  onClose: () => void
  onCartClick?: () => void
  cartItemCount?: number
}

export default function MobileMenu({ onClose, onCartClick, cartItemCount = 0 }: MobileMenuProps) {
  const [currentView, setCurrentView] = useState<MenuView>("main")
  const [isVisible, setIsVisible] = useState(false)
  const { refreshCollections } = useCollectionsStore()

  // Animation effect when component mounts
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const navigateTo = (view: MenuView) => {
    setCurrentView(view)
    // Refresh collections when shop submenu is opened
    if (view === "shop") {
      refreshCollections()
    }
  }

  const goBack = () => {
    setCurrentView("main")
  }

  const handleCartClick = () => {
    onClose() // Close mobile menu first
    onCartClick?.() // Then open cart
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300) // Wait for animation to complete
  }

  return (
    <div className={`fixed inset-0 bg-white z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={handleClose} aria-label="Close menu" className="cursor-pointer">
          <X className="h-6 w-6" />
        </button>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-4 text-lg font-folio-bold">
          <Link href="/">BEYOND:RUNNING</Link>
        </div>

      </div>

      {/* Back to Menu link (only shown in submenus) */}
      {currentView !== "main" && (
        <div className="px-2 py-2 animate-fade-in">
          <button onClick={goBack} className="text-sm text-gray-800 underline cursor-pointer font-folio-medium">
            &lt;Back to Menu
          </button>
        </div>
      )}

      {/* Menu Content */}
      {currentView === "main" && (
        <div className="px-6 py-12">
          <nav className="space-y-6">
            {[
              { text: "Shop", action: () => navigateTo("shop") },
              { text: "Peripherals", action: () => navigateTo("peripherals") },
              { text: "Community", action: () => navigateTo("community") },
              { text: "About", href: "/about" }
            ].map((item, index) => (
              <div key={item.text} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                {item.href ? (
                  <Link href={item.href} className="block font-folio-bold text-lg">
                    {item.text}
                  </Link>
                ) : (
                  <button onClick={item.action} className="block font-folio-bold text-lg text-left cursor-pointer">
                    {item.text}
                  </button>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-40 flex space-x-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <Link href="/signin" className="font-folio-medium text-lg underline">
              Login
            </Link>
            <Link href="/register" className="font-folio-medium text-lg underline">
              Sign Up
            </Link>
          </div>
        </div>
      )}

      {/* Shop Submenu */}
      {currentView === "shop" && (
        <div className="animate-slide-in">
          <ShopSubmenu />
        </div>
      )}

      {/* Peripherals Submenu */}
      {currentView === "peripherals" && (
        <div className="animate-slide-in">
          <PeripheralsSubmenu />
        </div>
      )}

      {/* Community Submenu */}
      {currentView === "community" && (
        <div className="animate-slide-in">
          <CommunitySubmenu />
        </div>
      )}
    </div>
  )
}

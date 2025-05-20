"use client"
import { useState } from "react"
import Link from "next/link"
import { X, Search, ShoppingBag } from "lucide-react"
import ShopSubmenu from "./mobile-menu/shop-submenu"
import PeripheralsSubmenu from "./mobile-menu/peripherals-submenu"
import CommunitySubmenu from "./mobile-menu/community-submenu"

type MenuView = "main" | "shop" | "peripherals" | "community"

interface MobileMenuProps {
  onClose: () => void
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const [currentView, setCurrentView] = useState<MenuView>("main")

  const navigateTo = (view: MenuView) => {
    setCurrentView(view)
  }

  const goBack = () => {
    setCurrentView("main")
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={onClose} aria-label="Close menu">
          <X className="h-6 w-6" />
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
      </div>

      {/* Back to Menu link (only shown in submenus) */}
      {currentView !== "main" && (
        <div className="px-2 py-2">
          <button onClick={goBack} className="text-sm text-gray-800 underline">
            &lt;Back to Menu
          </button>
        </div>
      )}

      {/* Menu Content */}
      {currentView === "main" && (
        <div className="px-6 py-12">
          <nav className="space-y-6">
            <div>
              <button onClick={() => navigateTo("shop")} className="block font-bold text-lg text-left">
                Shop
              </button>
            </div>

            <div>
              <button onClick={() => navigateTo("peripherals")} className="block font-bold text-lg text-left">
                Peripherals
              </button>
            </div>

            <div>
              <button onClick={() => navigateTo("community")} className="block font-bold text-lg text-left">
                Community
              </button>
            </div>

            <div>
              <Link href="/about" className="block font-bold text-lg">
                About
              </Link>
            </div>
          </nav>

          <div className="mt-40 flex space-x-8">
            <Link href="/login" className="font-medium text-lg underline">
              Login
            </Link>
            <Link href="/register" className="font-medium text-lg underline">
              Sign Up
            </Link>
          </div>
        </div>
      )}

      {/* Shop Submenu */}
      {currentView === "shop" && <ShopSubmenu />}

      {/* Peripherals Submenu */}
      {currentView === "peripherals" && <PeripheralsSubmenu />}

      {/* Community Submenu */}
      {currentView === "community" && <CommunitySubmenu />}
    </div>
  )
}

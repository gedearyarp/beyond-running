"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, User, ShoppingBag } from "lucide-react"

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const handleMouseEnter = (dropdown: string) => {
    setActiveDropdown(dropdown)
  }

  const handleMouseLeave = () => {
    setActiveDropdown(null)
  }

  return (
    <header className="w-full relative z-50">
      {/* Announcement Bar */}
      <div className="w-full bg-black text-white text-center py-2 text-xs">
        Free Shipping On All Orders Above Rp 599,999
      </div>

      {/* Main Navigation */}
      <div className="relative bg-white">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
          {/* Left Navigation */}
          <nav className="flex space-x-6">
            <div onMouseEnter={() => handleMouseEnter("shop")} onMouseLeave={handleMouseLeave}>
              <Link
                href="/shop"
                className={`text-sm font-medium ${activeDropdown === "shop" ? "text-orange-500" : ""}`}
              >
                Shop
              </Link>
            </div>

            <div onMouseEnter={() => handleMouseEnter("peripherals")} onMouseLeave={handleMouseLeave}>
              <Link
                href="/peripherals"
                className={`text-sm font-medium ${activeDropdown === "peripherals" ? "text-orange-500" : ""}`}
              >
                Peripherals
              </Link>
            </div>

            <div onMouseEnter={() => handleMouseEnter("community")} onMouseLeave={handleMouseLeave}>
              <Link
                href="/community"
                className={`text-sm font-medium ${activeDropdown === "community" ? "text-orange-500" : ""}`}
              >
                Community
              </Link>
            </div>
            <div>
              <Link href="/about" className="text-sm font-medium">
                About
              </Link>
            </div>
          </nav>

          {/* Logo - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold">
            <Link href="/">BEYOND:RUNNING</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <button aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/account" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/cart" aria-label="Shopping cart" className="flex items-center">
              <ShoppingBag className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Dropdown Menus */}
        <div
          className={`absolute left-0 right-0 bg-white border-b border-gray-200 px-8 py-6 ${
            activeDropdown ? "block" : "hidden"
          }`}
          onMouseEnter={() => setActiveDropdown(activeDropdown)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Shop Dropdown */}
          {activeDropdown === "shop" && (
            <div className="flex">
              <div className="mr-16">
                <Link
                  href="/shop"
                  className="inline-block bg-gray-200 text-black rounded-full px-4 py-2 text-sm font-medium mb-6"
                >
                  Discover All
                </Link>
              </div>
              <div className="mr-16">
                <ul className="space-y-3">
                  <li>
                    <Link href="/shop/men" className="text-sm hover:underline">
                      Men
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/women" className="text-sm hover:underline">
                      Women
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/all" className="text-sm hover:underline">
                      All
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mr-16">
                <ul className="space-y-3">
                  <li>
                    <Link href="/shop/new-arrivals" className="text-sm hover:underline">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/runners-favorite" className="text-sm hover:underline">
                      Runner's Favorite
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/running-tops" className="text-sm hover:underline">
                      Running Tops
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/running-bottoms" className="text-sm hover:underline">
                      Running Bottoms
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/post-run" className="text-sm hover:underline">
                      Post Run
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/accessories" className="text-sm hover:underline">
                      Accessories
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3">
                  <li>
                    <Link href="/shop/moment-of-stillness" className="text-sm hover:underline">
                      Moment of Stillness
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/prototype-collection" className="text-sm hover:underline">
                      Prototype Collection
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/running-series" className="text-sm hover:underline">
                      Running Series
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/end-of-summer" className="text-sm hover:underline">
                      End of Summer
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/celebration-of-running" className="text-sm hover:underline">
                      Celebration of Running
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop/past-seasons" className="text-sm hover:underline">
                      More Past Season's Collections
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Peripherals Dropdown */}
          {activeDropdown === "peripherals" && (
            <div className="flex">
              <div className="mr-16">
                <Link
                  href="/peripherals"
                  className="inline-block bg-gray-200 text-black rounded-full px-4 py-2 text-sm font-medium mb-6"
                >
                  Read All
                </Link>
              </div>
              <div>
                <ul className="space-y-3">
                  <li>
                    <Link href="/peripherals/discovery" className="text-sm hover:underline">
                      Discovery
                    </Link>
                  </li>
                  <li>
                    <Link href="/peripherals/clarity" className="text-sm hover:underline">
                      Clarity
                    </Link>
                  </li>
                  <li>
                    <Link href="/peripherals/community" className="text-sm hover:underline">
                      Community
                    </Link>
                  </li>
                  <li>
                    <Link href="/peripherals/all" className="text-sm hover:underline">
                      All
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Community Dropdown */}
          {activeDropdown === "community" && (
            <div className="flex">
              <div className="mr-16">
                <Link
                  href="/community/join"
                  className="inline-block bg-gray-200 text-black rounded-full px-4 py-2 text-sm font-medium mb-6"
                >
                  Join Now
                </Link>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/community?view=upcoming" className="text-sm hover:underline">
                    Upcoming Events
                  </Link>
                </li>
                <li>
                  <Link href="/community?view=past" className="text-sm hover:underline">
                    Past Events
                  </Link>
                </li>
                <li>
                  <Link href="/community?view=calendar" className="text-sm hover:underline">
                    Calendar
                  </Link>
                </li>
                <li>
                  <Link href="/community/membership" className="text-sm hover:underline">
                    Membership
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

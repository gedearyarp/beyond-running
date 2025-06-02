"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Search, User, ShoppingBag } from "lucide-react"
import CartDropdown, { type CartItem } from "./cart-dropdown"
import MobileHeader from "@/components/mobile-header"
import MobileMenu from "@/components/mobile-menu"

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "BEATER LONGSLEEVE",
      size: "2",
      color: "Olive",
      price: "Rp480.000",
      priceNumber: 480000,
      quantity: 1,
      image: "/placeholder.svg?height=200&width=160&query=black longsleeve shirt",
    },
  ])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Close dropdown on scroll
      if (activeDropdown) {
        setActiveDropdown(null)
      }
      if (isCartOpen) {
        setIsCartOpen(false)
      }
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [activeDropdown, isCartOpen, mobileMenuOpen])

  // Clear timeout helper
  const clearExistingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // Handle mouse enter with immediate response
  const handleMouseEnter = useCallback(
    (dropdown: string) => {
      clearExistingTimeout()
      setActiveDropdown(dropdown)
      setIsCartOpen(false)
    },
    [clearExistingTimeout],
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
        setIsCartOpen(false)
      }
    }

    if (activeDropdown || isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeDropdown, isCartOpen])

  // Close dropdown with Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null)
        setIsCartOpen(false)
        setMobileMenuOpen(false)
      }
    }

    if (activeDropdown || isCartOpen || mobileMenuOpen) {
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [activeDropdown, isCartOpen, mobileMenuOpen])

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id)
      return
    }
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const handleRemoveItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen)
    setActiveDropdown(null) // Close navigation dropdown when opening cart
    setMobileMenuOpen(false) // Close mobile menu when opening cart
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    setIsCartOpen(false) // Close cart when opening mobile menu
    setActiveDropdown(null) // Close dropdown when opening mobile menu
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearExistingTimeout()
    }
  }, [clearExistingTimeout])

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      {/* Desktop Header */}
      <header
        ref={headerRef}
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-shadow hidden md:block ${isScrolled ? "shadow-md" : ""}`}
      >
        {/* Announcement Bar */}
        <div className="w-full bg-black text-white text-center py-2 text-xs">
          Free Shipping On All Orders Above Rp 599,999
        </div>

        {/* Main Navigation Container */}
        <div className="relative bg-white" onMouseEnter={clearExistingTimeout}>
          {/* Navigation Bar */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
            {/* Left Navigation */}
            <nav className="flex space-x-6">
              <div onMouseEnter={() => handleMouseEnter("shop")} className="relative py-2">
                <Link
                  href="/shop"
                  className={`text-sm font-medium transition-all duration-300 ${
                    activeDropdown === "shop"
                      ? "text-orange-500 transform scale-105"
                      : "hover:text-orange-500 hover:transform hover:scale-105"
                  }`}
                >
                  Shop
                </Link>
              </div>

              <div onMouseEnter={() => handleMouseEnter("peripherals")} className="relative py-2">
                <Link
                  href="/peripherals"
                  className={`text-sm font-medium transition-all duration-300 ${
                    activeDropdown === "peripherals"
                      ? "text-orange-500 transform scale-105"
                      : "hover:text-orange-500 hover:transform hover:scale-105"
                  }`}
                >
                  Peripherals
                </Link>
              </div>

              <div onMouseEnter={() => handleMouseEnter("community")} className="relative py-2">
                <Link
                  href="/community"
                  className={`text-sm font-medium transition-all duration-300 ${
                    activeDropdown === "community"
                      ? "text-orange-500 transform scale-105"
                      : "hover:text-orange-500 hover:transform hover:scale-105"
                  }`}
                >
                  Community
                </Link>
              </div>
              <div className="relative py-2">
                <Link
                  href="/about"
                  className="text-sm font-medium hover:text-orange-500 hover:transform hover:scale-105 transition-all duration-300"
                  onMouseEnter={() => {
                    clearExistingTimeout()
                    setActiveDropdown(null)
                  }}
                >
                  About
                </Link>
              </div>
            </nav>

            {/* Logo - Centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold">
              <Link
                href="/"
                className={`hover:transform hover:scale-105 transition-all duration-300 ${activeDropdown ? "text-[#ADADAD]" : ""}`}
                onMouseEnter={() => {
                  clearExistingTimeout()
                  setActiveDropdown(null)
                }}
              >
                BEYOND:RUNNING
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-6">
              <button
                aria-label="Search"
                className="hover:text-orange-500 hover:transform hover:scale-110 hover:rotate-12 transition-all duration-300 p-2"
                onMouseEnter={() => {
                  clearExistingTimeout()
                  setActiveDropdown(null)
                }}
              >
                <Search className={`h-5 w-5 ${activeDropdown ? "text-[#ADADAD]" : ""}`} />
              </button>
              <Link
                href="/profile"
                aria-label="Profile"
                className="hover:text-orange-500 hover:transform hover:scale-110 hover:-rotate-12 transition-all duration-300 p-2"
                onMouseEnter={() => {
                  clearExistingTimeout()
                  setActiveDropdown(null)
                }}
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={handleCartClick}
                className={`text-sm font-medium transition-all duration-300 relative ${
                  activeDropdown
                    ? "text-gray-400 hover:text-orange-500 hover:transform hover:scale-105"
                    : "text-black hover:text-orange-500 hover:transform hover:scale-105"
                }`}
                onMouseEnter={() => {
                  clearExistingTimeout()
                  setActiveDropdown(null)
                }}
              >
                <ShoppingBag className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Backdrop Blur Overlay */}
          <div
            className={`fixed inset-0 bg-black/5 backdrop-blur-sm transition-all duration-300 ${
              activeDropdown ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            style={{ top: "110px" }}
            onClick={() => setActiveDropdown(null)} // Click backdrop to close
          />

          {/* Dropdown Menus */}
          <div
            className={`absolute left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 px-8 py-6 transform transition-all duration-400 ease-out shadow-2xl ${
              activeDropdown
                ? "opacity-100 visible translate-y-0 scale-100 rotate-0"
                : "opacity-0 invisible -translate-y-8 scale-100 -rotate-1"
            }`}
          >
            {/* Shop Dropdown */}
            {activeDropdown === "shop" && (
              <div className="flex">
                <div className="mr-16">
                  <Link
                    href="/shop"
                    className="inline-block bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full px-6 py-3 text-sm font-medium mb-6 hover:from-orange-500 hover:to-orange-600 hover:transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    Discover All
                  </Link>
                </div>
                <div className="mr-16">
                  <ul className="space-y-3">
                    {[
                      { href: "/shop/men", text: "Men" },
                      { href: "/shop/women", text: "Women" },
                      { href: "/shop/all", text: "All" },
                    ].map((item, index) => (
                      <li
                        key={item.href}
                        className={`transform transition-all duration-500 ${activeDropdown === "shop" ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <Link
                          href={item.href}
                          className="text-sm hover:text-orange-500 hover:transform hover:translate-x-2 hover:scale-105 transition-all duration-300 relative group block py-2 px-2 rounded"
                        >
                          <span className="relative z-10">{item.text}</span>
                          <span className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mr-16">
                  <ul className="space-y-3">
                    {[
                      { href: "/shop/new-arrivals", text: "New Arrivals" },
                      { href: "/shop/runners-favorite", text: "Runners Favorite" },
                      { href: "/shop/running-tops", text: "Running Tops" },
                      { href: "/shop/running-bottoms", text: "Running Bottoms" },
                      { href: "/shop/post-run", text: "Post Run" },
                      { href: "/shop/accessories", text: "Accessories" },
                    ].map((item, index) => (
                      <li
                        key={item.href}
                        className={`transform transition-all duration-500 ${activeDropdown === "shop" ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
                        style={{ transitionDelay: `${(index + 3) * 100}ms` }}
                      >
                        <Link
                          href={item.href}
                          className="text-sm hover:text-orange-500 hover:transform hover:translate-x-2 hover:scale-105 transition-all duration-300 relative group block py-2 px-2 rounded"
                        >
                          <span className="relative z-10">{item.text}</span>
                          <span className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <ul className="space-y-3">
                    {[
                      { href: "/shop/moment-of-stillness", text: "Moment of Stillness" },
                      { href: "/shop/prototype-collection", text: "Prototype Collection" },
                      { href: "/shop/running-series", text: "Running Series" },
                      { href: "/shop/end-of-summer", text: "End of Summer" },
                      { href: "/shop/celebration-of-running", text: "Celebration of Running" },
                      { href: "/shop/past-seasons", text: "More Past Seasons Collections" },
                    ].map((item, index) => (
                      <li
                        key={item.href}
                        className={`transform transition-all duration-500 ${activeDropdown === "shop" ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
                        style={{ transitionDelay: `${(index + 9) * 100}ms` }}
                      >
                        <Link
                          href={item.href}
                          className="text-sm hover:text-orange-500 hover:transform hover:translate-x-2 hover:scale-105 transition-all duration-300 relative group block py-2 px-2 rounded"
                        >
                          <span className="relative z-10">{item.text}</span>
                          <span className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
                        </Link>
                      </li>
                    ))}
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
                    className="inline-block bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full px-6 py-3 text-sm font-medium mb-6 hover:from-orange-500 hover:to-orange-600 hover:transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    Read All
                  </Link>
                </div>
                <div>
                  <ul className="space-y-3">
                    {[
                      { href: "/peripherals/discovery", text: "Discovery" },
                      { href: "/peripherals/clarity", text: "Clarity" },
                      { href: "/peripherals/community", text: "Community" },
                      { href: "/peripherals/all", text: "All" },
                    ].map((item, index) => (
                      <li
                        key={item.href}
                        className={`transform transition-all duration-500 ${activeDropdown === "peripherals" ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <Link
                          href={item.href}
                          className="text-sm hover:text-orange-500 hover:transform hover:translate-x-2 hover:scale-105 transition-all duration-300 relative group block py-2 px-2 rounded"
                        >
                          <span className="relative z-10">{item.text}</span>
                          <span className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
                        </Link>
                      </li>
                    ))}
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
                    className="inline-block bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full px-6 py-3 text-sm font-medium mb-6 hover:from-orange-500 hover:to-orange-600 hover:transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    Join Now
                  </Link>
                </div>
                <ul className="space-y-3">
                  {[
                    { href: "/community?view=upcoming", text: "Upcoming Events" },
                    { href: "/community?view=past", text: "Past Events" },
                    { href: "/community?view=calendar", text: "Calendar" },
                    { href: "/community/membership", text: "Membership" },
                  ].map((item, index) => (
                    <li
                      key={item.href}
                      className={`transform transition-all duration-500 ${activeDropdown === "community" ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <Link
                        href={item.href}
                        className="text-sm hover:text-orange-500 hover:transform hover:translate-x-2 hover:scale-105 transition-all duration-300 relative group block py-2 px-2 rounded"
                      >
                        <span className="relative z-10">{item.text}</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <MobileHeader onMenuClick={toggleMobileMenu} onCartClick={handleCartClick} cartItemCount={totalCartItems} />

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu
          onClose={() => setMobileMenuOpen(false)}
          onCartClick={handleCartClick}
          cartItemCount={totalCartItems}
        />
      )}

      {/* Cart Dropdown */}
      <CartDropdown
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </>
  )
}

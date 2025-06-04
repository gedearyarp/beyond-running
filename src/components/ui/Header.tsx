"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, User, ShoppingBag, X } from "lucide-react"
import CartDropdown, { type CartItem } from "./cart-dropdown"
import MobileHeader from "@/components/mobile-header"
import MobileMenu from "@/components/mobile-menu"

// Mock product data for search results
const mockProducts = [
  {
    id: "1",
    name: "BEYOND QUARTER-ZIP TOP",
    category: "MENS",
    price: "Rp600.000",
    image: "/images/per_1.png",
  },
  {
    id: "2",
    name: "BEATER LONGSLEEVE",
    category: "MENS",
    price: "Rp480.000",
    image: "/images/per_1.png",
  },
  {
    id: "3",
    name: "RUNNING SHORTS",
    category: "MENS",
    price: "Rp350.000",
    image: "/images/per_1.png",
  },
  {
    id: "4",
    name: "PERFORMANCE TEE",
    category: "WOMENS",
    price: "Rp420.000",
    image: "/images/per_1.png",
  },
  {
    id: "5",
    name: "TRAINING VEST",
    category: "MENS",
    price: "Rp380.000",
    image: "/images/per_1.png",
  },
  {
    id: "6",
    name: "RUNNING JACKET",
    category: "WOMENS",
    price: "Rp750.000",
    image: "/images/per_1.png",
  },
]

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchOverlayRef = useRef<HTMLDivElement>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "BEATER LONGSLEEVE",
      size: "2",
      color: "Olive",
      price: "Rp480.000",
      priceNumber: 480000,
      quantity: 1,
      image: "/placeholder.svg?height=200&width=160",
    },
  ])

  // Filter products based on search query
  const filteredProducts = searchQuery
    ? mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : mockProducts

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Close dropdown on scroll, but NOT search overlay
      if (activeDropdown) {
        setActiveDropdown(null)
      }
      if (isCartOpen) {
        setIsCartOpen(false)
      }
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
      // Removed isSearchOpen from here to prevent closing on scroll
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [activeDropdown, isCartOpen, mobileMenuOpen])

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 300) // Delay to allow animation to start
    }
  }, [isSearchOpen])

  // Handle escape key to close search
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isSearchOpen) {
          setIsSearchOpen(false)
          setSearchQuery("")
        }
        setActiveDropdown(null)
        setIsCartOpen(false)
        setMobileMenuOpen(false)
      }
    }

    if (activeDropdown || isCartOpen || mobileMenuOpen || isSearchOpen) {
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [activeDropdown, isCartOpen, mobileMenuOpen, isSearchOpen])

  // Prevent body scroll when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isSearchOpen])

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
      if (!isSearchOpen) {
        clearExistingTimeout()
        setActiveDropdown(dropdown)
        setIsCartOpen(false)
      }
    },
    [clearExistingTimeout, isSearchOpen],
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
    if (!isSearchOpen) {
      setIsCartOpen(!isCartOpen)
      setActiveDropdown(null)
      setMobileMenuOpen(false)
    }
  }

  const handleSearchClick = () => {
    setIsSearchOpen(true)
    setActiveDropdown(null)
    setIsCartOpen(false)
    setMobileMenuOpen(false)
  }

  const handleSearchClose = () => {
    setIsSearchOpen(false)
    setSearchQuery("")
  }

  const toggleMobileMenu = () => {
    if (!isSearchOpen) {
      setMobileMenuOpen(!mobileMenuOpen)
      setIsCartOpen(false)
      setActiveDropdown(null)
    }
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
      {/* Search Overlay */}
      <div
        ref={searchOverlayRef}
        className={`fixed inset-0 bg-white z-[60] transition-all duration-500 ease-in-out overflow-auto ${
          isSearchOpen
            ? "opacity-100 visible transform translate-y-0"
            : "opacity-0 invisible transform -translate-y-full"
        }`}
      >
        {/* Search Header */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-lg md:text-xl font-medium bg-transparent border-none outline-none focus:ring-0 placeholder-gray-500"
                />
              </div>

              {/* Search and Close Icons */}
              <div className="flex items-center space-x-6 ml-6">
                <Search className="h-5 w-5 text-black" />
                <button
                  onClick={handleSearchClose}
                  className="p-1 transition-colors duration-200"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5 text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="px-4 md:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {searchQuery && (
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for "{searchQuery}"
                </p>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className={`group block animate-fade-in hover:transform hover:scale-105 transition-all duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={handleSearchClose}
                >
                  <div className="aspect-[3/4] bg-gray-100 mb-3 overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm md:text-base text-black group-hover:text-orange-500 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600">{product.category}</p>
                    <p className="text-sm md:text-base font-medium text-black">{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* No Results */}
            {searchQuery && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or{" "}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-orange-500 hover:text-orange-600 underline"
                  >
                    browse all products
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

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
                onClick={handleSearchClick}
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
                className={`text-sm cursor-pointer font-medium transition-all duration-300 relative ${
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
            onClick={() => setActiveDropdown(null)}
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

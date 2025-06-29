"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, User, ShoppingBag, X, Menu } from "lucide-react"
import CartDropdown from "./cart-dropdown"
import MobileHeader from "@/components/mobile-header"
import MobileMenu from "@/components/mobile-menu"
import { Collection, getAllProductsForShopPage } from "@/lib/shopify"
import { useCollectionsStore } from "@/store/collections"
import { useCartStore } from "@/store/cart"
import type { ProductCardType } from "@/lib/shopify/types"

interface HeaderProps {
  collections: Collection[];
}

// Ubah recent search: simpan array of produk (id, title, handle, image)
type RecentProduct = {
  id: string;
  title: string;
  handle: string;
  image?: string;
};

export default function Header({ collections: initialCollections }: HeaderProps) {
  const { collections, refreshCollections } = useCollectionsStore();
  const { toggleCart, getTotalItems, isOpen: isCartOpen, closeCart } = useCartStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchOverlayRef = useRef<HTMLDivElement>(null)
  const RECENT_SEARCH_KEY = "recent_searches";
  const [recentSearches, setRecentSearches] = useState<RecentProduct[]>([]);
  const [allProducts, setAllProducts] = useState<ProductCardType[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false)

  // Memoize functions that are used in useEffect dependencies
  const handleScroll = useCallback(() => {
    if (window.scrollY > 0) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }

    if (activeDropdown) {
      setActiveDropdown(null)
    }
    if (mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }, [activeDropdown, mobileMenuOpen])

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
      setActiveDropdown(null)
    }
  }, [])

  // Scroll effect
  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  // Click outside effect
  useEffect(() => {
    if (activeDropdown || isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeDropdown, isCartOpen, handleClickOutside])

  // Refresh collections when dropdown is opened
  useEffect(() => {
    if (activeDropdown === 'shop') {
      refreshCollections();
    }
  }, [activeDropdown, refreshCollections]);

  // Fetch real products saat search overlay dibuka
  useEffect(() => {
    if (isSearchOpen && allProducts.length === 0) {
      setProductsLoading(true);
      getAllProductsForShopPage(100)
        .then((data) => {
          setAllProducts(data);
          setProductsLoading(false);
        })
        .catch((err) => {
          setProductsError("Failed to load products");
          setProductsLoading(false);
        });
    }
  }, [isSearchOpen, allProducts.length]);

  // Filter products based on search query
  const filteredProducts = searchQuery
    ? allProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.productType?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      )
    : allProducts;

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
        if (isCartOpen) {
          toggleCart()
        }
        setMobileMenuOpen(false)
      }
    }

    if (activeDropdown || isCartOpen || mobileMenuOpen || isSearchOpen) {
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [activeDropdown, isCartOpen, mobileMenuOpen, isSearchOpen, toggleCart])

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
        if (isCartOpen) {
          toggleCart()
        }
      }
    },
    [clearExistingTimeout, isSearchOpen, isCartOpen, toggleCart]
  )

  const handleCartClick = () => {
    if (!isSearchOpen) {
      toggleCart()
      setActiveDropdown(null)
      setMobileMenuOpen(false)
    }
  }

  const handleSearchClick = () => {
    setIsSearchOpen(true)
    setActiveDropdown(null)
    if (isCartOpen) {
      toggleCart()
    }
    setMobileMenuOpen(false)
  }

  const handleSearchClose = () => {
    setIsSearchOpen(false)
    setSearchQuery("")
  }

  const toggleMobileMenu = () => {
    if (!isSearchOpen) {
      setMobileMenuOpen(!mobileMenuOpen)
      if (isCartOpen) {
        toggleCart()
      }
      setActiveDropdown(null)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearExistingTimeout()
    }
  }, [clearExistingTimeout])

  const totalCartItems = getTotalItems()

  // Load recent search dari localStorage saat search overlay dibuka
  useEffect(() => {
    if (isSearchOpen) {
      const stored = localStorage.getItem(RECENT_SEARCH_KEY);
      setRecentSearches(stored ? JSON.parse(stored) : []);
    }
  }, [isSearchOpen]);

  // Fungsi untuk menambah recent search (produk)
  const addRecentSearch = (product: RecentProduct) => {
    if (!product) return;
    let updated = [product, ...recentSearches.filter((p) => p.id !== product.id)];
    if (updated.length > 5) updated = updated.slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
  };

  // Pada saat klik hasil search, tambahkan ke recent search
  const handleSearchResultClick = (product: ProductCardType) => {
    addRecentSearch({
      id: product.id,
      title: product.title,
      handle: product.handle,
      image: product.images?.edges?.[0]?.node?.url || undefined,
    });
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  // Fungsi untuk mengambil 4 produk random
  function getRandomProducts(products: ProductCardType[], count: number) {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Fungsi untuk clear all recent search
  const clearAllRecentSearch = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCH_KEY);
  }

  useEffect(() => {
    setMounted(true)
  }, [])

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
                  className="w-full text-lg md:text-xl font-folio-light bg-transparent border-none outline-none focus:ring-0 placeholder-gray-500"
                />
              </div>

              {/* Search and Close Icons */}
              <div className="flex items-center space-x-6 ml-6">
                <Search className="h-5 w-5 text-black" />
                <button
                  onClick={handleSearchClose}
                  className="p-1 transition-colors duration-200 cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5 text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results & Recent Search */}
        <div className="max-w-7xl mx-auto mt-8">
          {/* Recent Search Section */}
          {recentSearches.length > 0 && (
            <div className="mb-8 px-4 md:px-8">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500 font-folio-medium">Recent Search</div>
                <button
                  onClick={clearAllRecentSearch}
                  className="text-sm text-gray-500 hover:underline font-folio-medium cursor-pointer"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-4">
                {recentSearches.map((item) => (
                  <Link
                    key={item.id}
                    href={`/shop/all/${item.handle}`}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-100 transition-colors font-avant-garde border border-gray-200"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="text-xs font-folio-medium  max-w-[100px]">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {/* Search Results Section */}
          {productsLoading ? (
            <div className="text-center py-16 text-gray-500">Loading products...</div>
          ) : productsError ? (
            <div className="text-center py-16 text-red-500">{productsError}</div>
          ) : searchQuery ? (
            filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-8 px-4 md:px-8">
                {filteredProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    href={`/shop/all/${product.handle}`}
                    className={`group block animate-fade-in hover:transform hover:scale-105 transition-all duration-300`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleSearchResultClick(product)}
                  >
                    <div className="aspect-[3/4] mb-3 overflow-hidden">
                      <Image
                        src={product.images?.edges?.[0]?.node?.url || "/placeholder.svg"}
                        alt={product.images?.edges?.[0]?.node?.altText || product.title}
                        width={300}
                        height={400}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm md:text-base text-black group-hover:text-gray-500 transition-colors duration-300">
                        {product.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600">{product.productType}</p>
                      <p className="text-sm md:text-base font-medium text-black">
                        {product.priceRange.minVariantPrice.currencyCode} {product.priceRange.minVariantPrice.amount}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Search Not Found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse all products.</p>
              </div>
            )
          ) : (
            allProducts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-8 px-4 md:px-8">
                {getRandomProducts(allProducts, 4).map((product, index) => (
                  <Link
                    key={product.id}
                    href={`/shop/all/${product.handle}`}
                    className={`group block animate-fade-in hover:transform hover:scale-105 transition-all duration-300`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleSearchResultClick(product)}
                  >
                    <div className="aspect-[3/4] mb-3 overflow-hidden">
                      <Image
                        src={product.images?.edges?.[0]?.node?.url || "/placeholder.svg"}
                        alt={product.images?.edges?.[0]?.node?.altText || product.title}
                        width={300}
                        height={400}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm md:text-base text-black group-hover:text-gray-500 transition-colors duration-300">
                        {product.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600">{product.productType}</p>
                      <p className="text-sm md:text-base font-medium text-black">
                        {product.priceRange.minVariantPrice.currencyCode} {product.priceRange.minVariantPrice.amount}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <header
        ref={headerRef}
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-all hidden md:block duration-500 ease-in-out transform ${
          isScrolled ? "shadow-md" : ""
        } animate-slide-down`}
      >
        {/* Announcement Bar */}
        <div className="w-full bg-black text-white text-center py-2 text-xs animate-slide-down">
          Free Shipping On All Orders Above Rp 599,999
        </div>

        {/* Main Navigation Container */}
        <div className="relative bg-white" onMouseEnter={clearExistingTimeout}>
          {/* Navigation Bar */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
            {/* Left Navigation */}
            <nav className="flex space-x-6 font-folio-bold">
              <div onMouseEnter={() => handleMouseEnter("shop")} className="relative py-2">
                <Link
                  href="/shop"
                  className={`text-[14px] font-medium transition-all duration-300 ${
                    activeDropdown === "shop"
                      ? "text-gray-500 transform scale-105"
                      : "hover:text-gray-500 hover:transform hover:scale-105"
                  }`}
                >
                  Shop
                </Link>
              </div>

              <div onMouseEnter={() => handleMouseEnter("peripherals")} className="relative py-2">
                <Link
                  href="/peripherals"
                  className={`text-[14px] font-medium transition-all duration-300 ${
                    activeDropdown === "peripherals"
                      ? "text-gray-500 transform scale-105"
                      : "hover:text-gray-500 hover:transform hover:scale-105"
                  }`}
                >
                  Peripherals
                </Link>
              </div>

              <div onMouseEnter={() => handleMouseEnter("community")} className="relative py-2">
                <Link
                  href="/community"
                  className={`text-[14px] font-medium transition-all duration-300 ${
                    activeDropdown === "community"
                      ? "text-gray-500 transform scale-105"
                      : "hover:text-gray-500 hover:transform hover:scale-105"
                  }`}
                >
                  Community
                </Link>
              </div>
              <div className="relative py-2">
                <Link
                  href="/about"
                  className="text-[14px] font-medium hover:text-gray-500 hover:transform hover:scale-105 transition-all duration-300"
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
            <div className="absolute left-1/2 transform -translate-x-1/2 text-[30px] font-itc-bold">
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
                className="hover:text-gray-500 hover:transform hover:scale-110 hover:rotate-12 transition-all duration-300 p-2 cursor-pointer"
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
                className="hover:text-gray-500 hover:transform hover:scale-110 hover:-rotate-12 transition-all duration-300 p-2"
                onMouseEnter={() => {
                  clearExistingTimeout()
                  setActiveDropdown(null)
                }}
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={handleCartClick}
                className="text-sm cursor-pointer hover:text-gray-600 transition-colors relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {mounted && totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                    className="inline-block bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full px-6 py-3 text-sm font-folio-bold mb-6 hover:from-gray-500 hover:to-gray-600 hover:transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    Discover All
                  </Link>
                </div>
                <div className="mr-16 font-folio-bold">
                  <ul className="space-y-3">
                    {[
                      { href: "/shop/men", text: "Men" },
                      { href: "/shop/women", text: "Women" },
                    ].map((item, index) => (
                      <li
                        key={item.href}
                        className={`transform transition-all duration-500 ${activeDropdown === "shop" ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <Link
                          href={item.href}
                          className="text-sm hover:text-gray-500 hover:transform hover:translate-x-2 hover:scale-105 transition-all duration-300 relative group block py-2 px-2 rounded"
                        >
                          <span className="relative z-10">{item.text}</span>
                          <span className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="font-folio-bold">
                  <ul className="space-y-3">
                    {collections.map((collection, index) => (
                      <li
                        key={collection.id}
                        className={`transform transition-all duration-500 ${activeDropdown === "shop" ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
                        style={{ transitionDelay: `${(index + 3) * 100}ms` }}
                      >
                        <Link
                          href={`/shop/${collection.handle}`}
                          className="text-sm hover:text-gray-500 hover:transform hover:translate-x-2 hover:scale-105 transition-all duration-300 relative group block py-2 px-2 rounded"
                        >
                          <span className="relative z-10">{collection.title}</span>
                          <span className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
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
                    className="inline-block bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full px-6 py-3 text-sm font-folio-bold mb-6 hover:from-gray-500 hover:to-gray-600 hover:transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    Read All
                  </Link>
                </div>
                <div className="font-folio-bold">
                  <ul className="space-y-3">
                    {[
                      { filter: "discovery", text: "Discovery" },
                      { filter: "clarity", text: "Clarity" },
                      { filter: "community", text: "Community" },
                      { filter: "all", text: "All" },
                    ].map((item, index) => (
                      <li
                        key={item.filter}
                        className={`transform transition-all duration-500 ${activeDropdown === "peripherals" ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <Link
                          href={{ pathname: "/peripherals", query: { filter: item.filter } }}
                          className="text-sm hover:text-gray-500 hover:transform hover:translate-x-2 hover:scale-105 transition-all duration-300 relative group block py-2 px-2 rounded"
                        >
                          <span className="relative z-10">{item.text}</span>
                          <span className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
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
                    href="/community"
                    className="inline-block bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full px-6 py-3 text-sm font-folio-bold mb-6 hover:from-gray-500 hover:to-gray-600 hover:transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    Join Now
                  </Link>
                </div>
                <ul className="space-y-3 font-folio-bold">
                  <li
                    className={`transform transition-all duration-500 ${activeDropdown === "community" ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
                    style={{ transitionDelay: `0ms` }}
                  >
                    <Link
                      href={{ pathname: "/community", query: { view: "upcoming" } }}
                      className="text-sm hover:text-gray-500 hover:transform hover:translate-x-2 hover:scale-105 transition-all duration-300 relative group block py-2 px-2 rounded"
                    >
                      <span className="relative z-10">Upcoming Events</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
                    </Link>
                  </li>
                  <li
                    className={`transform transition-all duration-500 ${activeDropdown === "community" ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
                    style={{ transitionDelay: `100ms` }}
                  >
                    <Link
                      href={{ pathname: "/community", query: { view: "past" } }}
                      className="text-sm hover:text-gray-500 hover:transform hover:translate-x-2 hover:scale-105 transition-all duration-300 relative group block py-2 px-2 rounded"
                    >
                      <span className="relative z-10">Past Events</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
                    </Link>
                  </li>
                  <li
                    className={`transform transition-all duration-500 ${activeDropdown === "community" ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
                    style={{ transitionDelay: `200ms` }}
                  >
                    <Link
                      href={{ pathname: "/community", query: { view: "calendar" } }}
                      className="text-sm hover:text-gray-500 hover:transform hover:translate-x-2 hover:scale-105 transition-all duration-300 relative group block py-2 px-2 rounded"
                    >
                      <span className="relative z-10">Calendar</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
                    </Link>
                  </li>
                  <li
                    className={`transform transition-all duration-500 ${activeDropdown === "community" ? "translate-x-0 opacity-60 cursor-not-allowed" : "translate-x-4 opacity-0"}`}
                    style={{ transitionDelay: `300ms` }}
                  >
                    <span
                      className="text-sm text-gray-400 block py-2 px-2 rounded cursor-not-allowed select-none bg-gray-100"
                      title="Coming Soon"
                    >
                      <span className="relative z-10">Membership (Coming Soon)</span>
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <MobileHeader
        onMenuClick={toggleMobileMenu}
        onCartClick={handleCartClick}
        isMenuOpen={mobileMenuOpen}
        onSearchClick={handleSearchClick}
      />

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu
          onClose={() => setMobileMenuOpen(false)}
          onCartClick={handleCartClick}
          cartItemCount={totalCartItems}
        />
      )}

      {/* Cart Dropdown */}
      <CartDropdown />
    </>
  )
}

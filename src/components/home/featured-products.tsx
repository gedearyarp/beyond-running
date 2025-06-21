"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "@/components/ui/ProductCard"
import { getAllCollections, getProductsByCollection, type Collection } from "@/lib/shopify"
import type { ProductCardType } from "@/lib/shopify/types"

export default function FeaturedProducts() {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [collections, setCollections] = useState<Collection[]>([])
  const [products, setProducts] = useState<ProductCardType[]>([])
  const [loading, setLoading] = useState(true)
  const [currentProductIndex, setCurrentProductIndex] = useState(0)

  // Fetch collections and initial products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const allCollections = await getAllCollections()
        // We are interested in the first 3 collections for the tabs
        const featuredCollections = allCollections.slice(0, 3)
        setCollections(featuredCollections)

        // Fetch products for the default tab (the first collection)
        if (featuredCollections.length > 0) {
          const collectionProducts = await getProductsByCollection(featuredCollections[0].handle)
          setProducts(collectionProducts)
        }
      } catch (error) {
        console.error("Error fetching featured products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle tab change to load products from the corresponding collection
  const handleTabClick = async (index: number) => {
    if (activeTabIndex === index || !collections[index] || loading) return

    setActiveTabIndex(index)
    setCurrentProductIndex(0) // Reset scroll on tab change
    try {
      setLoading(true)
      const collectionHandle = collections[index].handle
      const collectionProducts = await getProductsByCollection(collectionHandle)
      setProducts(collectionProducts)
    } catch (error) {
      console.error(`Error fetching products for ${collections[index].title}:`, error)
    } finally {
      setLoading(false)
    }
  }

  // Determine products per view based on screen size
  const getProductsPerView = () => {
    // This will be handled by CSS Grid, but we use this for navigation logic
    return 4 // Default for desktop, CSS will handle responsive behavior
  }

  const productsPerView = getProductsPerView()

  // Navigation functions for products
  const nextProducts = () => {
    if (products.length > productsPerView) {
      setCurrentProductIndex((prev) => Math.min(prev + productsPerView, products.length - productsPerView))
    }
  }

  const prevProducts = () => {
    setCurrentProductIndex((prev) => Math.max(prev - productsPerView, 0))
  }

  // Get current products to display
  const getCurrentProducts = () => {
    if (products.length <= productsPerView) {
      return products
    }
    return products.slice(currentProductIndex, currentProductIndex + productsPerView)
  }

  const currentProducts = getCurrentProducts()
  const showNavigation = products.length > productsPerView
  const canGoNext = showNavigation && currentProductIndex + productsPerView < products.length
  const canGoPrev = showNavigation && currentProductIndex > 0

  // Determine the currently active collection
  const activeCollection = collections[activeTabIndex]

  if (loading && products.length === 0) {
    return (
      <div className="my-12">
        <div className="mb-6">
          <h2 className="text-xl md:text-[42px] font-itc-demi mb-4 md:mb-10">FEATURED ARTICLES</h2>
          <div className="flex pb-2 gap-3 md:gap-6">
            <div className="text-xs md:text-sm font-medium md:mr-6 font-folio-medium text-gray-500">Loading...</div>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading products...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="my-8 md:my-12">
      <div className="mb-4 md:mb-6 px-4 md:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-[42px] font-itc-demi mb-3 md:mb-4 lg:mb-10">FEATURED ARTICLES</h2>

        <div className="flex flex-col sm:flex-row sm:items-center pb-2 gap-2 sm:gap-3 md:gap-6">
          <div className="flex gap-3 md:gap-6 overflow-x-auto pb-2 sm:pb-0">
            {collections.map((collection, index) => (
              <button
                key={collection.id}
                className={`text-xs sm:text-sm md:text-base font-medium whitespace-nowrap font-folio-medium transition-colors px-1 py-1 ${
                  activeTabIndex === index ? "font-bold text-black" : "text-gray-500 hover:text-black"
                }`}
                onClick={() => handleTabClick(index)}
                disabled={loading}
              >
                {collection.title}
              </button>
            ))}
          </div>
          <div className="sm:ml-auto">
            <Link href="/shop" className="text-xs sm:text-sm md:text-base font-itc-md underline">
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Product Navigation Arrows - Hidden on mobile, visible on tablet+ */}
        {showNavigation && (
          <>
            <button
              onClick={prevProducts}
              disabled={!canGoPrev}
              className="hidden md:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 p-2 lg:p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
            <button
              onClick={nextProducts}
              disabled={!canGoNext}
              className="hidden md:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 p-2 lg:p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
          </>
        )}

        {/* Products Grid Container */}
        <div className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20">
          <div
            className={`
            grid gap-3 sm:gap-4 lg:gap-6 transition-opacity duration-300 justify-center
            ${loading ? "opacity-50" : "opacity-100"}
            ${currentProducts.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : ""}
            ${currentProducts.length === 2 ? "grid-cols-1 xs:grid-cols-2 max-w-2xl mx-auto" : ""}
            ${currentProducts.length === 3 ? "grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto" : ""}
            ${currentProducts.length >= 4 ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : ""}
          `}
          >
            {currentProducts.map((product) => (
              <div key={product.id} className="flex justify-center">
                <div className="w-full max-w-[280px] sm:max-w-none">
                  <ProductCard product={product} collectionHandle={activeCollection?.handle} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation - Swipe indicators and touch-friendly dots */}
        {showNavigation && (
          <div className="mt-4 md:mt-6">
            {/* Mobile swipe hint */}
            <div className="md:hidden text-center text-xs text-gray-400 mb-3">Swipe to see more products</div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: Math.ceil(products.length / productsPerView) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProductIndex(index * productsPerView)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors touch-manipulation ${
                    Math.floor(currentProductIndex / productsPerView) === index
                      ? "bg-black"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mobile Touch Navigation Buttons */}
        {showNavigation && (
          <div className="flex md:hidden justify-center gap-4 mt-4 px-4">
            <button
              onClick={prevProducts}
              disabled={!canGoPrev}
              className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Prev</span>
            </button>
            <button
              onClick={nextProducts}
              disabled={!canGoNext}
              className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              <span className="text-sm font-medium">Next</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}

        {/* Collection Link */}
        {activeCollection && !loading && (
          <div className="text-center mt-6 md:mt-8 px-4">
            <Link
              href={`/shop/${activeCollection.handle}`}
              className="inline-flex items-center gap-2 text-sm md:text-base font-folio-medium text-gray-600 hover:text-black transition-colors touch-manipulation"
            >
              View all in {activeCollection.title}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

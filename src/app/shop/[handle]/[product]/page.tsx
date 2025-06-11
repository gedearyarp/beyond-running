"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ChevronDown, ArrowLeft } from "lucide-react"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import ProductCard from "@/components/ui/ProductCard"
import useMobile from "@/hooks/use-mobile"
import MobileHeader from "@/components/mobile-header"
import MobileMenu from "@/components/mobile-menu"
import SizeChartModal from "@/components/ui/size-chart"
import CartDropdown from "@/components/ui/cart-dropdown"
import AddToCartButton from "@/components/ui/add-to-cart-button"
import type { ProductDetailType, ProductCardType } from "@/lib/shopify/types"

// Constants
const GALLERY_AUTO_SCROLL_INTERVAL = 5000
const RELATED_PRODUCTS_COUNT = 4

// Types
interface ProductDetailPageProps {
  product: ProductDetailType
  relatedProducts: ProductCardType[]
}

// Utility functions
const extractPureDescription = (htmlString: string): string => {
  if (!htmlString) return ""
  const firstParagraphMatch = htmlString.match(/<p>.*?<\/p>/s)
  return firstParagraphMatch ? firstParagraphMatch[0] : htmlString
}

const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    black: "#000000",
    white: "#F0EBE3",
    olive: "#7aa799",
    navy: "#0a192f",
    gray: "#808080",
    mint: "#98fb98",
    red: "#CD5656",
    blue: "#9EC6F3",
  }
  return colorMap[colorName.toLowerCase()] || "#cccccc"
}

// Main component
export default function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
  // Data extraction
  const mainImageUrl = product?.images?.edges?.[0]?.node?.url || "/placeholder.svg"
  const mainImageAlt = product?.images?.edges?.[0]?.node?.altText || product?.title || "Product image"
  const galleryImages = product?.images?.edges?.map((edge) => edge.node.url) || []
  const formattedPrice = product?.priceRange?.minVariantPrice
    ? `${product.priceRange.minVariantPrice.currencyCode} ${product.priceRange.minVariantPrice.amount}`
    : "Price not available"

  // Extract available options
  const availableColors = product?.variants?.edges
    ? Array.from(
        new Set(
          product.variants.edges.flatMap(
            (v) =>
              v.node.selectedOptions?.filter((opt) => opt.name.toLowerCase() === "color").map((opt) => opt.value) || [],
          ),
        ),
      )
    : []

  const availableSizes = product?.variants?.edges
    ? Array.from(
        new Set(
          product.variants.edges.flatMap(
            (v) =>
              v.node.selectedOptions?.filter((opt) => opt.name.toLowerCase() === "size").map((opt) => opt.value) || [],
          ),
        ),
      )
    : []

  // State management
  const [selectedSize, setSelectedSize] = useState<string | null>(availableSizes[0] || null)
  const [selectedColor, setSelectedColor] = useState<string | null>(availableColors[0] || null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    technical: true,
    composition: false,
  })
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeGalleryImage, setActiveGalleryImage] = useState(0)

  // Refs
  const technicalRef = useRef<HTMLDivElement>(null)
  const compositionRef = useRef<HTMLDivElement>(null)

  // Hooks
  const isMobile = useMobile()

  // Callbacks
  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  const handleCartClick = useCallback(() => {
    setAddingToCart(true)
    setTimeout(() => {
      setAddingToCart(false)
      setIsCartOpen(true)
    }, 800)
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev)
  }, [])

  // Effects
  useEffect(() => {
    const interval = setInterval(() => {
      if (galleryImages.length > 1) {
        setActiveGalleryImage((prev) => (prev + 1) % galleryImages.length)
      }
    }, GALLERY_AUTO_SCROLL_INTERVAL)

    return () => clearInterval(interval)
  }, [galleryImages.length])

  // Size chart data
  const sizeChartData = [
    { size: "X-Small", chest: "43", front: "59", back: "61" },
    { size: "Small", chest: "46", front: "61", back: "63" },
    { size: "Medium", chest: "48", front: "63", back: "65" },
    { size: "Large", chest: "50", front: "65", back: "67" },
    { size: "X-Large", chest: "53", front: "68", back: "70" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {isMobile ? (
        <>
          <MobileHeader onMenuClick={toggleMobileMenu} onCartClick={() => setIsCartOpen(true)} />
          {mobileMenuOpen && (
            <MobileMenu onClose={() => setMobileMenuOpen(false)} onCartClick={() => setIsCartOpen(true)} />
          )}
        </>
      ) : (
        <Header />
      )}
      <main className="flex-1">
        <div className="container mx-auto md:px-4 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <div className="bg-gray-100 mt-16 aspect-square relative overflow-hidden">
                <Image
                  src={mainImageUrl}
                  alt={mainImageAlt}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full flex md:justify-end">
              <div className="md:w-2/3 md:px-0 px-4">
                <div className="flex mb-6">
                  <Link
                    href="/shop"
                    className="flex items-center underline text-xs font-avant-garde group transition-all duration-300"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1 transition-transform duration-300 group-hover:-translate-x-1" />
                    <span className="group-hover:text-orange-500">BACK TO COLLECTIONS</span>
                  </Link>
                </div>
                <h1 className="text-3xl font-bold font-avant-garde mb-1 animate-fade-in">
                  {product?.title || "Product Name"}
                </h1>
                <h2 className="text-2xl font-bold font-avant-garde mb-6 animate-fade-in animation-delay-100">
                  {product?.productType || "MENS"}
                </h2>
                <p className="text-xl font-avant-garde mb-8 animate-fade-in animation-delay-200">{formattedPrice}</p>

                {product?.descriptionHtml ? (
                  <div
                    className="text-sm font-avant-garde mb-10 animate-fade-in animation-delay-300"
                    dangerouslySetInnerHTML={{ __html: extractPureDescription(product.descriptionHtml) }}
                  />
                ) : (
                  <p className="text-sm font-avant-garde mb-10 animate-fade-in animation-delay-300">
                    This product is your go-to for all your running needs. Made with high-quality materials for maximum
                    comfort and performance.
                  </p>
                )}

                {/* Technical Details Section */}
                <div className="border-t border-gray-200 py-4">
                  <button
                    className="flex items-center justify-between w-full text-left font-avant-garde font-medium group"
                    onClick={() => toggleSection("technical")}
                  >
                    <span className="group-hover:text-orange-500 transition-colors duration-300">
                      Technical Details
                    </span>
                    <div className="transition-transform duration-300 ease-in-out">
                      {expandedSections.technical ? (
                        <ChevronDown className="h-5 w-5 text-orange-500 transition-transform duration-300 transform rotate-0" />
                      ) : (
                        <ChevronRight className="h-5 w-5 group-hover:text-orange-500 transition-transform duration-300 transform group-hover:rotate-90" />
                      )}
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedSections.technical ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {expandedSections.technical && (
                      <div className="mt-4" ref={technicalRef}>
                        {product?.descriptionHtml && product.descriptionHtml.includes("Technical Details") ? (
                          <ul className="pl-5 text-sm font-avant-garde space-y-3">
                            {product.descriptionHtml
                              .split("<h4><span>Technical Details</span></h4>")[1]
                              ?.split("<h4>")[0]
                              ?.match(/<li[^>]*>.*?<\/li>/g)
                              ?.map((item, index) => {
                                const text = item.replace(/<[^>]*>/g, "").trim()
                                return (
                                  <li key={index} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>{text}</span>
                                  </li>
                                )
                              }) || []}
                          </ul>
                        ) : (
                          <ul className="pl-5 text-sm font-avant-garde space-y-3">
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Water-proof (Grade 3) fabric with 1000mm water repellent treatment</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Wind-proof and down-proof for maximum protection</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>RDS-certified white down (90% down, 10% feathers), 750 fill power</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Adjustable hood for a customized fit</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Invisible zip side chest pockets and YKK two-way front zip</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Elastic band cuffs and adjustable side hem</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Inner chest pocket with zip closure</span>
                            </li>
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Composition Section */}
                <div className="border-t border-gray-200 py-4">
                  <button
                    className="flex items-center justify-between w-full text-left font-avant-garde font-medium group"
                    onClick={() => toggleSection("composition")}
                  >
                    <span className="group-hover:text-orange-500 transition-colors duration-300">Composition</span>
                    <div className="transition-transform duration-300 ease-in-out">
                      {expandedSections.composition ? (
                        <ChevronDown className="h-5 w-5 text-orange-500 transition-transform duration-300 transform rotate-0" />
                      ) : (
                        <ChevronRight className="h-5 w-5 group-hover:text-orange-500 transition-transform duration-300 transform group-hover:rotate-90" />
                      )}
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedSections.composition ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {expandedSections.composition && (
                      <div className="mt-4" ref={compositionRef}>
                        {product?.descriptionHtml && product.descriptionHtml.includes("Composition") ? (
                          <div
                            className="pl-5 text-sm font-avant-garde space-y-3"
                            dangerouslySetInnerHTML={{
                              __html:
                                product.descriptionHtml
                                  .split("<h4><span>Composition</span></h4>")[1]
                                  ?.replace(/<ul[^>]*>/g, "")
                                  ?.replace(/<\/ul>/g, "")
                                  ?.replace(
                                    /<li[^>]*>/g,
                                    '<div class="flex items-start"><span class="mr-2">•</span><span>',
                                  )
                                  ?.replace(/<\/li>/g, "</span></div>")
                                  ?.replace(/<span><\/span>/g, "") || "",
                            }}
                          />
                        ) : (
                          <ul className="pl-5 text-sm font-avant-garde space-y-3">
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Main Fabric: 100% Polyester</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Lining: 100% Polyester</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Pocket Bag: 100% Polyester</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Filling: 90% Duck Down, 10% Duck Feathers</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Made in China</span>
                            </li>
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mt-10 border-b pb-12">
                  <h3 className="text-sm font-avant-garde mb-4">COLOR</h3>
                  <div className="flex space-x-3">
                    {availableColors.length > 0 ? (
                      availableColors.map((color) => (
                        <button
                          key={color}
                          className={`w-10 h-10 rounded-full transition-all duration-300 transform ${
                            selectedColor === color
                              ? "ring-2 ring-offset-4 ring-black scale-110"
                              : "border border-gray-300 hover:scale-110"
                          }`}
                          style={{ backgroundColor: getColorHex(color) }}
                          onClick={() => setSelectedColor(color)}
                          aria-label={color}
                        />
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No colors available</p>
                    )}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mt-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-avant-garde">SIZE</h3>
                    <button
                      onClick={() => setIsSizeChartOpen(true)}
                      className="text-xs underline font-avant-garde hover:text-orange-500 transition-colors relative group"
                    >
                      <span>SIZE GUIDE</span>
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                    </button>
                  </div>
                  <div className="flex space-x-8">
                    {availableSizes.length > 0 ? (
                      availableSizes.map((size) => (
                        <button
                          key={size}
                          className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                            selectedSize === size
                              ? "border border-black rounded-full font-bold transform scale-110"
                              : "border-gray-300 hover:border-black text-[#ADADAD] hover:text-black hover:scale-110"
                          } font-avant-garde`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No sizes available</p>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <AddToCartButton
                  product={product}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  onAddToCart={handleCartClick}
                />

                {/* Additional Links */}
                <div className="flex gap-8 mt-6 text-xs w-full items-center justify-center font-avant-garde">
                  <Link
                    href="/faq"
                    className="underline hover:text-orange-500 transition-colors duration-300 relative group"
                  >
                    <span>Delivery</span>
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    href="/faq"
                    className="underline hover:text-orange-500 transition-colors duration-300 relative group"
                  >
                    <span>Return & Exchange</span>
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    href="/faq"
                    className="underline hover:text-orange-500 transition-colors duration-300 relative group"
                  >
                    <span>Washing Guide</span>
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="mt-16 overflow-hidden">
            <div
              className="flex space-x-4 transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeGalleryImage * (500 + 16)}px)` }}
            >
              {galleryImages.map((image, index) => (
                <div
                  key={image}
                  className={`flex-shrink-0 w-[500px] h-[375px] relative transition-all duration-500 ${
                    activeGalleryImage === index ? "scale-100 opacity-100" : "scale-95 opacity-80"
                  }`}
                  onClick={() => setActiveGalleryImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product view ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="500px"
                  />
                </div>
              ))}
            </div>

            {/* Gallery Navigation Dots */}
            {galleryImages.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeGalleryImage === index ? "bg-orange-500 w-4" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    onClick={() => setActiveGalleryImage(index)}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Related Products */}
          <div className="mt-20">
            <h2 className="text-xl font-bold mb-8 font-avant-garde">YOU MAY ALSO LIKE</h2>
            {relatedProducts.length > 0 ? (
              isMobile ? (
                <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
                  {relatedProducts.map((product) => (
                    <div key={product.id} className="transform transition-transform duration-300 hover:scale-105">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {relatedProducts.map((product) => (
                    <div key={product.id} className="transform transition-transform duration-300 hover:scale-105">
                      <ProductCard product={product} />
                      <button
                        className="mt-2 text-xs underline font-avant-garde relative group overflow-hidden"
                        onClick={handleCartClick}
                      >
                        <span className="relative z-10 group-hover:text-orange-500 transition-colors duration-300">
                          ADD TO BAG
                        </span>
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <p className="text-center py-8">No related products found.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        sizeData={sizeChartData}
        productName={`${product?.title || "Product"} ${product?.productType || ""}`}
      />

      {/* Cart Dropdown */}
      <CartDropdown
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={[
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
        ]}
        onUpdateQuantity={(id, quantity) => {
          // TODO: Implement cart update logic
        }}
        onRemoveItem={(id) => {
          // TODO: Implement cart remove logic
        }}
      />
    </div>
  )
} 
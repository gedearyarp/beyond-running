"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
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
  const firstParagraphMatch = htmlString.match(/<p>[\s\S]*?<\/p>/)
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

// Helper functions to check if sections have content
const hasTechnicalDetails = (descriptionHtml: string): boolean => {
  if (!descriptionHtml) return false
  return descriptionHtml.includes("Technical Details") && 
         descriptionHtml.split("<h4><span>Technical Details</span></h4>")[1]?.split("<h4>")[0]?.match(/<li[^>]*>.*?<\/li>/g)?.length > 0
}

const hasComposition = (descriptionHtml: string): boolean => {
  if (!descriptionHtml) return false
  return descriptionHtml.includes("Composition") && 
         descriptionHtml.split("<h4><span>Composition</span></h4>")[1]?.split("<h4>")[0]?.match(/<li[^>]*>.*?<\/li>/g)?.length > 0
}

// Main component
export default function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
  // --- MEMOS ---
  const hasSizeOptions = useMemo(() => {
    return product.variants.edges.some((edge) => 
      edge.node.selectedOptions.some((opt) => opt.name.toLowerCase() === "size")
    )
  }, [product.variants])

  const variantAvailability = useMemo(() => {
    const availability = new Map<string, boolean>()
    product.variants.edges.forEach((edge) => {
      const colorOption = edge.node.selectedOptions.find((opt) => opt.name.toLowerCase() === "color")
      const sizeOption = edge.node.selectedOptions.find((opt) => opt.name.toLowerCase() === "size")
      
      if (hasSizeOptions) {
        // Product has size options - use color-size combination
        if (colorOption && sizeOption) {
          availability.set(`${colorOption.value}-${sizeOption.value}`, edge.node.availableForSale)
        }
      } else {
        // Product has no size options - use only color
        if (colorOption) {
          availability.set(colorOption.value, edge.node.availableForSale)
        }
      }
    })
    return availability
  }, [product.variants, hasSizeOptions])

  const isVariantAvailable = useCallback(
    (color: string, size?: string) => {
      if (hasSizeOptions) {
        // Product has size options - check color-size combination
        return variantAvailability.get(`${color}-${size}`) ?? false
      } else {
        // Product has no size options - check only color
        return variantAvailability.get(color) ?? false
      }
    },
    [variantAvailability, hasSizeOptions],
  )

  const isAnyVariantInStock = useMemo(
    () => Array.from(variantAvailability.values()).some((available) => available),
    [variantAvailability],
  )

  // --- DATA EXTRACTION ---
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

  // --- STATE MANAGEMENT ---
  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    // Only set initial size if product has size options
    if (hasSizeOptions) {
      const firstAvailable = product.variants.edges.find((v) => v.node.availableForSale)
      return firstAvailable?.node.selectedOptions.find((opt) => opt.name.toLowerCase() === "size")?.value || null
    }
    return null
  })
  const [selectedColor, setSelectedColor] = useState<string | null>(() => {
    const firstAvailable = product.variants.edges.find((v) => v.node.availableForSale)
    return firstAvailable?.node.selectedOptions.find((opt) => opt.name.toLowerCase() === "color")?.value || null
  })
  const [displayImage, setDisplayImage] = useState({
    url: product?.images?.edges?.[0]?.node?.url || "/placeholder.svg",
    altText: product?.images?.edges?.[0]?.node?.altText || product?.title || "Product image",
  })
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

  const handleColorSelect = (color: string) => {
    // Don't change if it's the same color
    if (selectedColor === color) return
    
    setSelectedColor(color)
    
    // Only handle size logic if product has size options
    if (hasSizeOptions && selectedSize && !isVariantAvailable(color, selectedSize)) {
      // Try to find an available size for this color
      const availableSizeForColor = availableSizes.find((size) => isVariantAvailable(color, size))
      if (availableSizeForColor) {
        setSelectedSize(availableSizeForColor)
      }
    }
  }

  const handleSizeSelect = (size: string) => {
    // Don't change if it's the same size
    if (selectedSize === size) return
    
    setSelectedSize(size)
    
    // Only handle color logic if product has size options
    if (hasSizeOptions && selectedColor && !isVariantAvailable(selectedColor, size)) {
      // Try to find an available color for this size
      const availableColorForSize = availableColors.find((color) => isVariantAvailable(color, size))
      if (availableColorForSize) {
        setSelectedColor(availableColorForSize)
      }
    }
  }

  // Effects
  useEffect(() => {
    if (selectedColor && product.variants) {
      const variant = product.variants.edges.find((edge) =>
        edge.node.selectedOptions.some(
          (option) => option.name.toLowerCase() === "color" && option.value === selectedColor,
        ),
      )
      if (variant?.node.image) {
        setDisplayImage({
          url: variant.node.image.url,
          altText: variant.node.image.altText || product.title,
        })
      } else {
        // Fallback to the first product image if variant has no image or no color is selected
        setDisplayImage({
          url: product?.images?.edges?.[0]?.node?.url || "/placeholder.svg",
          altText: product?.images?.edges?.[0]?.node?.altText || product?.title || "Product image",
        })
      }
    }
  }, [selectedColor, product])

  useEffect(() => {
    const interval = setInterval(() => {
      if (galleryImages.length > (isMobile ? 1 : 3)) {
        setActiveGalleryImage((prev) => {
          if (isMobile) {
            // Mobile: scroll through individual images
            return (prev + 1) % galleryImages.length
          } else {
            // Desktop: scroll through groups of 3 images
            const currentGroup = Math.floor(prev / 3)
            const totalGroups = Math.ceil(galleryImages.length / 3)
            const nextGroup = (currentGroup + 1) % totalGroups
            return nextGroup * 3
          }
        })
      }
    }, GALLERY_AUTO_SCROLL_INTERVAL)

    return () => clearInterval(interval)
  }, [galleryImages.length, isMobile])

  // Ensure we have valid initial selections
  useEffect(() => {
    if (!selectedColor && availableColors.length > 0) {
      const firstAvailable = product.variants.edges.find((v) => v.node.availableForSale)
      const initialColor = firstAvailable?.node.selectedOptions.find((opt) => opt.name.toLowerCase() === "color")?.value
      if (initialColor) {
        setSelectedColor(initialColor)
      }
    }
    
    // Only set initial size if product has size options
    if (hasSizeOptions && !selectedSize && availableSizes.length > 0) {
      const firstAvailable = product.variants.edges.find((v) => v.node.availableForSale)
      const initialSize = firstAvailable?.node.selectedOptions.find((opt) => opt.name.toLowerCase() === "size")?.value
      if (initialSize) {
        setSelectedSize(initialSize)
      }
    }
  }, [product.variants, availableColors, availableSizes, selectedColor, selectedSize, hasSizeOptions])

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
                  src={displayImage.url}
                  alt={displayImage.altText}
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
                <div className="flex mb-12">
                  <Link
                    href="/shop"
                    className="flex items-center underline text-xs font-avant-garde group transition-all duration-300"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1 transition-transform duration-300 group-hover:-translate-x-1" />
                    <span className="font-folio-light group-hover:text-gray-500">BACK TO COLLECTIONS</span>
                  </Link>
                </div>
                <h1 className="text-3xl md:text-[36px] font-itc-demi mb-1 animate-fade-in">
                  {product?.title || "Product Name"}
                </h1>
                {/* <h2 className="text-2xl font-bold font-avant-garde mb-6 animate-fade-in animation-delay-100">
                  {product?.productType || "MENS"}
                </h2> */}
                <p className="text-xl md:text-[24px] font-folio-bold mb-8 animate-fade-in animation-delay-200">{formattedPrice}</p>

                {product?.descriptionHtml ? (
                  <div
                    className="text-sm md:text-[14px] font-folio-light mb-10 animate-fade-in animation-delay-300"
                    dangerouslySetInnerHTML={{ __html: extractPureDescription(product.descriptionHtml) }}
                  />
                ) : (
                  <p className="text-sm md:text-[14px] font-folio-light mb-10 animate-fade-in animation-delay-300">
                    This product is your go-to for all your running needs. Made with high-quality materials for maximum
                    comfort and performance.
                  </p>
                )}

                {/* Technical Details Section */}
                {hasTechnicalDetails(product?.descriptionHtml || "") && (
                  <div className="border-t border-gray-200 py-4">
                    <button
                      className="flex items-center justify-between w-full text-left font-folio-bold group cursor-pointer"
                      onClick={() => toggleSection("technical")}
                    >
                      <span className="group-hover:text-gray-500 transition-colors duration-300">
                        Technical Details
                      </span>
                      <div className="transition-transform duration-300 ease-in-out">
                        {expandedSections.technical ? (
                          <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-300 transform rotate-0" />
                        ) : (
                          <ChevronRight className="h-5 w-5 group-hover:text-gray-500 transition-transform duration-300 transform group-hover:rotate-90" />
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
                          {hasTechnicalDetails(product?.descriptionHtml || "") ? (
                            <ul className="pl-5 text-sm md:text-[14px] font-folio-light space-y-3">
                              {product?.descriptionHtml
                                ?.split("<h4><span>Technical Details</span></h4>")[1]
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
                            <ul className="pl-5 text-sm md:text-[14px] font-folio-light space-y-3">
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
                )}

                {/* Composition Section */}
                {hasComposition(product?.descriptionHtml || "") && (
                  <div className="border-t border-gray-200 py-4">
                    <button
                      className="flex items-center justify-between w-full text-left font-folio-bold group cursor-pointer"
                      onClick={() => toggleSection("composition")}
                    >
                      <span className="group-hover:text-gray-500 transition-colors duration-300">Composition</span>
                      <div className="transition-transform duration-300 ease-in-out">
                        {expandedSections.composition ? (
                          <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-300 transform rotate-0" />
                        ) : (
                          <ChevronRight className="h-5 w-5 group-hover:text-gray-500 transition-transform duration-300 transform group-hover:rotate-90" />
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
                          {hasComposition(product?.descriptionHtml || "") ? (
                            <div
                              className="pl-5 text-sm md:text-[14px] font-folio-light space-y-3"
                              dangerouslySetInnerHTML={{
                                __html:
                                  product?.descriptionHtml
                                    ?.split("<h4><span>Composition</span></h4>")[1]
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
                )}

                {/* Color Selection */}
                <div className="mt-10 border-b pb-12">
                  <h3 className="text-sm font-folio-bold mb-4">COLOR</h3>
                  <div className="flex space-x-3">
                    {availableColors.length > 0 ? (
                      availableColors.map((color) => {
                        // A color is available if:
                        // - Product has size options: there's at least one size available for it AND product has stock
                        // - Product has no size options: the color variant is available for sale
                        const isAvailable = isAnyVariantInStock && (
                          hasSizeOptions 
                            ? availableSizes.some((size) => isVariantAvailable(color, size))
                            : isVariantAvailable(color)
                        )
                        return (
                          <button
                            key={color}
                            disabled={!isAvailable}
                            className={`w-10 h-10 rounded-full transition-all duration-300 transform cursor-pointer ${
                              selectedColor === color
                                ? "ring-2 ring-offset-4 ring-black scale-110"
                                : "border border-gray-300 hover:scale-110"
                            } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                            style={{ backgroundColor: getColorHex(color) }}
                            onClick={() => handleColorSelect(color)}
                            aria-label={color}
                          />
                        )
                      })
                    ) : (
                      <p className="text-xs text-gray-500">No colors available</p>
                    )}
                  </div>
                </div>

                {/* Size Selection */}
                {hasSizeOptions && (
                  <div className="mt-10">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-folio-bold">SIZE</h3>
                      <button
                        onClick={() => setIsSizeChartOpen(true)}
                        className="text-xs underline font-avant-garde hover:text-orange-500 transition-colors relative group cursor-pointer"
                      >
                        <span className="text-sm font-folio-medium">SIZE GUIDE</span>
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                      </button>
                    </div>
                    <div className="flex space-x-8">
                      {availableSizes.length > 0 ? (
                        availableSizes.map((size) => {
                          // A size is available if the selected color is available with this size AND product has stock
                          const isAvailable = isAnyVariantInStock && (selectedColor ? isVariantAvailable(selectedColor, size) : true)
                          return (
                            <button
                              key={size}
                              disabled={!isAvailable}
                              className={`w-10 h-10 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                                selectedSize === size
                                  ? "border border-black rounded-full font-bold transform scale-110"
                                  : "border-gray-300 hover:border-black text-[#ADADAD] hover:text-black hover:scale-110"
                              } ${!isAvailable ? "opacity-25 cursor-not-allowed relative" : ""} font-itc-bold`}
                              onClick={() => handleSizeSelect(size)}
                            >
                              {size}
                              {!isAvailable && (
                                <span className="absolute w-full h-0.5 bg-gray-400 transform rotate-45"></span>
                              )}
                            </button>
                          )
                        })
                      ) : (
                        <p className="text-xs font-folio-medium text-gray-500">No sizes available</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <AddToCartButton
                  product={product}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  hasSizeOptions={hasSizeOptions}
                  disabled={!isAnyVariantInStock || (
                    hasSizeOptions 
                      ? (selectedColor && selectedSize ? !isVariantAvailable(selectedColor, selectedSize) : true)
                      : (selectedColor ? !isVariantAvailable(selectedColor) : true)
                  )}
                  buttonText={!isAnyVariantInStock ? "OUT OF STOCK" : undefined}
                />

                {/* Additional Links */}
                <div className="flex flex-row justify-center gap-4 sm:gap-8 mt-6 text-sm w-full font-folio-light">
                  <Link
                    href="/faq"
                    className="underline hover:text-orange-500 transition-colors duration-300 relative group text-center sm:text-left"
                  >
                    <span>Delivery</span>
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    href="/faq"
                    className="underline hover:text-orange-500 transition-colors duration-300 relative group text-center sm:text-left"
                  >
                    <span>Return & Exchange</span>
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    href="/faq"
                    className="underline hover:text-orange-500 transition-colors duration-300 relative group text-center sm:text-left"
                  >
                    <span>Washing Guide</span>
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          {galleryImages.length > 1 && (
            <div className="mt-16 overflow-hidden">
              <div className="flex justify-center">
                <div className="relative" style={{ 
                  width: isMobile ? `${500}px` : `${3 * 500 + 2 * 16}px` 
                }}>
                  <div
                    className="flex space-x-4 transition-transform duration-700 ease-in-out"
                    style={{ 
                      transform: isMobile 
                        ? `translateX(-${activeGalleryImage * (500 + 16)}px)`
                        : `translateX(-${Math.floor(activeGalleryImage / 3) * (3 * 500 + 2 * 16)}px)` 
                    }}
                  >
                    {galleryImages.map((image, index) => (
                      <div
                        key={image}
                        className={`flex-shrink-0 w-[500px] h-[375px] relative transition-all duration-500 cursor-pointer ${
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
                </div>
              </div>

              {/* Gallery Navigation Dots */}
              {galleryImages.length > (isMobile ? 1 : 3) && (
                <div className="flex justify-center mt-4 space-x-2">
                  {isMobile ? (
                    // Mobile: one dot per image
                    galleryImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          activeGalleryImage === index ? "bg-orange-500 w-4" : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        onClick={() => setActiveGalleryImage(index)}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))
                  ) : (
                    // Desktop: one dot per group of 3 images
                    Array.from({ length: Math.ceil(galleryImages.length / 3) }, (_, groupIndex) => (
                      <button
                        key={groupIndex}
                        className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          Math.floor(activeGalleryImage / 3) === groupIndex ? "bg-orange-500 w-4" : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        onClick={() => setActiveGalleryImage(groupIndex * 3)}
                        aria-label={`View image group ${groupIndex + 1}`}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Related Products */}
          <div className="mt-20 px-4 md:px-0">
            <h2 className="text-xl md:text-[16px] font-itc-demi mb-8 text-left">YOU MAY ALSO LIKE</h2>
            {relatedProducts.length > 0 ? (
              isMobile ? (
                <div className="flex overflow-x-auto pb-4 gap-6 hide-scrollbar -mx-4 px-4">
                  {relatedProducts.map((product) => (
                    <div key={product.id} className="flex-shrink-0 min-w-[174px] transform transition-transform duration-300 hover:scale-105">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
              <p className="text-center py-8 text-gray-500">No related products found.</p>
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
"use client"

import { useState } from "react"
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

// Import tipe data yang dibutuhkan dari lib/shopify/types
import type { ProductDetailType, ProductCardType } from "@/lib/shopify/types"

// Definisi props untuk komponen ini.
// Komponen ini akan menerima 'product' dan 'relatedProducts' dari layout.tsx
interface ProductDetailPageProps {
  product: ProductDetailType
  relatedProducts: ProductCardType[]
}

// Komponen ini adalah Client Component.
// Tidak boleh ada 'async' di sini karena tidak melakukan fetching data langsung.
export default function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
  // Data produk sudah diterima sebagai props, tidak perlu lagi fetching data di sini.
  // Tidak ada `useParams` atau `useEffect` untuk fetching data di sini.

  // --- Data real dari objek 'product' yang diterima sebagai prop ---
  const mainImageUrl = product?.images?.edges?.[0]?.node?.url || "/placeholder.svg"
  const mainImageAlt = product?.images?.edges?.[0]?.node?.altText || product?.title || "Product image"
  const galleryImages = product?.images?.edges?.map((edge) => edge.node.url) || []

  const formattedPrice = product?.priceRange?.minVariantPrice
    ? `${product.priceRange.minVariantPrice.currencyCode} ${product.priceRange.minVariantPrice.amount}`
    : "Price not available"

  // Ekstrak Colors dan Sizes dari varian produk dengan null checks
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

  // --- State untuk UI interaktif (ini yang membuat komponen ini Client Component) ---
  const [selectedSize, setSelectedSize] = useState<string | null>(availableSizes.length > 0 ? availableSizes[0] : null)
  const [selectedColor, setSelectedColor] = useState<string | null>(
    availableColors.length > 0 ? availableColors[0] : null,
  )
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    technical: true, // Default open
    composition: false,
    care: false,
  })
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const extractPureDescription = (htmlString: string): string => {
    // If no description, return empty string
    if (!htmlString) return ""

    // Extract just the first paragraph (pure description)
    const firstParagraphMatch = htmlString.match(/<p>.*?<\/p>/s)
    if (firstParagraphMatch) {
      return firstParagraphMatch[0]
    }

    // Fallback: return the original string if we can't extract the first paragraph
    return htmlString
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Size chart data untuk produk ini
  const sizeChartData = [
    { size: "X-Small", chest: "43", front: "59", back: "61" },
    { size: "Small", chest: "46", front: "61", back: "63" },
    { size: "Medium", chest: "48", front: "63", back: "65" },
    { size: "Large", chest: "50", front: "65", back: "67" },
    { size: "X-Large", chest: "53", front: "68", back: "70" },
  ]

  const handleCartClick = () => {
    setIsCartOpen(true)
  }

  // Fungsi untuk mengonversi nama warna ke kode hex
  const getColorHex = (colorName: string) => {
    const colorMap: Record<string, string> = {
      black: "#000000",
      white: "#FFFFFF",
      olive: "#7aa799",
      navy: "#0a192f",
      gray: "#808080",
      mint: "#98fb98",
    }

    return colorMap[colorName.toLowerCase()] || "#cccccc"
  }

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
            {/* Kolom Kiri: Gambar Produk */}
            <div>
              <div className="bg-gray-100 mt-16 aspect-square relative">
                <Image
                  src={mainImageUrl || "/placeholder.svg"}
                  alt={mainImageAlt}
                  fill
                  className="object-cover"
                  priority // Prioritas tinggi untuk gambar utama
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Kolom Kanan: Detail Produk */}
            <div className="w-full flex md:justify-end">
              <div className="md:w-2/3 md:px-0 px-4">
                <div className="flex mb-6">
                  <Link href="/shop" className="flex items-center underline text-xs font-avant-garde">
                    <ArrowLeft className="h-3 w-3 mr-1" /> BACK TO COLLECTIONS
                  </Link>
                </div>
                <h1 className="text-3xl font-bold font-avant-garde mb-1">{product?.title || "Product Name"}</h1>
                {/* Anda bisa tambahkan kategori atau gender di sini dari product.productType atau tags */}
                <h2 className="text-2xl font-bold font-avant-garde mb-6">{product?.productType || "MENS"}</h2>
                <p className="text-xl font-avant-garde mb-8">{formattedPrice}</p>

                {product?.descriptionHtml ? (
                  <div
                    className="text-sm font-avant-garde mb-10"
                    dangerouslySetInnerHTML={{ __html: extractPureDescription(product.descriptionHtml) }}
                  />
                ) : (
                  <p className="text-sm font-avant-garde mb-10">
                    This product is your go-to for all your running needs. Made with high-quality materials for maximum
                    comfort and performance.
                  </p>
                )}

                {/* Technical Details, Composition, Care: Konten dummy jika tidak ada di Shopify Metafields */}
                <div className="border-t border-gray-200 py-4">
                  <button
                    className="flex items-center justify-between w-full text-left font-avant-garde font-medium"
                    onClick={() => toggleSection("technical")}
                  >
                    Technical Details
                    {expandedSections.technical ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                  {expandedSections.technical && (
                    <div className="mt-4">
                      {product?.descriptionHtml && product.descriptionHtml.includes("Technical Details") ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              product.descriptionHtml
                                .split("<h4><span>Technical Details</span></h4>")[1]
                                ?.split("<h4>")[0] || "",
                          }}
                        />
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

                <div className="border-t border-gray-200 py-4">
                  <button
                    className="flex items-center justify-between w-full text-left font-avant-garde font-medium"
                    onClick={() => toggleSection("composition")}
                  >
                    Composition
                    {expandedSections.composition ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                  {expandedSections.composition && (
                    <div className="mt-4">
                      {product?.descriptionHtml && product.descriptionHtml.includes("Composition") ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: product.descriptionHtml.split("<h4><span>Composition</span></h4>")[1] || "",
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

                {/* Bagian Warna */}
                <div className="mt-10 border-b pb-12">
                  <h3 className="text-sm font-avant-garde mb-4">COLOR</h3>
                  <div className="flex space-x-3">
                    {availableColors.length > 0 ? (
                      availableColors.map((color) => (
                        <button
                          key={color}
                          className={`w-10 h-10 rounded-full ${selectedColor === color ? "ring-2 ring-offset-4 ring-black" : "border border-gray-300"}`}
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

                {/* Bagian Ukuran */}
                <div className="mt-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-avant-garde">SIZE</h3>
                    <button
                      onClick={() => setIsSizeChartOpen(true)}
                      className="text-xs underline font-avant-garde hover:text-orange-500 transition-colors"
                    >
                      SIZE GUIDE
                    </button>
                  </div>
                  <div className="flex space-x-8">
                    {availableSizes.length > 0 ? (
                      availableSizes.map((size) => (
                        <button
                          key={size}
                          className={`w-10 h-10 text-xs flex items-center justify-center ${
                            selectedSize === size
                              ? "border border-black rounded-full font-bold"
                              : "border-gray-300 hover:border-black text-[#ADADAD]"
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

                <button
                  className="w-full bg-black text-white py-4 mt-10 font-avant-garde hover:bg-gray-900 transition-colors"
                  onClick={handleCartClick}
                >
                  ADD TO CART
                </button>

                <div className="flex gap-8 mt-6 text-xs w-full items-center justify-center font-avant-garde">
                  <Link href="#" className="underline">
                    Delivery
                  </Link>
                  <Link href="#" className="underline">
                    Return & Exchange
                  </Link>
                  <Link href="#" className="underline">
                    Washing Guide
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="mt-16 overflow-x-auto hide-scrollbar">
            <div className="flex space-x-4">
              {galleryImages.map((image, index) => (
                <div key={image} className="flex-shrink-0 w-[500px] h-[375px] relative">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product view ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="500px" // Sesuaikan ukuran untuk gambar gallery
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-20">
            <h2 className="text-xl font-bold mb-8 font-avant-garde">YOU MAY ALSO LIKE</h2>
            {relatedProducts.length > 0 ? (
              isMobile ? (
                <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
                  {relatedProducts.map((product) => (
                    <div key={product.id}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {relatedProducts.map((product) => (
                    <div key={product.id}>
                      <ProductCard product={product} />
                      <button className="mt-2 text-xs underline font-avant-garde" onClick={handleCartClick}>
                        ADD TO BAG
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
        onUpdateQuantity={(id, quantity) => console.log("Update quantity", id, quantity)}
        onRemoveItem={(id) => console.log("Remove item", id)}
      />
    </div>
  )
}

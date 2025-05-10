"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ChevronDown, ArrowLeft } from "lucide-react"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import ProductCard, { type Product } from "@/components/ui/ProductCard"

const relatedProducts: Product[] = [
  {
    id: 1,
    name: "BEATER LONGSLEEVE",
    category: "T-Shirts",
    price: "Rp480.000",
    image: "/black-jacket.png",
    colors: ["#000000", "#FFFFFF"],
  },
  {
    id: 2,
    name: "BEATER LONGSLEEVE",
    category: "T-Shirts",
    price: "Rp480.000",
    image: "/black-long-sleeve.png",
    colors: ["#000000", "#FFFFFF"],
  },
  {
    id: 3,
    name: "BEATER LONGSLEEVE",
    category: "T-Shirts",
    price: "Rp480.000",
    image: "/blue-t-shirt.png",
    colors: ["#000000", "#FFFFFF"],
  },
  {
    id: 4,
    name: "BEATER LONGSLEEVE",
    category: "T-Shirts",
    price: "Rp480.000",
    image: "/placeholder.svg?key=ih1wv",
    colors: ["#000000", "#FFFFFF"],
  },
]

const galleryImages = [
  "/hikers-rain-jackets.png",
  "/forest-hikers-jackets.png",
  "/placeholder.svg?key=gallery3",
  "/placeholder.svg?key=gallery4",
]

export default function ProductDetailPage() {
  const [selectedSize, setSelectedSize] = useState<number>(3)
  const [selectedColor, setSelectedColor] = useState<string>("black")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    technical: true,
    composition: false,
    care: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="bg-gray-100 mt-16 aspect-square relative">
                <Image
                  src="/black-quarter-zip-jacket.png"
                  alt="BEYOND QUARTER-ZIP TOP MEN'S"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="flex justify-end">
                <div className="w-2/3">
                    <div className="flex mb-6">
                        <Link href="/shop" className="flex items-center underline text-xs font-avant-garde">
                            <ArrowLeft className="h-3 w-3 mr-1" /> BACK TO COLLECTIONS
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold font-avant-garde mb-1">BEYOND QUARTER-ZIP TOP</h1>
                    <h2 className="text-2xl font-bold font-avant-garde mb-6">MENS</h2>
                    <p className="text-xl font-avant-garde mb-8">Rp600.000</p>

                    <p className="text-sm font-avant-garde mb-10">
                        This Quarter-Zip Top is your go-to for chilly runs, versatile enough for all types of workouts. Boasts a
                        high-to-width ratio, so you need to roll up your sleeves and run. The Quarter-Zip Top is made from 80%
                        nylon and 20% spandex. Available in Black.
                    </p>

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
                            <ul className="mt-4 pl-5 text-sm font-avant-garde space-y-3">
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
                        <ul className="mt-4 pl-5 text-sm font-avant-garde space-y-3">
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

                    <div className="mt-10 border-b pb-12">
                        <h3 className="text-sm font-avant-garde mb-4">COLOR</h3>
                        <div className="flex space-x-3">
                        <button
                            className={`w-10 h-10 rounded-full bg-black ${
                            selectedColor === "black" ? "ring-2 ring-offset-4 ring-black" : "border border-gray-300"
                            }`}
                            onClick={() => setSelectedColor("black")}
                            aria-label="Black"
                        />
                        <button
                            className={`w-10 h-10 rounded-full bg-[#7aa799] ${
                            selectedColor === "mint" ? "ring-2 ring-offset-4 ring-[#7aa799]" : "border border-gray-300"
                            }`}
                            onClick={() => setSelectedColor("mint")}
                            aria-label="Mint"
                        />
                        </div>
                    </div>

                    <div className="mt-10">
                        <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-avant-garde">SIZE</h3>
                        <Link href="#" className="text-xs underline font-avant-garde">
                            SIZE GUIDE
                        </Link>
                        </div>
                        <div className="flex space-x-8">
                        {[1, 2, 3].map((size) => (
                            <button
                            key={size}
                            className={`w-10 h-10 flex items-center justify-center ${
                                selectedSize === size
                                ? "border border-black rounded-full font-bold"
                                : "border-gray-300 hover:border-black text-[#ADADAD]"
                            } font-avant-garde`}
                            onClick={() => setSelectedSize(size)}
                            >
                            {size}
                            </button>
                        ))}
                        </div>
                    </div>

                    <button className="w-full bg-black text-white py-4 mt-10 font-avant-garde hover:bg-gray-900 transition-colors">
                        ADD TO CART
                    </button>

                    <div className="flex gap-8 mt-6 text-xs font-avant-garde">
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

          <div className="mt-16 overflow-x-auto hide-scrollbar">
            <div className="flex space-x-4">
              {galleryImages.map((image, index) => (
                <div key={index} className="flex-shrink-0 w-[500px] h-[375px] relative">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-xl font-bold mb-8 font-avant-garde">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                  <button className="mt-2 text-xs underline font-avant-garde">ADD TO BAG</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

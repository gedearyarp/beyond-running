"use client"

import { useState } from "react"
import Image from "next/image"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import ProductCard, { type Product } from "@/components/ui/ProductCard"
import CustomDropdown from "@/components/ui/dropdown"

// Sample product data
const products: Product[] = Array(16)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    name: "BEATER LONGSLEEVE",
    category: "T-Shirts",
    price: "Rp480.000",
    image: `/placeholder.svg?height=400&width=300&query=black${index % 4 === 0 ? " jacket" : index % 4 === 1 ? " long sleeve" : index % 4 === 2 ? " blue t-shirt" : " sleeveless"}`,
    colors: ["#000000", "#FFFFFF"],
  }))

// Dropdown options
const sizeOptions = [
  { value: "size-1", label: "Size 1" },
  { value: "size-2", label: "Size 2" },
  { value: "size-3", label: "Size 3" },
  { value: "one-size", label: "One Size Fit All" },
]

const categoryOptions = [
  { value: "new-arrivals", label: "New Arrivals" },
  { value: "running-tops", label: "Running Tops" },
  { value: "running-bottoms", label: "Running Bottoms" },
  { value: "outerwear", label: "Outerwear" },
  { value: "postrun", label: "Postrun" },
  { value: "accessories", label: "Accessories" },
]

const genderOptions = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
]

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best Selling" },
  { value: "price-low", label: "Price, Low to High" },
  { value: "price-high", label: "Price, High to Low" },
]

export default function ShopPage() {
  const [size, setSize] = useState("")
  const [category, setCategory] = useState("")
  const [gender, setGender] = useState("")
  const [sortBy, setSortBy] = useState("featured")

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="relative w-full h-[300px] md:h-[608px]">
          <Image
            src="/images/shop.png"
            alt="Collections End of Summer"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-y-0 right-0 flex items-center pr-12">
            <h1 className="text-3xl md:text-4xl font-bold font-avant-garde tracking-wide text-white">
              COLLECTIONS END OF <span className="italic">SUMMER</span>
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Description */}
          <div className="max-w-3xl mb-12">
            <p className="text-sm font-avant-garde">
              Explore our performance-driven essentials merge cutting-edge innovation with the demands of real-world
              running. Designed for the tropics, each piece balances breathability, durability, and adaptive comfort.
              Every piece is crafted to support the runner's journey, from training to race day and beyond.
            </p>
          </div>

          <div className="flex flex-wrap justify-between items-center mb-8 border-b border-gray-200 pb-4">
            <div className="flex space-x-20 mb-4 md:mb-0">
              <CustomDropdown options={sizeOptions} value={size} onChange={setSize} placeholder="Size" />
              <CustomDropdown
                options={categoryOptions}
                value={category}
                onChange={setCategory}
                placeholder="Category"
              />
              <CustomDropdown options={genderOptions} value={gender} onChange={setGender} placeholder="Men" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-avant-garde text-gray-500">80 ITEMS</span>
              <span>|</span>
              <div className="flex items-center">
                <span className="text-sm font-avant-garde mr-2">Sort By:</span>
                <CustomDropdown isSort={true} options={sortOptions} value={sortBy} onChange={setSortBy} placeholder="Featured" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button className="border border-black px-8 py-3 text-sm font-avant-garde hover:bg-black hover:text-white transition-colors">
              LOAD MORE
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

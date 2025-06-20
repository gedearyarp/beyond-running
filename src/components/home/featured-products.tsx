"use client"

import Link from "next/link"
import ProductCard, { type Product } from "@/components/ui/ProductCard"
import { useState } from "react"

// Sample product data
const products: Product[] = [
  {
    id: 1,
    name: "BEATER LONGSLEEVE",
    category: "T-Shirts",
    price: "Rp480.000",
    image: "/placeholder.svg?height=300&width=300",
    colors: ["#000000", "#FFFFFF", "#0000FF"],
  },
  {
    id: 2,
    name: "BEATER LONGSLEEVE",
    category: "T-Shirts",
    price: "Rp480.000",
    image: "/placeholder.svg?height=300&width=300",
    colors: ["#000000", "#FFFFFF"],
  },
  {
    id: 3,
    name: "BEATER LONGSLEEVE",
    category: "T-Shirts",
    price: "Rp480.000",
    image: "/placeholder.svg?height=300&width=300",
    colors: ["#000000", "#FF0000"],
  },
  {
    id: 4,
    name: "BEATER LONGSLEEVE",
    category: "T-Shirts",
    price: "Rp480.000",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 5,
    name: "BEATER LONGSLEEVE",
    category: "T-Shirts",
    price: "Rp480.000",
    image: "/placeholder.svg?height=300&width=300",
    colors: ["#000000", "#FFFFFF", "#0000FF"],
  },
  {
    id: 6,
    name: "BEATER LONGSLEEVE",
    category: "T-Shirts",
    price: "Rp480.000",
    image: "/placeholder.svg?height=300&width=300",
    colors: ["#000000", "#FFFFFF"],
  },
  {
    id: 7,
    name: "BEATER LONGSLEEVE",
    category: "T-Shirts",
    price: "Rp480.000",
    image: "/placeholder.svg?height=300&width=300",
    colors: ["#000000", "#FF0000"],
  },
  {
    id: 8,
    name: "BEATER LONGSLEEVE",
    category: "T-Shirts",
    price: "Rp480.000",
    image: "/placeholder.svg?height=300&width=300",
  },
]

type TabType = "new" | "favorite" | "sale"

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<TabType>("new")

  return (
    <div className="my-12">
      <div className="mb-6">
        <h2 className="text-xl md:text-[42px] font-itc-demi mb-4 md:mb-10">FEATURED ARTICLES</h2>
        <div className="flex pb-2 gap-3 md:gap-6">
          <button
            className={`text-xs md:text-sm font-medium md:mr-6 font-folio-medium ${
              activeTab === "new" ? "font-bold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("new")}
          >
            New Arrivals
          </button>
          <button
            className={`text-xs md:text-sm md:mr-6 font-folio-medium ${activeTab === "favorite" ? "font-bold" : "text-gray-500"}`}
            onClick={() => setActiveTab("favorite")}
          >
            Runners Favorite
          </button>
          <button
            className={`text-xs md:text-sm font-folio-medium ${activeTab === "sale" ? "font-bold" : "text-gray-500"}`}
            onClick={() => setActiveTab("sale")}
          >
            Past Season Sale
          </button>
          <div className="md:text-sm text-xs ml-auto">
            <Link href="/shop" className="text-xs md:text-sm font-itc-md underline">
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar"
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

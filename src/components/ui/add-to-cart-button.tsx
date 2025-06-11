"use client"

import { useState } from "react"
import { useCartStore } from "@/store/cart"
import type { ProductDetailType } from "@/lib/shopify/types"

interface AddToCartButtonProps {
  product: ProductDetailType
  selectedSize: string | null
  selectedColor: string | null
  onAddToCart?: () => void
}

export default function AddToCartButton({ product, selectedSize, selectedColor, onAddToCart }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return

    setIsAdding(true)
    
    // Find the selected variant
    const selectedVariant = product.variants.edges.find(
      (edge) =>
        edge.node.selectedOptions.some((opt) => opt.name === "Size" && opt.value === selectedSize) &&
        edge.node.selectedOptions.some((opt) => opt.name === "Color" && opt.value === selectedColor)
    )

    if (selectedVariant) {
      addItem({
        id: selectedVariant.node.id,
        title: product.title,
        size: selectedSize,
        color: selectedColor,
        price: parseFloat(product.priceRange.minVariantPrice.amount),
        quantity: 1,
        image: product.images.edges[0]?.node.url || "/placeholder.svg"
      })

      onAddToCart?.()
    }

    // Reset adding state after animation
    setTimeout(() => {
      setIsAdding(false)
    }, 800)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={!selectedSize || !selectedColor || isAdding}
      className={`w-full mt-10 py-4 px-6 text-sm font-medium transition-all duration-300 ${
        !selectedSize || !selectedColor
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : isAdding
          ? "bg-green-500 text-white"
          : "bg-black text-white hover:bg-gray-900"
      }`}
    >
      {!selectedSize || !selectedColor
        ? "SELECT SIZE & COLOR"
        : isAdding
        ? "ADDED TO CART"
        : "ADD TO CART"}
    </button>
  )
} 
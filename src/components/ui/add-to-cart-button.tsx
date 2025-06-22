"use client"

import { useState } from "react"
import { useCartStore } from "@/store/cart"
import type { ProductDetailType } from "@/lib/shopify/types"
import { showProcessingToast, showSuccessToast, showErrorToast } from "./Notification"
import OutOfStockModal from "./OutOfStockModal"

interface AddToCartButtonProps {
  product: ProductDetailType
  selectedSize: string | null
  selectedColor: string | null
  disabled?: boolean
  buttonText?: string
}

export default function AddToCartButton({ product, selectedSize, selectedColor, disabled, buttonText }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addItem, cartId, setCartId } = useCartStore()

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      showErrorToast("Please select a size and color.")
      return
    }

    setIsLoading(true)
    const toastId = showProcessingToast()

    const selectedVariant = product.variants.edges.find(
      (edge) =>
        edge.node.selectedOptions.some((opt) => opt.name.toLowerCase() === "size" && opt.value === selectedSize) &&
        edge.node.selectedOptions.some((opt) => opt.name.toLowerCase() === "color" && opt.value === selectedColor),
    )?.node

    if (!selectedVariant) {
      showErrorToast("Product variant not found.", toastId)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          quantity: 1,
          cartId: cartId,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        if (result.error === "OUT_OF_STOCK") {
          showErrorToast("This item is out of stock.", toastId)
          setIsModalOpen(true)
        } else {
          throw new Error(result.error || "Failed to add item.")
        }
      } else {
        // Add item to the client-side store
        addItem({
          id: selectedVariant.id,
          title: product.title,
          size: selectedSize,
          color: selectedColor,
          price: parseFloat(selectedVariant.price.amount),
          quantity: 1,
          image: selectedVariant.image?.url || product.images.edges[0]?.node.url || "/placeholder.svg",
        })

        // Update the cartId in the store
        if (result.cartId) {
          setCartId(result.cartId)
        }

        showSuccessToast(
          {
            title: product.title,
            variantTitle: selectedVariant.title,
            image: selectedVariant.image?.url || product.images.edges[0]?.node.url || "/placeholder.svg",
          },
          toastId,
        )
      }
    } catch (error) {
      showErrorToast("An error occurred.", toastId)
      console.error("Add to cart error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isButtonDisabled = disabled || !selectedSize || !selectedColor || isLoading

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={isButtonDisabled}
        className={`w-full mt-10 py-4 px-6 text-sm md:text-[21px] font-itc-md transition-all duration-300 ${
          isButtonDisabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {isLoading ? "ADDING..." : buttonText || "ADD TO CART"}
      </button>
      <OutOfStockModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          window.location.reload()
        }}
      />
    </>
  )
} 
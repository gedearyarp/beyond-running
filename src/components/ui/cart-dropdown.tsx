"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus } from "lucide-react"
import { useCartStore } from "@/store/cart"
import Button from "./button"
import { useRouter } from "next/navigation"

export default function CartDropdown() {
  const [discountCode, setDiscountCode] = useState("")
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalItems, 
    getTotalPrice,
    isOpen,
    closeCart,
    checkout
  } = useCartStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const router = useRouter()

  if (!isOpen) return null

  function formatPrice(price: number) {
    if (typeof price !== 'number' || isNaN(price)) return 'Rp0';
    return `Rp${price.toLocaleString('id-ID')}`;
  }

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true)
      const checkoutUrl = await checkout()
      router.push(checkoutUrl)
    } catch (error) {
      console.error("Checkout failed:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      {/* Backdrop - No click handler */}
      <div className="fixed inset-0 bg-black/20 z-40" />

      {/* Cart Dropdown - Responsive */}
      <div 
        className="fixed top-[100px] md:top-[100px] right-0 w-full md:max-w-md bg-white shadow-2xl z-50 h-[calc(100vh-100px)] md:h-[calc(100vh-100px)] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base md:text-lg font-bold">
            {getTotalItems()} Product{getTotalItems() !== 1 ? "s" : ""}
          </h2>
          {/* Only the close button has click handler */}
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
              <X className="h-4 w-4 text-white" />
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* Empty Cart State */
            <div className="flex flex-col items-center justify-center h-full px-4 md:px-6">
              <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Your Cart is Empty</h3>
                <Link
                  href="/shop"
                  className="inline-block bg-black text-white px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium hover:bg-gray-900 transition-colors"
                >
                  BACK TO SHOPPING
                </Link>
              </div>
            </div>
          ) : (
            /* Cart Items */
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 md:gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-24 md:w-32 md:h-40 bg-gray-100 flex-shrink-0 relative">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title || 'Product image'} fill className="object-cover" />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm md:text-lg mb-1 md:mb-2 truncate">{item.name}</h3>
                    <div className="text-xs md:text-sm text-gray-600 space-y-1 mb-2 md:mb-3">
                      <p>Size: {item.size}</p>
                      <p>Color: {item.color}</p>
                      <p className="font-medium text-black">{item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border border-gray-300 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                      <span className="w-6 md:w-8 text-center text-sm md:text-base font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border border-gray-300 hover:border-gray-400 transition-colors"
                      >
                        <Plus className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs md:text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Section - Only show when cart has items */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 md:p-6 flex-shrink-0">
            {/* Discount Code */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-2">
              <span className="text-xs md:text-sm font-medium">Got a gift card or discount code?</span>
              <button className="text-xs md:text-sm underline hover:no-underline transition-all text-left md:text-right">
                Apply at checkout
              </button>
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full bg-black text-white py-3 md:py-4 px-4 text-sm md:text-base font-medium hover:bg-gray-900 transition-colors flex items-center justify-between"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              <span>{isCheckingOut ? "Processing..." : "CHECK OUT"}</span>
              <span>{formatPrice(getTotalPrice())}.-</span>
            </Button>

            {/* Tax Notice */}
            <p className="text-xs text-gray-600 mt-2 md:mt-3">Tax incl. Shipping calculated at checkout</p>
          </div>
        )}
      </div>
    </>
  )
}

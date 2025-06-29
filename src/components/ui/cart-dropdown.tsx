"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus } from "lucide-react"
import { useCartStore } from "@/store/cart"
import Button from "./button"
import { useRouter } from "next/navigation"
import OutOfStockModal from "./OutOfStockModal"

export default function CartDropdown() {
  const [discountCode, setDiscountCode] = useState("")
  const [isOutOfStockModalOpen, setIsOutOfStockModalOpen] = useState(false)
  const [outOfStockItems, setOutOfStockItems] = useState<any[]>([])
  const [isClosing, setIsClosing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalItems, 
    getTotalPrice,
    isOpen,
    closeCart,
    checkoutWithoutValidation,
    validateStock
  } = useCartStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const router = useRouter()

  // Handle close animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      closeCart()
      setIsClosing(false)
    }, 300) // Wait for animation to complete
  }

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  // Reset closing state when cart opens and trigger open animation
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false)
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when cart is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore body scroll when cart closes
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  function formatPrice(price: number) {
    if (typeof price !== 'number' || isNaN(price)) return 'Rp0';
    return `Rp${price.toLocaleString('id-ID')}`;
  }

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true)
      
      // Validate stock before checkout
      const stockValidation = await validateStock()
      
      if (!stockValidation.isValid) {
        if (stockValidation.outOfStockItems.length > 0) {
          setOutOfStockItems(stockValidation.outOfStockItems)
          setIsOutOfStockModalOpen(true)
          setIsCheckingOut(false)
          return
        }
      }
      
      // Use checkoutWithoutValidation since we already validated
      const checkoutUrl = await checkoutWithoutValidation()
      if (checkoutUrl) {
        router.push(checkoutUrl)
      }
    } catch (error) {
      console.error("Checkout failed:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsCheckingOut(false)
    }
  }

  const handleOutOfStockModalClose = async () => {
    setIsOutOfStockModalOpen(false)
    setOutOfStockItems([])
    
    // Remove out of stock items from cart first
    if (outOfStockItems.length > 0) {
      outOfStockItems.forEach(item => {
        removeItem(item.id)
      })
    }
    
    // Check if there are any items left in cart
    const remainingItems = items.filter(item => 
      !outOfStockItems.some(outOfStockItem => outOfStockItem.id === item.id)
    )
    
    if (remainingItems.length === 0) {
      // No items left, close cart
      closeCart()
      return
    }
    
    // If there are remaining items, proceed with checkout
    try {
      setIsCheckingOut(true)
      const checkoutUrl = await checkoutWithoutValidation()
      if (checkoutUrl) {
        router.push(checkoutUrl)
      }
    } catch (error) {
      console.error("Checkout failed:", error)
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      {/* Backdrop with click handler */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300 ${
          isClosing ? 'opacity-0' : isVisible ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={handleBackdropClick}
      />

      {/* Cart Dropdown - Responsive */}
      <div 
        className={`fixed top-[100px] md:top-[100px] right-0 w-full md:max-w-md bg-white shadow-2xl z-50 h-[calc(100vh-100px)] md:h-[calc(100vh-100px)] flex flex-col transition-all duration-300 ${
          isClosing ? 'translate-y-full opacity-0' : isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ 
          transform: isClosing ? 'translateY(100%)' : isVisible ? 'translateY(0)' : 'translateY(100%)',
          opacity: isClosing ? 0 : isVisible ? 1 : 0
        }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0 transition-all duration-300 ${
          isVisible && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <h2 className="text-base md:text-lg font-folio-bold">
            {getTotalItems()} Product{getTotalItems() !== 1 ? "s" : ""}
          </h2>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <div className="w-6 h-6 bg-[#D17928] rounded flex items-center justify-center">
              <X className="h-4 w-4 text-white" />
            </div>
          </button>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isVisible && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {items.length === 0 ? (
            /* Empty Cart State */
            <div className="flex flex-col items-center justify-center h-full px-4 md:px-6">
              <div className="text-center mb-8 font-folio-bold">
                <h3 className="text-xl md:text-2xl text-gray-900 mb-6 md:mb-8">Your Cart is Empty</h3>
                <Link
                  href="/shop"
                  className="inline-block bg-black text-white px-6 md:px-8 py-3 md:py-4 text-sm md:text-base hover:bg-gray-900 transition-colors"
                >
                  BACK TO SHOPPING
                </Link>
              </div>
            </div>
          ) : (
            /* Cart Items */
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {items.map((item, index) => (
                <div key={item.id} className="flex gap-3 md:gap-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Product Image */}
                  <div className="w-20 h-24 md:w-[185px] md:h-[250px] flex-shrink-0 relative">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title || 'Product image'} fill className="object-contain" />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 mt-4">
                    <h3 className="font-itc-demi text-sm md:text-lg mb-1 md:mb-2 truncate">{item.title}</h3>
                    <div className="text-xs md:text-sm font-itc-md space-y-1 mb-2 md:mb-3">
                      <p>Size: {item.size}</p>
                      <p>Color: {item.color}</p>
                      <p className="font-medium text-black">Rp{item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 md:w-6 md:h-6 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                      <span className="w-6 md:w-8 text-center text-sm md:text-sm font-itc-demi">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 md:w-6 md:h-6 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
                      >
                        <Plus className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs font-itc-md md:text-sm text-gray-600 hover:text-gray-900 underline transition-colors cursor-pointer"
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
          <div className={`border-t border-gray-200 p-4 md:p-6 flex-shrink-0 transition-all duration-300 ${
            isVisible && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '100ms' }}>
            {/* Discount Code */}
            {/* <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-2">
              <span className="text-xs md:text-sm font-medium">Got a gift card or discount code?</span>
              <button className="text-xs md:text-sm underline hover:no-underline transition-all text-left md:text-right">
                Apply at checkout
              </button>
            </div> */}

            {/* Checkout Button */}
            <Button
              className="w-full bg-black text-white py-3 md:py-8 px-4 text-xs md:text-sm font-itc-md hover:bg-gray-900 transition-colors flex items-center justify-between cursor-pointer"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              <span>{isCheckingOut ? "Processing..." : "CHECK OUT"}</span>
              <span>{formatPrice(getTotalPrice())}.-</span>
            </Button>

            {/* Tax Notice */}
            <p className="text-xs font-folio-bold mt-2 md:mt-3">Tax incl. Shipping calculated at checkout</p>
          </div>
        )}
      </div>

      {isOutOfStockModalOpen && (
        <OutOfStockModal
          isOpen={isOutOfStockModalOpen}
          onClose={handleOutOfStockModalClose}
          outOfStockItems={outOfStockItems}
          isCartValidation={true}
        />
      )}
    </>
  )
}

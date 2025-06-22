"use client"

import { X } from "lucide-react"
import type { CartItem } from "@/store/cart"

interface OutOfStockModalProps {
  isOpen: boolean
  onClose: () => void
  outOfStockItems?: CartItem[]
  isCartValidation?: boolean
}

export default function OutOfStockModal({ isOpen, onClose, outOfStockItems = [], isCartValidation = false }: OutOfStockModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-folio-bold">
            {isCartValidation ? "Items Removed from Cart" : "Product Out of Stock"}
          </h2>
          <button onClick={onClose} className="p-1 cursor-pointer rounded-full hover:bg-gray-200">
            <X size={24} />
          </button>
        </div>
        
        {isCartValidation && outOfStockItems.length > 0 ? (
          <div>
            <p className="font-folio-light text-gray-600 mb-4">
              The following items are no longer available and have been removed from your cart:
            </p>
            <div className="space-y-2 mb-6">
              {outOfStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-folio-bold text-sm">{item.title}</p>
                    <p className="text-xs text-gray-600">
                      Size: {item.size} | Color: {item.color}
                    </p>
                  </div>
                  <p className="text-sm font-folio-bold">Qty: {item.quantity}</p>
                </div>
              ))}
            </div>
            <p className="font-folio-light text-gray-600 mb-6">
              You can continue with checkout for the remaining items in your cart.
            </p>
          </div>
        ) : (
          <p className="font-folio-light text-gray-600 mb-6">
            We're sorry, but this product is currently unavailable. Please check back later or explore other variants or
            products.
          </p>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-black font-folio-bold text-white py-2 px-6 rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {isCartValidation ? "Continue" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  )
} 
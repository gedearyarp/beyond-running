"use client"

import { X } from "lucide-react"

interface OutOfStockModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OutOfStockModal({ isOpen, onClose }: OutOfStockModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-folio-bold">Product Out of Stock</h2>
          <button onClick={onClose} className="p-1 cursor-pointer rounded-full hover:bg-gray-200">
            <X size={24} />
          </button>
        </div>
        <p className="font-folio-light text-gray-600 mb-6">
          We're sorry, but this product is currently unavailable. Please check back later or explore other variants or
          products.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-black font-folio-bold text-white py-2 px-6 rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
} 
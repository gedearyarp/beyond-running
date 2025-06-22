import { useEffect, useRef } from 'react'
import { useCartStore } from '@/store/cart'
import { showErrorToast } from '@/components/ui/Notification'

export function useCartValidation() {
  const { items, validateStock, removeItem } = useCartStore()
  const validationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Only validate if there are items in cart
    if (items.length === 0) {
      if (validationIntervalRef.current) {
        clearInterval(validationIntervalRef.current)
        validationIntervalRef.current = null
      }
      return
    }

    // Validate cart every 5 minutes
    const validateCart = async () => {
      try {
        const stockValidation = await validateStock()
        
        if (!stockValidation.isValid) {
          // Handle out of stock items
          if (stockValidation.outOfStockItems.length > 0) {
            // Remove out of stock items
            stockValidation.outOfStockItems.forEach(item => {
              removeItem(item.id)
            })
            
            // Show notification
            showErrorToast(
              `${stockValidation.outOfStockItems.length} item(s) removed from cart due to stock unavailability.`
            )
          }
          
          // Show warning for low stock items
          if (stockValidation.lowStockItems.length > 0) {
            showErrorToast(
              `${stockValidation.lowStockItems.length} item(s) have low stock. Please checkout soon.`
            )
          }
        }
      } catch (error) {
        console.error('Cart validation error:', error)
      }
    }

    // Initial validation
    validateCart()

    // Set up periodic validation (every 5 minutes)
    validationIntervalRef.current = setInterval(validateCart, 5 * 60 * 1000)

    return () => {
      if (validationIntervalRef.current) {
        clearInterval(validationIntervalRef.current)
      }
    }
  }, [items.length, validateStock, removeItem])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (validationIntervalRef.current) {
        clearInterval(validationIntervalRef.current)
      }
    }
  }, [])
} 
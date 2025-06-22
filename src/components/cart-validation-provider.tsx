"use client"

import { useCartValidation } from '@/hooks/use-cart-validation'

export default function CartValidationProvider() {
  useCartValidation()
  
  // This component doesn't render anything, it just provides the validation functionality
  return null
} 
import { NextResponse } from 'next/server'
import { CartItem } from '@/store/cart'

// In-memory cart storage (you might want to use a database in production)
let cartItems: CartItem[] = []

export async function GET() {
  return NextResponse.json(cartItems)
}

export async function POST(request: Request) {
  try {
    const item: CartItem = await request.json()
    
    // Check if item already exists with same id, size, and color
    const existingItemIndex = cartItems.findIndex(
      (i) => i.id === item.id && i.size === item.size && i.color === item.color
    )

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      cartItems[existingItemIndex].quantity += item.quantity
    } else {
      // Add new item
      cartItems.push(item)
    }

    return NextResponse.json(cartItems)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 400 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, quantity } = await request.json()
    
    const itemIndex = cartItems.findIndex((item) => item.id === id)
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    cartItems[itemIndex].quantity = Math.max(0, quantity)
    
    return NextResponse.json(cartItems)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 400 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    
    cartItems = cartItems.filter((item) => item.id !== id)
    
    return NextResponse.json(cartItems)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 400 }
    )
  }
} 
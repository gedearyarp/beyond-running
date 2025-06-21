import { NextRequest, NextResponse } from "next/server"
import { shopifyFetch } from "@/lib/shopify"
import { gql } from "graphql-request"

// --- GraphQL Queries for the new Shopify Cart API ---

const CREATE_CART_MUTATION = gql`
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 250) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`

const ADD_LINES_TO_CART_MUTATION = gql`
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 250) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`

const GET_VARIANT_QUERY = gql`
  query getProductVariant($id: ID!) {
    node(id: $id) {
      ... on ProductVariant {
        id
        availableForSale
      }
    }
  }
`

// --- Route Handler ---
export async function POST(request: NextRequest) {
  try {
    const { variantId, quantity = 1, cartId: existingCartId } = await request.json()

    if (!variantId) {
      return NextResponse.json({ error: "Missing variantId" }, { status: 400 })
    }

    // 1. Check real-time availability
    const variantData = await shopifyFetch<{ node: { availableForSale: boolean } }>({
      query: GET_VARIANT_QUERY,
      variables: { id: variantId },
      cache: "no-store",
    })

    if (!variantData.node?.availableForSale) {
      return NextResponse.json({ success: false, error: "OUT_OF_STOCK" })
    }

    // 2. Add to cart using the new Cart API
    let cartId = existingCartId
    let cartResult

    const lines = [{ merchandiseId: variantId, quantity }]

    if (cartId) {
      const result = await shopifyFetch({
        query: ADD_LINES_TO_CART_MUTATION,
        variables: { cartId, lines },
      })
      cartResult = result.cartLinesAdd
    } else {
      const result = await shopifyFetch({
        query: CREATE_CART_MUTATION,
        variables: { input: { lines } },
      })
      cartResult = result.cartCreate
    }

    // 3. Handle errors from Shopify's mutation
    if (cartResult.userErrors?.length > 0) {
      console.error("Shopify User Errors:", cartResult.userErrors)
      const isOutOfStock = cartResult.userErrors.some((e) => e.code === "INVENTORY_RESERVATION_FAILED")
      if (isOutOfStock) {
        return NextResponse.json({ success: false, error: "OUT_OF_STOCK" })
      }
      return NextResponse.json({ success: false, error: "SHOPIFY_ERROR" })
    }

    if (!cartResult.cart) {
      throw new Error("Cart object is missing in Shopify's response.")
    }

    cartId = cartResult.cart.id

    return NextResponse.json({ success: true, cartId, cart: cartResult.cart })
  } catch (error) {
    console.error("Add to cart API error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
} 
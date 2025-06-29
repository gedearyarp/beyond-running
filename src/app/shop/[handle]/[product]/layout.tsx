import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductDetailByHandle, getAllProductsForShopPage } from "@/lib/shopify"
import type { ProductDetailType, ProductCardType } from "@/lib/shopify/types"
import Loading from "@/components/ui/loading"
import ProductDetailPage from "./page"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { handle: string; product: string }
}): Promise<Metadata> {
  try {
    const product = await getProductDetailByHandle(params.product)
    
    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      }
    }

    // Extract plain text from HTML description
    const plainDescription = product.descriptionHtml 
      ? product.descriptionHtml.replace(/<[^>]*>/g, '').substring(0, 160)
      : "Product description not available"

    return {
      title: product.title,
      description: plainDescription,
      openGraph: {
        title: product.title,
        description: plainDescription,
        images: product.images.edges.map((edge) => edge.node.url),
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: "Error",
      description: "An error occurred while loading the product.",
    }
  }
}

export default async function ProductLayout({
  params,
}: {
  params: { handle: string; product: string }
}) {
  try {
    // Fetch product data and related products in parallel
    const [product, allProducts] = await Promise.all([
      getProductDetailByHandle(params.product),
      getAllProductsForShopPage(),
    ])

    if (!product) {
      notFound()
    }

    // Filter out current product and get related products
    const relatedProducts = allProducts
      .filter((p) => p.handle !== params.product)
      .slice(0, 4)

    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loading text="Loading product..." />
        </div>
      }>
        <ProductDetailPage product={product} relatedProducts={relatedProducts} />
      </Suspense>
    )
  } catch (error) {
    console.error('Error in ProductLayout:', error)
    notFound()
  }
}

// Generate static params for all products
export async function generateStaticParams() {
  try {
    const products = await getAllProductsForShopPage()
    
    return products.map((product) => ({
      handle: product.handle,
      product: product.handle,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
} 
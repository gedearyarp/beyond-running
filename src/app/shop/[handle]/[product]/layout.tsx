import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductDetailByHandle, getAllProductsForShopPage } from "@/lib/shopify"
import type { ProductDetailType, ProductCardType } from "@/lib/shopify/types"
import ProductDetailPage from "./page"

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
      }
    }

    return {
      title: `${product.title} | Beyond Running`,
      description: product.descriptionHtml?.replace(/<[^>]*>/g, "").slice(0, 160) || "Product details",
      openGraph: {
        title: product.title,
        description: product.descriptionHtml?.replace(/<[^>]*>/g, "").slice(0, 160) || "Product details",
        images: [
          {
            url: product.images.edges[0]?.node.url || "/placeholder.svg",
            width: 1200,
            height: 630,
            alt: product.title,
          },
        ],
      },
    }
  } catch (error) {
    return {
      title: "Error | Beyond Running",
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
    const [productData, allProducts] = await Promise.all([
      getProductDetailByHandle(params.product),
      getAllProductsForShopPage(8),
    ])

    if (!productData) {
      notFound()
    }

    // Filter out current product and get related products
    const relatedProducts = allProducts
      .filter((p) => p.handle !== params.product)
      .slice(0, 4)

    return <ProductDetailPage product={productData} relatedProducts={relatedProducts} />
  } catch (error) {
    notFound()
  }
}

// Generate static params for all products
export async function generateStaticParams() {
  try {
    const products = await getAllProductsForShopPage(250)
    return products.map((product) => ({
      handle: "frontpage", // or you can get this from your collections
      product: product.handle,
    }))
  } catch {
    return []
  }
} 
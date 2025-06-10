// components/ui/ProductCard.tsx
import Link from "next/link"
import Image from "next/image"
import { ProductCardType } from "@/lib/shopify/types"

interface ProductCardProps {
  product: ProductCardType
  isShop?: boolean
  collectionHandle?: string
}

export default function ProductCard({ product, isShop, collectionHandle }: ProductCardProps) {
  const imageUrl = product.images?.edges?.[0]?.node?.url || "/placeholder.svg";
  const imageAlt = product.images?.edges?.[0]?.node?.altText || product.title;

  const formattedPrice = `${product.priceRange ? (product.priceRange.minVariantPrice.currencyCode) + (product.priceRange.minVariantPrice.amount) : "1"}`;
  const hasVariants = product.variants?.edges?.length > 0;
  const colorsCount = hasVariants ? (product.variants.edges.length) / 5 : 0;

  // Ensure product.handle exists
  if (!product.handle) {
    console.error("Product handle is missing:", product);
    return null;
  }

  // Use consistent URL structure
  const productUrl = collectionHandle 
    ? `/shop/${collectionHandle}/${product.handle}`
    : `/shop/all/${product.handle}`;

  return (
    <Link href={productUrl} className="group block w-full">
      <div className={`${isShop ? "w-full" : "w-[174px]"} md:w-[331px] h-[247px] md:h-[445px] relative mb-3 overflow-hidden mb-8`}>
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 33vw"
          priority={isShop}
        />
      </div>
      <h3 className="font-bold text-sm font-avant-garde">{product.title}</h3>
      <p className="text-xs text-gray-600 mb-1 font-avant-garde">{colorsCount} Colors</p>
      <p className="text-sm font-avant-garde">{formattedPrice}</p>
    </Link>
  )
}
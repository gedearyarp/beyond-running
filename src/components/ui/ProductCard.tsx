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

  const formattedPrice = product.priceRange
    ? `${product.priceRange.minVariantPrice.currencyCode} ${Number(product.priceRange.minVariantPrice.amount).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : "1";
  
  // Calculate colors count from metafields
  const colorsCount = (() => {
    if (!product.metafields || !Array.isArray(product.metafields)) return 0;
    
    const colorMetafield = product.metafields.find(m => m && m.key === "color-pattern");
    if (!colorMetafield || !colorMetafield.references || !colorMetafield.references.nodes) return 0;
    
    return colorMetafield.references.nodes.filter(node => node && node.handle).length;
  })();

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
      <div className={`${
        isShop 
          ? "w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px]" 
          : "w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px]"
      } relative mb-3 overflow-hidden`}>
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 280px, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          priority={isShop}
        />
      </div>
      <div className="px-1">
        <h3 className="font-bold text-xs sm:text-sm font-folio-bold line-clamp-2 mb-1">{product.title}</h3>
        <p className="text-xs text-gray-600 mb-1 font-folio-light">{colorsCount} Colors</p>
        <p className="text-xs sm:text-sm font-folio-bold">{formattedPrice}</p>
      </div>
    </Link>
  )
}
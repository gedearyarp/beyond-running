import Link from "next/link"
import Image from "next/image"

// Define the Product interface
export interface Product {
  id: number | string
  name: string
  category: string
  price: string
  image: string
  colors?: string[]
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="bg-gray-100 aspect-square relative mb-3 overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="font-bold text-sm font-avant-garde">{product.name}</h3>
      <p className="text-xs text-gray-600 mb-1 font-avant-garde">{product.colors?.length} Colors</p>
      <p className="text-sm font-avant-garde">{product.price}</p>
    </Link>
  )
}

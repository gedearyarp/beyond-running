"use client"

import Link from "next/link"
import { useCollectionsStore } from "@/store/collections"

// Skeleton Loading Component
const CollectionSkeleton = () => (
  <div className="space-y-4">
    {[...Array(8)].map((_, index) => (
      <div key={index}>
        <div 
          className={`rounded animate-shimmer ${
            index % 3 === 0 ? 'w-full h-5' : 
            index % 3 === 1 ? 'w-4/5 h-4' : 'w-3/4 h-4'
          }`}
          style={{ 
            animationDelay: `${index * 200}ms`
          }}
        ></div>
      </div>
    ))}
  </div>
)

export default function ShopSubmenu() {
  const { collections, isLoading, error } = useCollectionsStore()

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-folio-bold text-[#d17928] mb-8 animate-fade-in">Shop</h2>

      <div className="flex">
        {/* Left Column */}
        <div className="w-1/3 mr-8">
          <ul className="space-y-2 mb-6 text-md">
            {[
              { href: "/shop/men", text: "Men" },
              { href: "/shop/women", text: "Women" },
              { href: "/shop/all", text: "All" }
            ].map((item, index) => (
              <li key={item.href} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <Link href={item.href} className="block font-folio-medium cursor-pointer">
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>

          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link
              href="/shop"
              className="inline-block font-folio-bold bg-gray-300 text-black rounded-full px-2 py-1 text-sm cursor-pointer"
            >
              Discover All
            </Link>
          </div>
        </div>

        {/* Right Column - Collections */}
        <div className="w-2/3 text-md font-folio-bold">
          {isLoading ? (
            <CollectionSkeleton />
          ) : error ? (
            <div className="text-red-500 animate-fade-in">Error loading collections</div>
          ) : (
            <ul className="space-y-4">
              {collections.map((collection, index) => (
                <li key={collection.id} className="animate-fade-in" style={{ animationDelay: `${(index + 4) * 100}ms` }}>
                  <Link 
                    href={`/shop/${collection.handle}`} 
                    className="block cursor-pointer hover:text-gray-500 transition-colors duration-300"
                  >
                    {collection.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

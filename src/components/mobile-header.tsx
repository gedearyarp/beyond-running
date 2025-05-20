"use client"

import Link from "next/link"
import { Menu, Search, ShoppingBag } from "lucide-react"

interface MobileHeaderProps {
  onMenuClick?: () => void
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-4 md:hidden">
      <button onClick={onMenuClick} aria-label="Menu">
        <Menu className="h-6 w-6" />
      </button>

      <div className="absolute left-1/2 transform -translate-x-1/2  flex items-center space-x-4 text-lg font-bold">
        <Link href="/">BEYOND:RUNNING</Link>
      </div>

      <div className="flex items-center space-x-4">
        <button aria-label="Search">
          <Search className="h-4 w-4" />
        </button>
        <Link href="/cart" aria-label="Shopping cart">
          <ShoppingBag className="h-4 w-4" />
        </Link>
      </div>
    </header>
  )
}

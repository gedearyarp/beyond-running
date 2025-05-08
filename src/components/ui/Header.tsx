import Link from "next/link"
import { Search, User, ShoppingBag } from "lucide-react"

export default function Header() {
  return (
    <header className="w-full">
      {/* Announcement Bar */}
      <div className="w-full bg-black text-white text-center py-2 text-xs">
        Free Shipping On All Orders Above Rp 599,999
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-8 py-4 bg-white">
        {/* Left Navigation */}
        <nav className="flex space-x-6">
          <Link href="/shop" className="text-sm font-medium">
            Shop
          </Link>
          <Link href="/peripherals" className="text-sm font-medium">
            Peripherals
          </Link>
          <Link href="/community" className="text-sm font-medium">
            Community
          </Link>
          <Link href="/about" className="text-sm font-medium">
            About
          </Link>
        </nav>

        {/* Logo - Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold">
          <Link href="/">BEYOND:RUNNING</Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-6">
          <button aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          <Link href="/account" aria-label="Account">
            <User className="h-5 w-5" />
          </Link>
          <Link href="/cart" aria-label="Shopping cart">
            <ShoppingBag className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}

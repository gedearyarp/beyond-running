import Link from "next/link"

export default function ShopSubmenu() {
  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-bold text-[#d17928] mb-8">Shop</h2>

      <div className="flex">
        {/* Left Column */}
        <div className="w-1/3 mr-8">
          <ul className="space-y-2 mb-6 text-md">
            <li>
              <Link href="/shop/men" className="block font-medium cursor-pointer">
                Men
              </Link>
            </li>
            <li>
              <Link href="/shop/women" className="block font-medium cursor-pointer">
                Women
              </Link>
            </li>
            <li>
              <Link href="/shop/all" className="block font-medium cursor-pointer">
                All
              </Link>
            </li>
          </ul>

          <div>
            <Link
              href="/shop"
              className="inline-block font-bold bg-gray-300 text-black rounded-full px-2 py-1 text-md cursor-pointer"
            >
              Discover All
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-2/3 text-md font-bold">
          <ul className="space-y-4">
            <li>
              <Link href="/shop/new-arrivals" className="block cursor-pointer">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link href="/shop/runners-favorite" className="block cursor-pointer">
                Runners Favorite
              </Link>
            </li>
            <li>
              <Link href="/shop/running-tops" className="block cursor-pointer">
                Running Tops
              </Link>
            </li>
            <li>
              <Link href="/shop/running-bottoms" className="block cursor-pointer">
                Running Bottoms
              </Link>
            </li>
            <li>
              <Link href="/shop/post-run" className="block cursor-pointer">
                Post Run
              </Link>
            </li>
            <li>
              <Link href="/shop/accessories" className="block cursor-pointer">
                Accessories
              </Link>
            </li>
            <li>
              <Link href="/shop/moment-of-stillness" className="block cursor-pointer">
                Moment of Stillness
              </Link>
            </li>
            <li>
              <Link href="/shop/prototype-collection" className="block cursor-pointer">
                Prototype Collection
              </Link>
            </li>
            <li>
              <Link href="/shop/running-series" className="block cursor-pointer">
                Running Series
              </Link>
            </li>
            <li>
              <Link href="/shop/end-of-summer" className="block cursor-pointer">
                End of Summer
              </Link>
            </li>
            <li>
              <Link href="/shop/celebration-of-running" className="block cursor-pointer">
                Celebration of Running
              </Link>
            </li>
            <li>
              <Link href="/shop/past-seasons" className="block cursor-pointer">
                More Past Seasons Collections
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

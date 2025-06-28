import Link from "next/link"

export default function PeripheralsSubmenu() {
  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-bold text-[#d17928] mb-8">Peripherals</h2>

      <div className="flex">
        {/* Left Column */}
        <div className="w-1/3 mr-8">
          <Link
            href="/peripherals"
            className="inline-block bg-gray-300 text-black rounded-full px-2 py-1 text-md font-medium cursor-pointer"
          >
            Read All
          </Link>
        </div>

        {/* Right Column */}
        <div className="w-2/3 text-md font-bold">
          <ul className="space-y-4">
            <li>
              <Link href="/peripherals/discovery" className="block cursor-pointer">
                Discovery
              </Link>
            </li>
            <li>
              <Link href="/peripherals/clarity" className="block cursor-pointer">
                Clarity
              </Link>
            </li>
            <li>
              <Link href="/peripherals/community" className="block cursor-pointer">
                Community
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

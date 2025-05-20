import Link from "next/link"

export default function CommunitySubmenu() {
  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-[#d17928] mb-8">Community</h2>

      <div className="flex">
        {/* Left Column */}
        <div className="w-1/3 mr-8">
          <Link
            href="/community/join"
            className="inline-block bg-gray-300 text-black rounded-full px-2 py-1 text-md font-medium"
          >
            Join Now
          </Link>
        </div>

        {/* Right Column */}
        <div className="w-2/3 text-md font-bold">
          <ul className="space-y-4">
            <li>
              <Link href="/community?view=upcoming" className="block">
                Upcoming Events
              </Link>
            </li>
            <li>
              <Link href="/community?view=past" className="block">
                Past Events
              </Link>
            </li>
            <li>
              <Link href="/community?view=calendar" className="block">
                Calendar
              </Link>
            </li>
            <li>
              <Link href="/community/membership" className="block">
                Membership
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

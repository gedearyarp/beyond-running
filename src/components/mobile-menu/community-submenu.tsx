import Link from "next/link"

export default function CommunitySubmenu() {
  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-folio-bold text-[#d17928] mb-8 animate-fade-in">Community</h2>

      <div className="flex">
        {/* Left Column */}
        <div className="w-1/3 mr-8">
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <Link
              href="/community/join"
              className="inline-block bg-gray-300 text-black rounded-full px-2 py-1 text-md font-folio-bold cursor-pointer"
            >
              Join Now
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-2/3 text-md font-folio-bold">
          <ul className="space-y-4">
            {[
              { href: "/community?view=upcoming", text: "Upcoming Events" },
              { href: "/community?view=past", text: "Past Events" },
              { href: "/community?view=calendar", text: "Calendar" },
              { href: "/community/membership", text: "Membership" }
            ].map((item, index) => (
              <li key={item.href} className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 150}ms` }}>
                <Link href={item.href} className="block cursor-pointer">
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

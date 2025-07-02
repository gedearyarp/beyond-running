import Link from "next/link";

export default function CommunitySubmenu() {
    return (
        <div className="px-4 py-6">
            <h2 className="text-2xl font-folio-bold text-[#d17928] mb-8 animate-fade-in">
                Community
            </h2>

            <div className="flex">
                {/* Left Column */}
                <div className="w-1/3 mr-8">
                    <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                        <Link
                            href="/program"
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
                            {
                                href: { pathname: "/program", query: { view: "upcoming" } },
                                text: "Upcoming Events",
                                disabled: false,
                            },
                            {
                                href: { pathname: "/program", query: { view: "past" } },
                                text: "Past Events",
                                disabled: false,
                            },
                            {
                                href: { pathname: "/program", query: { view: "calendar" } },
                                text: "Calendar",
                                disabled: false,
                            },
                            {
                                href: { pathname: "/program", query: { view: "membership" } },
                                text: "Membership (Coming Soon)",
                                disabled: true,
                            },
                        ].map((item, index) => (
                            <li
                                key={item.text}
                                className="animate-fade-in"
                                style={{ animationDelay: `${(index + 1) * 150}ms` }}
                            >
                                {item.disabled ? (
                                    <span className="block text-gray-400 cursor-not-allowed select-none">
                                        {item.text}
                                    </span>
                                ) : (
                                    <Link href={item.href} className="block cursor-pointer">
                                        {item.text}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

import Link from "next/link"
import Image from "next/image"

const promoCards = [
  {
    id: 1,
    title: "DISCOVER OUR NEW COLLECTION",
    buttonText: "Discover",
    footerText: "SHOP:PRODUCTS-COLLECTIONS",
    link: "/collection",
    bgImage: "/images/featured_1.png",
    icon: "/icons/featured_1.svg", // You'll need to create or find this icon
  },
  {
    id: 2,
    title: "STORY BEHIND FROM OUR RUNNERS",
    buttonText: "Read",
    footerText: "PERIPHERALS:STORIES-EDITORIAL-TIPS",
    link: "/stories",
    bgImage: "/images/featured_2.png",
    icon: "/icons/featured_2.svg", // You'll need to create or find this icon
  },
  {
    id: 3,
    title: "BALI 140 RELAY OPEN REGISTRATION",
    buttonText: "Join",
    footerText: "COMMUNITY:EVENTS-COLLABORATION-FEATURED RUNNERS",
    link: "/registration",
    bgImage: "/images/featured_3.png",
    icon: "/icons/featured_3.svg", // You'll need to create or find this icon
  },
]

export default function PromoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
      {promoCards.map((card) => (
        <div key={card.id} className="relative h-[638px] group overflow-hidden">
          <div className="absolute inset-0 group-hover:bg-black/60 transition-colors z-10" />
          <Image
            src={card.bgImage || "/placeholder.svg"}
            alt={card.title}
            fill
            className="object-fill group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 gap-30 flex flex-col items-center justify-center text-white z-20 p-6 text-center">
            <div className="w-[110px] h-[110px] flex items-center justify-center">
              {card.icon ? (
                <Image src={card.icon || "/placeholder.svg"} alt="Icon" width={110} height={110} />
              ) : (
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">●</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-8 items-center text-center">
              <h3 className="text-2xl font-bold font-avant-garde tracking-wide">{card.title}</h3>
              <Link
                href={card.link}
                className="bg-white text-black text-sm py-2 px-8 rounded-full hover:bg-gray-200 transition-colors font-avant-garde"
              >
                {card.buttonText}
              </Link>
              <p className="text-xs font-avant-garde absolute bottom-8">{card.footerText}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

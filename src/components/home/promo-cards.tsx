"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

const promoCards = [
  {
    id: 1,
    title: "DISCOVER OUR NEW COLLECTION",
    buttonText: "Discover",
    footerText: "SHOP:PRODUCTS-COLLECTIONS",
    link: "/collection",
    bgImage: "/images/featured_1.png",
    icon: "/icons/featured_1.svg",
    gifIcon: "/gif/discover-white.gif", // Animated version
  },
  {
    id: 2,
    title: "STORY BEHIND FROM OUR RUNNERS",
    buttonText: "Read",
    footerText: "PERIPHERALS:STORIES-EDITORIAL-TIPS",
    link: "/stories",
    bgImage: "/images/featured_2.png",
    icon: "/icons/featured_2.svg",
    gifIcon: "/gif/clarity-white.gif", // Animated version
  },
  {
    id: 3,
    title: "BALI 140 RELAY OPEN REGISTRATION",
    buttonText: "Join",
    footerText: "COMMUNITY:EVENTS-COLLABORATION-FEATURED RUNNERS",
    link: "/registration",
    bgImage: "/images/featured_3.png",
    icon: "/icons/featured_3.svg",
    gifIcon: "/gif/community-white.gif", // Animated version
  },
]

export default function PromoCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
      {promoCards.map((card) => (
        <div
          key={card.id}
          className="relative h-[477px] md:h-[638px] group overflow-hidden cursor-pointer"
          onMouseEnter={() => setHoveredCard(card.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Background Overlay with Premium Animation */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 group-hover:from-black/60 group-hover:via-black/30 group-hover:to-black/70 transition-all duration-700 ease-out z-10" />

          {/* Background Image with Parallax Effect */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={card.bgImage || "/placeholder.svg"}
              alt={card.title}
              fill
              className="object-cover group-hover:scale-110 transition-all duration-1000 ease-out"
            />
          </div>

          {/* Content Container */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 p-6 text-center">
            {/* PREMIUM ANIMATED ICON */}
            <div className="w-[110px] h-[110px] flex items-center justify-center mb-8 relative">
              {/* Static Icon */}
              <div
                className={`absolute inset-0 transition-all duration-500 ease-out ${
                  hoveredCard === card.id ? "opacity-0 scale-90 rotate-12" : "opacity-100 scale-100 rotate-0"
                }`}
              >
                {card.icon ? (
                  <Image
                    src={card.icon || "/placeholder.svg"}
                    alt="Static Icon"
                    width={110}
                    height={110}
                    className="drop-shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-3xl">●</span>
                  </div>
                )}
              </div>

              {/* Animated GIF Icon */}
              <div
                className={`absolute inset-0 transition-all duration-500 ease-out ${
                  hoveredCard === card.id ? "opacity-100 scale-210 rotate-0" : "opacity-0 scale-75 -rotate-12"
                }`}
              >
                <Image
                  src={card.gifIcon || "/placeholder.svg"}
                  alt="Animated Icon"
                  width={110}
                  height={110}
                  className="drop-shadow-2xl"
                  unoptimized // Important for GIFs
                />
              </div>

              {/* Glow Effect Behind Icon */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-700 ease-out ${
                  hoveredCard === card.id
                    ? "bg-white/20 blur-xl scale-150 opacity-100"
                    : "bg-white/5 blur-lg scale-100 opacity-0"
                }`}
              />
            </div>

            {/* Content with Staggered Animation */}
            <div className="flex flex-col gap-8 items-center text-center">
              {/* Title with Scale Effect */}
              <h3
                className={`text-[27px] font-itc-demi tracking-wide transition-all duration-500 ease-out ${
                  hoveredCard === card.id ? "scale-105 text-white drop-shadow-lg" : "scale-100 text-white/90"
                }`}
              >
                {card.title}
              </h3>

              {/* Button with Premium Hover */}
              <Link
                href={card.link}
                className={`bg-white text-black text-sm py-2.5 px-5 rounded-full font-folio-bold transition-all duration-500 ease-out transform ${
                  hoveredCard === card.id
                    ? "bg-white text-black scale-110 shadow-2xl shadow-white/25 hover:bg-gray-100"
                    : "bg-white/90 text-black/90 scale-100 shadow-lg hover:bg-white"
                }`}
              >
                {card.buttonText}
              </Link>

              {/* Footer Text with Fade */}
              <p
                className={`text-xs font-itc-xl absolute bottom-8 transition-all duration-500 ease-out ${
                  hoveredCard === card.id ? "opacity-100 transform translate-y-0" : "opacity-70 transform translate-y-2"
                }`}
              >
                {card.footerText}
              </p>
            </div>
          </div>

          {/* Premium Border Glow on Hover */}
          <div
            className={`absolute inset-0 rounded-lg transition-all duration-700 ease-out pointer-events-none ${
              hoveredCard === card.id
                ? "ring-2 ring-white/30 ring-inset shadow-2xl shadow-white/10"
                : "ring-0 ring-transparent"
            }`}
          />
        </div>
      ))}
    </div>
  )
}

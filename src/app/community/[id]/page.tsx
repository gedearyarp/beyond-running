"use client"

import { useState } from "react"
import Image from "next/image"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"


export default function CommunityDetailPage() {
  const event = {
    id: 1,
    title: "EQUATOR STRIDE: THE BALI MARATHON",
    date: "Wednesday 4th September, 6:45pm for a 7pm start",
    location: "MARCHON™ Stratford, 1, Cooperage Yard, London",
    description:
      "Strength and conditioning can really make the bar for runners, decreasing risk of injury, improving muscle activation and enhancing biomechanics and running economy. Join us on Wednesday 4th September for an all-women evening designed to elevate your strength training around running, with BEYOND™ and BEYOND Women. With a strength training for women runners workshop led by POCARI™ Coaches, followed by an easy 5km community run led by BEYOND Women, this will be an evening of community, connection and education.",
    image: "/images/com_image.png",
    heroImage: "/images/com_detail_banner.png",
    keyDetails: [
      "Women led, but not women exclusive. We will run 10 km together as one group. All paces and all runners welcome.",
      "Meet at Session Training Greenpoint, 65 Kent St, Brooklyn, NY 11222, for 7pm bag drop and 7:15pm warm up.",
      "Departing at 7:30pm for a night time run across Brooklyn.",
      "Join us post-run for prizes, refreshments and fun at Session Training.",
      "This event will be photographed/filmed.",
    ],
    giveaway: {
      title: "BEYOND X POCARI™ Giveaway:",
      description:
        "Unable to attend? Sign up to be in with the chance of winning a POCARI™ nutrition bundle, IDR1.500.000,- BEYOND voucher and 3 months free on BEYOND™ Training app.",
    },
    terms: [
      "The competition closes 28/02/2025.",
      "To enter subscribe to our email list (1 entry per person).",
      "The winner of a SOAR Race Vest and Marathon Shorts (rrp £315) will be chosen at random and notified via email week commencing 03/03/2025.",
      "Open to participants aged 18+.",
      "The prize is non-transferable and no cash alternatives will be offered.",
    ],
  }

  const [activeTab, setActiveTab] = useState<"rundown" | "documentation">("rundown")

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="relative w-full h-[608px]">
          <Image src={event.heroImage || "/placeholder.svg"} alt={event.title} fill className="object-cover" priority />
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-40">
            {/* Left Column - Event Image */}
            <div>
              <div className="relative h-[900px] w-full">
                <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              </div>
            </div>

            {/* Right Column - Event Details */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-avant-garde mb-8">{event.title}</h1>

              <div className="mb-8 py-12">
                <p className="text-sm font-avant-garde mb-1">
                  <strong>Time :</strong> {event.date}
                </p>
                <p className="text-sm font-avant-garde">
                  <strong>Place :</strong> {event.location}
                </p>
              </div>

              <p className="text-sm font-avant-garde mb-8 leading-relaxed">{event.description}</p>

              <div className="mb-8">
                <h2 className="text-lg font-bold font-avant-garde mb-4">Events Key Details:</h2>
                <ul className="space-y-2">
                  {event.keyDetails.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-sm font-avant-garde">• {detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-24">
                <h2 className="text-lg font-bold font-avant-garde mb-4">{event.giveaway.title}</h2>
                <p className="text-sm font-avant-garde">{event.giveaway.description}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-bold font-avant-garde mb-4">Terms & Conditions:</h2>
                <ul className="space-y-2">
                  {event.terms.map((term, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-sm font-avant-garde">• {term}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="w-full bg-black text-white py-4 font-avant-garde hover:bg-gray-900 transition-colors mb-6">
                SIGN UP
              </button>

              <div className="flex border-t border-gray-200 pt-4">
                <button
                  className={`mr-6 text-sm font-avant-garde ${activeTab === "rundown" ? "font-bold" : "text-gray-500"}`}
                  onClick={() => setActiveTab("rundown")}
                >
                  Full Rundown
                </button>
                <button
                  className={`text-sm font-avant-garde ${
                    activeTab === "documentation" ? "font-bold" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("documentation")}
                >
                  Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

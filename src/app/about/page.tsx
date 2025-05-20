"use client"

import Image from "next/image"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import useMobile from "@/hooks/use-mobile"
import { useState } from "react"
import MobileHeader from "@/components/mobile-header"
import MobileMenu from "@/components/mobile-menu"

export default function AboutPage() {
  const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isMobile ? (
        <>
          <MobileHeader onMenuClick={toggleMobileMenu} />
          {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
        </>
      ) : (
        <Header />
      )}
      <main className="flex-1 mb-48">
        {/* Hero Section */}
        <div className="relative w-full h-[477px] md:h-[806px]">
          <Image
            src="/images/About.png"
            alt="Beyond Running Team"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32">
              <Image
                src="/icons/Blogo.svg"
                alt="Beyond Running Logo"
                width={128}
                height={128}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="container text-center mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-7xl font-bold font-avant-garde tracking-tight">BEYOND : RUNNING</h1>
        </div>

        {/* Brand Story */}
        <div className="container mx-auto px-4 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Motion Image */}
            <div className="relative h-[464px] md:h-[851px]">
              <Image src="/images/about_1.png" alt="Runners in motion" fill />
            </div>

            {/* Brand Story Text */}
            <div className="space-y-8 text-2xl font-bold x-24">
              <p className="text-sm md:text-base font-avant-garde">
                The spark that ignited our journey was to place Indonesia at the forefront of the global running
                culture, not as followers, but as trailblazers. We gathered inspiration and fuel for our innovative
                process from the center of the equator line, suiting the extreme running conditions. Thus, we created
                Beyond Running with the help and support by the local running communities.
              </p>

              <p className="text-sm md:text-base font-avant-garde">
                Beyond Running is a running apparel brand based in Jakarta. Initiated by four like-minded people who see
                running in a wider range. Through this brand, they want to capture moments, feelings, and experiences
                when it comes to running. Each collection is built from a collective response of the community under the
                brand, designed to seamlessly fit in a runners wardrobe and tested to suit all running purposes.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

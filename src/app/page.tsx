"use client"

import { useState } from "react"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import HeroSlider from "@/components/home/hero-slider"
import PromoCards from "@/components/home/promo-cards"
import FeaturedProducts from "@/components/home/featured-products"
import BottomBanner from "@/components/home/bottom-banner"
import IntroSection from "@/components/intro-section"
import useMobile from "@/hooks/use-mobile"
import MobileHeader from "@/components/mobile-header"
import MobileMenu from "@/components/mobile-menu"

export default function HomePage() {
  const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Intro Section with GIF that can be scrolled past */}
      <IntroSection />

      {/* Main Content */}
      <div className="flex flex-col">
        {isMobile ? (
          <>
            <MobileHeader onMenuClick={toggleMobileMenu} />
            {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
          </>
        ) : (
          <Header />
        )}
        <main>
          <HeroSlider />
          <div className="container mx-auto px-4">
            <PromoCards />
            <FeaturedProducts />
          </div>
          <BottomBanner />
        </main>
        <Footer />
      </div>

      <style jsx global>{`
        body {
          overflow-x: hidden;
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}

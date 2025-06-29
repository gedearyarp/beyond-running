"use client"

import { useState, useEffect } from "react"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import HeroSlider from "@/components/home/hero-slider"
import PromoCards from "@/components/home/promo-cards"
import FeaturedProducts from "@/components/home/featured-products"
import BottomBanner from "@/components/home/bottom-banner"
import IntroSection from "@/components/intro-section"
import NewsletterModal from "@/components/ui/newsletter-modal"
import { Collection } from "@/lib/shopify/types"

interface HomePageClientProps {
  collections: Collection[]
}

export default function HomePageClient({ collections }: HomePageClientProps) {
  const [showNewsletterModal, setShowNewsletterModal] = useState(false)
  const [hasModalBeenShown, setHasModalBeenShown] = useState(false)
  const [introRemoved, setIntroRemoved] = useState(false)

  // Handle scroll untuk newsletter modal
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const scrollThreshold = window.innerHeight * 1.5

      if (scrollTop > scrollThreshold && !hasModalBeenShown) {
        setShowNewsletterModal(true)
        setHasModalBeenShown(true)
      }
    }

    // Check if user has dismissed the modal in the last 7 days
    const lastDismissed = localStorage.getItem("newsletterModalDismissed")
    const showModal = !lastDismissed || new Date().getTime() - Number.parseInt(lastDismissed) > 7 * 24 * 60 * 60 * 1000

    if (showModal) {
      window.addEventListener("scroll", handleScroll, { passive: true })
    } else {
      setHasModalBeenShown(true)
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [hasModalBeenShown])

  const handleCloseModal = () => {
    setShowNewsletterModal(false)
    localStorage.setItem("newsletterModalDismissed", new Date().getTime().toString())
  }

  const handleIntroRemoved = () => {
    setIntroRemoved(true)
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Intro Section - full screen tanpa header */}
      <IntroSection onRemoved={handleIntroRemoved} />

      {/* Header Component - hanya muncul setelah intro hilang */}
      {introRemoved && <Header collections={collections} />}

      {/* Main Content */}
      <div className={`flex flex-col transition-all duration-500 ease-in-out ${introRemoved ? 'pt-[88px]' : 'pt-0'}`}>
        <HeroSlider />
        <div className="container mx-auto px-4">
          <PromoCards />
          <FeaturedProducts />
        </div>
        <BottomBanner />
        <Footer />
      </div>

      {/* Newsletter Modal */}
      <NewsletterModal isOpen={showNewsletterModal} onClose={handleCloseModal} />

      <style jsx global>{`
        body {
          overflow-x: hidden;
          scroll-behavior: smooth;
        }
        
        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
    </div>
  )
}

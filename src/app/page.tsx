import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import HeroSlider from "@/components/home/hero-slider"
import PromoCards from "@/components/home/promo-cards"
import FeaturedProducts from "@/components/home/featured-products"
import BottomBanner from "@/components/home/bottom-banner"
import IntroSection from "@/components/intro-section"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Intro Section with GIF that can be scrolled past */}
      <IntroSection />

      {/* Main Content */}
      <div className="relative">
        <Header />
        <main>
          <HeroSlider />
          <div className="container mx-auto px-4">
            <PromoCards />
            <FeaturedProducts />
            <BottomBanner />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

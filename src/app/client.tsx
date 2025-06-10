'use client';

import { useState, useEffect } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import HeroSlider from "@/components/home/hero-slider";
import PromoCards from "@/components/home/promo-cards";
import FeaturedProducts from "@/components/home/featured-products";
import BottomBanner from "@/components/home/bottom-banner";
import IntroSection from "@/components/intro-section";
import NewsletterModal from "@/components/ui/newsletter-modal";
import useMobile from "@/hooks/use-mobile";
import MobileHeader from "@/components/mobile-header";
import MobileMenu from "@/components/mobile-menu";
import { Collection } from "@/lib/shopify/types";

interface HomePageClientProps {
  collections: Collection[];
}

export default function HomePageClient({ collections }: HomePageClientProps) {
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [hasModalBeenShown, setHasModalBeenShown] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle scroll to show newsletter modal
  useEffect(() => {
    const handleScroll = () => {
      // Show modal when user has scrolled 40% of the page height
      // and the modal hasn't been shown yet in this session
      const scrollThreshold = window.innerHeight * 1.5;

      if (window.scrollY > scrollThreshold && !hasModalBeenShown) {
        setShowNewsletterModal(true);
        setHasModalBeenShown(true);
      }
    };

    // Check if user has dismissed the modal in the last 7 days
    const lastDismissed = localStorage.getItem("newsletterModalDismissed");
    const showModal = !lastDismissed || new Date().getTime() - Number.parseInt(lastDismissed) > 7 * 24 * 60 * 60 * 1000;

    if (showModal) {
      window.addEventListener("scroll", handleScroll);
    } else {
      setHasModalBeenShown(true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasModalBeenShown]);

  const handleCloseModal = () => {
    setShowNewsletterModal(false);
    // Save dismissal timestamp to localStorage
    localStorage.setItem("newsletterModalDismissed", new Date().getTime().toString());
  };

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
          <Header collections={collections} />
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

      {/* Newsletter Modal */}
      <NewsletterModal isOpen={showNewsletterModal} onClose={handleCloseModal} />

      <style jsx global>{`
        body {
          overflow-x: hidden;
          scroll-behavior: smooth;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 
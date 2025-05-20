"use client"

import { useState } from "react"
import useMobile from "@/hooks/use-mobile"
import Header from "@/components/ui/Header"
import MobileHeader from "@/components/mobile-header"
import LoginForm from "@/components/ui/LoginForm"
import Footer from "@/components/ui/Footer"
import MobileMenu from "@/components/mobile-menu"

export default function LoginPage() {
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
      <main className="flex items-start justify-center py-16 md:h-screen">
        <LoginForm />
      </main>
      {!isMobile && <Footer />}
    </div>
  )
}

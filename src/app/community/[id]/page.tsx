"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import useMobile from "@/hooks/use-mobile"
import MobileHeader from "@/components/mobile-header"
import MobileMenu from "@/components/mobile-menu"
import RichTextViewer from "@/components/ui/RichTextViewer"
import { supabase } from "@/lib/supabase"
import type { Community } from "@/app/community/page"

export default function CommunityDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [event, setEvent] = useState<Community | null>(null)
  const [loading, setLoading] = useState(true)
  const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('communities')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        setEvent(data)
      } catch (error) {
        console.error('Error fetching event:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Validate and format image URL
  const getValidImageUrl = (url: string | null, fallback: string = "/images/per_1.png") => {
    return url && url.trim() !== "" ? url : fallback
  }

  if (loading) {
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
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <p className="text-center">Loading event details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!event) {
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
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <p className="text-center">Event not found</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const bannerImageUrl = getValidImageUrl(event.banner_img, "/images/com_banner.png")
  const communityImageUrl = getValidImageUrl(event.community_img, "/images/per_1.png")

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
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="relative w-full h-[477px] md:h-[608px]">
          <Image 
            src={bannerImageUrl}
            alt={event.title} 
            fill 
            className="object-cover" 
            priority 
            unoptimized={bannerImageUrl.includes('supabase.co')}
          />
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-40">
            {/* Left Column - Event Image */}
            <div>
              {isMobile && (
                <h1 className="text-2xl md:text-4xl font-bold font-avant-garde mb-8">{event.title}</h1>
              )}
              <div className="relative h-[481px] md:h-[900px] w-full">
                <Image 
                  src={communityImageUrl}
                  alt={event.title} 
                  fill 
                  className="object-cover" 
                  unoptimized={communityImageUrl.includes('supabase.co')}
                />
              </div>
            </div>

            <div>
              {!isMobile && (
                <h1 className="text-3xl md:text-4xl font-bold font-avant-garde mb-8">{event.title}</h1>
              )}

              <div className="mb-8 text-center md:text-left">
                <RichTextViewer 
                  content={event.time_place} 
                  className="text-sm font-avant-garde mb-1"
                />
              </div>

              <div className="mb-8">
                <RichTextViewer 
                  content={event.event_overview} 
                  className="text-sm font-avant-garde mb-8 leading-relaxed"
                />
              </div>

              <div className="mb-8">
                <RichTextViewer 
                  content={event.event_tnc} 
                  className="text-sm font-avant-garde mb-8 leading-relaxed"
                />
              </div>

              {event.signup_link && (
                <a
                  href={event.signup_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-black text-white py-4 font-avant-garde hover:bg-gray-900 transition-colors mb-6 text-center"
                >
                  SIGN UP
                </a>
              )}

              {(event.full_rundown_url || event.documentation_url) && (
                <div className="flex border-t border-gray-200 pt-4 space-x-6">
                  {event.full_rundown_url && (
                    <a
                      href={event.full_rundown_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-avant-garde font-bold hover:underline"
                    >
                      Full Rundown
                    </a>
                  )}
                  {event.documentation_url && (
                    <a
                      href={event.documentation_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-avant-garde font-bold hover:underline"
                    >
                      Documentation
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

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
import type { Peripherals } from "@/app/peripherals/page"

export default function PeripheralsDetailPage() {
  const params = useParams()
  const id = params.slug as string
  const [peripheral, setPeripheral] = useState<Peripherals | null>(null)
  const [loading, setLoading] = useState(true)
  const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchPeripheral = async () => {
      try {
        const { data, error } = await supabase
          .from('peripherals')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        setPeripheral(data)
      } catch (error) {
        console.error('Error fetching peripheral:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPeripheral()
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
            <p className="text-center">Loading story...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!peripheral) {
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
            <p className="text-center">Story not found</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Format date
  const formattedDate = peripheral.event_date 
    ? new Date(peripheral.event_date).toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      })
    : '';

  // Get image URLs
  const bannerImageUrl = getValidImageUrl(peripheral.banner_img, "/images/per_detail_1.png")
  const leftImageUrl = getValidImageUrl(peripheral.left_img, "/images/per_1.png")
  const rightImageUrl = getValidImageUrl(peripheral.right_img, "/images/per_1.png")

  // Determine background color
  const bgColor = peripheral.background_color === 'black' ? 'bg-black text-white' : 'bg-white text-black'

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
      <main className={`flex-1 ${bgColor} pb-42`}>
        <div className="relative w-full h-[477px] md:h-[705px]">
          <Image 
            src={bannerImageUrl} 
            alt={peripheral.title || 'Story banner'} 
            fill 
            className="object-cover" 
            priority 
            unoptimized={bannerImageUrl.includes('supabase.co')}
          />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-16 flex flex-col gap-0 md:gap-36">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h1 className="text-[21px] md:text-5xl font-bold font-avant-garde mb-6">{peripheral.title}</h1>
              <p className="text-xs md:text-sm font-avant-garde mb-6">{formattedDate}</p>
              {peripheral.credits && (
                <RichTextViewer 
                  content={peripheral.credits} 
                  className="font-bold text-sm font-avant-garde"
                />
              )}
            </div>
            <div>
              {peripheral.event_overview && (
                <div className="text-[12px] md:text-base font-avant-garde leading-relaxed space-y-6">
                  <RichTextViewer content={peripheral.event_overview} />
                </div>
              )}
            </div>
          </div>
          
          {peripheral.highlight_quote && (
            <div className="my-28 md:my-36 max-w-4xl mx-auto text-center">
              <h2 className="text-[20px] md:text-4xl font-bold font-avant-garde leading-tight">
                <RichTextViewer content={peripheral.highlight_quote} />
              </h2>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
            {peripheral.paragraph_1 && (
              <div className="text-[12px] md:text-base font-avant-garde leading-relaxed">
                <RichTextViewer content={peripheral.paragraph_1} />
              </div>
            )}
            {peripheral.paragraph_2 && (
              <div className="text-[12px] md:text-base font-avant-garde leading-relaxed">
                <RichTextViewer content={peripheral.paragraph_2} />
              </div>
            )}
          </div>
        </div>

        {/* Images Section */}
        {(peripheral.left_img || peripheral.right_img) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 px-4 max-w-screen-xl mx-auto">
            {peripheral.left_img && (
              <div className="relative">
                <Image
                  src={leftImageUrl}
                  alt="Story image"
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto"
                  style={{
                    maxHeight: "600px",
                    objectFit: "contain",
                  }}
                  unoptimized={leftImageUrl.includes('supabase.co')}
                />
              </div>
            )}
            {peripheral.right_img && (
              <div className="relative">
                <Image
                  src={rightImageUrl}
                  alt="Story image"
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto"
                  style={{
                    maxHeight: "600px",
                    objectFit: "contain",
                  }}
                  unoptimized={rightImageUrl.includes('supabase.co')}
                />
              </div>
            )}
          </div>
        )}

        {peripheral.paragraph_bottom && (
          <div className="max-w-3xl px-4 md:px-0 md:ml-34 md:mb-24">
            <div className="text-[12px] md:text-base font-avant-garde leading-relaxed">
              <RichTextViewer content={peripheral.paragraph_bottom} />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

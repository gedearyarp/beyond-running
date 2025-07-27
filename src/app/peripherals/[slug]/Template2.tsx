import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import Loading from "@/components/ui/loading"
import RichTextViewer from "@/components/ui/RichTextViewer"
import { images } from "@/assets/images"
import type { PeripheralWithImages } from "./page"

interface Template2Props {
  peripheral: PeripheralWithImages | null
  loading: boolean
  isInitialLoading: boolean
  getValidImageUrl: (url: string | null, fallback?: string) => string
}

export default function Template2({ peripheral, loading, isInitialLoading, getValidImageUrl }: Template2Props) {
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading text="Loading story..." />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-[56px] md:pt-[73px]">
          <div className="container mx-auto px-4 py-12">
            <Loading text="Loading story..." />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!peripheral) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-[56px] md:pt-[73px]">
          <div className="container mx-auto px-4 py-12">
            <p className="text-center text-lg">Story not found</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Format date
  const formattedDate = peripheral.event_date
    ? new Date(peripheral.event_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  // Get banner image URL
  const bannerImageUrl = getValidImageUrl(peripheral.banner_img, images.peripheralImage)

  // Determine background color
  const bgColor = peripheral.background_color === "black" ? "bg-black text-white" : "bg-white text-black"

  // Get featured images (first two)
  const featuredImages = peripheral.featured_images || []

  // Get full width image
  const fullWidthImage = peripheral.full_width_image

  // Get dynamic sections
  const dynamicSections = peripheral.sections || []

  // Helper function to check if content is truly empty (including empty HTML tags)
  const isContentEmpty = (content: string | null | undefined): boolean => {
    if (!content) return true;
    // Remove HTML tags and check if there's actual text content
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    return textContent === '';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 pt-[56px] md:pt-[73px] ${bgColor} pb-16 md:pb-42`}>
        {/* Hero Banner */}
        <section className="relative w-full h-[60vh] md:h-[705px]">
          <img
            src={bannerImageUrl || "/placeholder.svg"}
            alt={peripheral.title || "Story banner"}
            className="object-cover w-full h-full absolute inset-0"
            style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
            loading="eager"
          />
        </section>

        {/* Title and Overview Section */}
        {(peripheral.title || formattedDate || peripheral.credits || peripheral.event_overview) && (
          <section className="container mx-auto px-4 py-16 md:py-16 flex flex-col gap-0 md:gap-36">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {(peripheral.title || formattedDate || peripheral.credits) && (
                <div>
                  {peripheral.title && (
                    <h1 className="text-[21px] md:text-5xl font-itc-demi mb-6">
                      {peripheral.title}
                    </h1>
                  )}
                  {formattedDate && (
                    <p className="text-xs md:text-sm font-folio-bold mb-6">
                      {formattedDate}
                    </p>
                  )}
                  {peripheral.credits && !isContentEmpty(peripheral.credits) && (
                    <RichTextViewer 
                        content={peripheral.credits} 
                        className="text-sm font-folio-bold" 
                    />
                  )}
                </div>
              )}
              {peripheral.event_overview && !isContentEmpty(peripheral.event_overview) && (
                <div>
                  <RichTextViewer
                      content={peripheral.event_overview}
                      className="text-[12px] md:text-sm font-folio-light leading-relaxed space-y-6"
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Featured Images Section */}
        {featuredImages.length > 0 && (
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 max-w-6xl mx-auto">
                {featuredImages.slice(0, 2).map((img, idx) => (
                  <div key={img} className="relative w-full max-w-sm md:max-w-md lg:max-w-lg aspect-[3/4] flex-shrink-0">
                    <img
                      src={getValidImageUrl(img, "/placeholder.svg")}
                      alt={`Featured story image ${idx + 1}`}
                      className="object-cover shadow-lg w-full h-full absolute inset-0"
                      style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Full Width Banner */}
        {fullWidthImage && (
          <section className="relative w-full my-8 md:my-16 h-[50vh] md:h-[70vh] lg:h-[880px]">
            <img
              src={getValidImageUrl(fullWidthImage, "/placeholder.svg")}
              alt="Full width banner"
              className="object-cover w-full h-full absolute inset-0"
              style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
              loading="eager"
            />
          </section>
        )}

        {/* Content Sections (dynamic) */}
        {dynamicSections.length > 0 && (
          <div className="space-y-16 md:space-y-36 py-16 md:pt-36">
            {dynamicSections.map((section, idx) => (
              <section key={idx} className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center max-w-7xl mx-auto">
                                  <div className="space-y-4 lg:pr-8">
                  {!isContentEmpty(section.text) && (
                    <RichTextViewer content={section.text} className="text-sm md:text-[16px] font-folio-light" />
                  )}
                </div>
                  {section.image && (
                    <div className="flex justify-center lg:justify-end">
                      <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl aspect-[4/3] md:aspect-[3/2]">
                        <img
                          src={getValidImageUrl(section.image, "/placeholder.svg")}
                          alt="Section image"
                          className="object-cover shadow-md w-full h-full absolute inset-0"
                          style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

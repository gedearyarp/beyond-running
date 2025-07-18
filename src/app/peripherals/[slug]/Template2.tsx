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
        <section className="container mx-auto px-4 py-16 md:py-16 flex flex-col gap-0 md:gap-36">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h1 className="text-[21px] md:text-5xl font-itc-demi mb-6">
                {peripheral.title}
              </h1>
              <p className="text-xs md:text-sm font-folio-bold mb-6">
                {formattedDate}
              </p>
              {peripheral.credits && (
                <RichTextViewer 
                    content={peripheral.credits} 
                    className="text-sm font-folio-bold" 
                />
              )}
            </div>
            <div>
              {peripheral.event_overview && (
                <RichTextViewer
                    content={peripheral.event_overview}
                    className="text-[12px] md:text-sm font-folio-light leading-relaxed space-y-6"
                />
              )}
            </div>
          </div>
        </section>

        {/* Featured Images Section */}
        {peripheral.highlight_quote && (
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 max-w-6xl mx-auto">
                <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg aspect-[3/4] flex-shrink-0">
                  <img
                    src={images.featured1Image || "/placeholder.svg"}
                    alt="Featured story image 1"
                    className="object-cover shadow-lg w-full h-full absolute inset-0"
                    style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                  />
                </div>
                <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg aspect-[3/4] flex-shrink-0">
                  <img
                    src={images.featured2Image || "/placeholder.svg"}
                    alt="Featured story image 2"
                    className="object-cover shadow-lg w-full h-full absolute inset-0"
                    style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Full Width Banner */}
        <section className="relative w-full my-8 md:my-16 h-[50vh] md:h-[70vh] lg:h-[880px]">
          <img
            src={images.featured3Image || "/placeholder.svg"}
            alt="Full width banner"
            className="object-cover w-full h-full absolute inset-0"
            style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
            loading="eager"
          />
        </section>

        {/* Content Sections */}
        <div className="space-y-16 md:space-y-36 py-16 md:pt-36">
          {/* Section 1: Text left, image right */}
          <section className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-end max-w-7xl mx-auto">
              <div className="flex flex-col space-y-4 lg:pr-8">
                <h3 className="text-sm md:text-[16px] font-folio-bold">Join The Motion</h3>
                <p className="text-[12px] md:text-[16px] font-folio-light leading-relaxed">
                  And hey, if you don't snag one of the exclusive 5 spots, no worries at all! Coach Johnny will still be
                  dishing out valuable training insights all spring every week through our newsletter. We're totally
                  committed to boosting your running journey by offering ongoing education through Q&As, ally
                  newsletter, upcoming spotlights, and a special content series. So, stay tuned for more awesome ways to
                  train with Coach Johnny and hit those running dreams!
                </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg aspect-[4/5] md:aspect-[3/4]">
                  <img
                    src={images.featured2Image || "/placeholder.svg"}
                    alt="Join the motion - training session"
                    className="object-cover shadow-md w-full h-full absolute inset-0"
                    style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Full width image */}
          <section className="container mx-auto px-4">
            <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[620px] max-w-7xl mx-auto">
              <img
                src={images.featured1Image || "/placeholder.svg"}
                alt="Training in action"
                className="object-cover shadow-md w-full h-full absolute inset-0"
                style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
              />
            </div>
          </section>

          {/* Section 3: Text left, image right */}
          <section className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center max-w-7xl mx-auto">
              <div className="space-y-4 lg:pr-8">
                <h3 className="text-sm md:text-lg font-folio-bold">Join The Motion</h3>
                <div className="space-y-4">
                  <p className="text-[12px] md:text-[16px] font-folio-light leading-relaxed text-opacity-90">
                    And hey, if you don't snag one of the exclusive 5 spots, no worries at all! Coach Johnny will still
                    be dishing out valuable training insights and tips every week through our newsletter.
                  </p>
                  <p className="text-[12px] md:text-[16px] font-folio-light leading-relaxed text-opacity-90">
                    We're totally committed to boosting your running journey by sharing ongoing education through our
                    newsletter, upcoming podcasts, and a special content series. So, stay tuned for more awesome ways to
                    train with Coach Johnny and hit those running dreams!
                  </p>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl aspect-[4/3] md:aspect-[3/2]">
                  <img
                    src={images.featured3Image || "/placeholder.svg"}
                    alt="Training community"
                    className="object-cover shadow-md w-full h-full absolute inset-0"
                    style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

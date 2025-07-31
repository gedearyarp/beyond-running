import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Loading from "@/components/ui/loading";
import RichTextViewer from "@/components/ui/RichTextViewer";
import { images } from "@/assets/images";
import type { PeripheralWithImages } from "./page";

interface Template3Props {
    peripheral: PeripheralWithImages | null;
    loading: boolean;
    isInitialLoading: boolean;
    getValidImageUrl: (url: string | null, fallback?: string) => string;
}

export default function Template3({ peripheral, loading, isInitialLoading, getValidImageUrl }: Template3Props) {
    if (isInitialLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading text="Loading story..." />
            </div>
        );
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
        );
    }

    if (!peripheral) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 pt-[56px] md:pt-[73px]">
                    <div className="container mx-auto px-4 py-12">
                        <p className="text-center">Story not found</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Format date
    const formattedDate = peripheral.event_date
        ? new Date(peripheral.event_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "";

    // Get banner image URL
    const bannerImageUrl = getValidImageUrl(peripheral.banner_img, images.peripheralImage);

    // Determine background color
    const bgColor =
        peripheral.background_color === "black" ? "bg-black text-white" : "bg-white text-black";

    // Get gallery images
    const galleryImages = peripheral.gallery_images || [];

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
            <main className={`flex-1 pt-[56px] md:pt-[73px] ${bgColor} pb-16 md:pb-24`}>
                <div className="relative w-full h-[477px] md:h-[705px]">
                    <img
                        src={bannerImageUrl}
                        alt={peripheral.title || "Story banner"}
                        className="object-cover w-full h-full absolute inset-0"
                        style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                        loading="eager"
                    />
                </div>

                {(peripheral.title || formattedDate || peripheral.credits || peripheral.event_overview) && (
                    <div className="container mx-auto px-4 py-16 md:py-16 flex flex-col gap-0 md:gap-36">
                        <div className="md:w-1/2 flex flex-col gap-16">
                            {(peripheral.title || formattedDate || peripheral.credits) && (
                                <div>
                                    <h1 className="text-[21px] md:text-5xl font-itc-bold mb-6">
                                        BEYOND:RUNNING
                                    </h1>
                                    {peripheral.title && (
                                        <RichTextViewer
                                            content={peripheral.title}
                                            className="text-[21px] md:text-5xl font-itc-demi mb-6"
                                        />
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
                                    <div className="text-[12px] md:text-sm font-folio-light leading-relaxed space-y-6">
                                        <RichTextViewer content={peripheral.event_overview} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Gallery Section (dynamic, but with previous layout) */}
                {galleryImages.length > 0 && (
                  <section className="container mx-auto px-2 sm:px-4 py-8 md:py-16 flex flex-col gap-8 md:gap-12">
                    {/* Row 1: 2 images (tall) */}
                    {galleryImages.length >= 2 && (
                      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 mb-2">
                        <div className="relative w-full h-[180px] md:h-[858px]">
                          <img
                            src={getValidImageUrl(galleryImages[0], "/placeholder.svg")}
                            alt="Gallery 1"
                            className="object-cover shadow w-full h-full absolute inset-0"
                            style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                          />
                        </div>
                        <div className="relative w-full h-[180px] md:h-[724px]">
                          <img
                            src={getValidImageUrl(galleryImages[1], "/placeholder.svg")}
                            alt="Gallery 2"
                            className="object-cover shadow w-full h-full absolute inset-0"
                            style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                          />
                        </div>
                      </div>
                    )}
                    {/* Row 2: 1 landscape image (wide) */}
                    {galleryImages.length >= 3 && (
                      <div className="w-full flex flex-col items-center mb-2">
                        <div className="relative w-full h-[180px] md:h-[690px]">
                          <img
                            src={getValidImageUrl(galleryImages[2], "/placeholder.svg")}
                            alt="Gallery 3"
                            className="object-cover shadow w-full h-full absolute inset-0"
                            style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                          />
                        </div>
                      </div>
                    )}
                    {/* Row 3: 2 images (one wide, one tall) */}
                    {galleryImages.length >= 5 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-2">
                        <div className="relative w-full h-[180px] md:col-span-2 md:h-[512px]">
                          <img
                            src={getValidImageUrl(galleryImages[3], "/placeholder.svg")}
                            alt="Gallery 4"
                            className="object-cover shadow w-full h-full absolute inset-0"
                            style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                          />
                        </div>
                        <div className="relative w-full h-[180px] md:h-[399px]">
                          <img
                            src={getValidImageUrl(galleryImages[4], "/placeholder.svg")}
                            alt="Gallery 5"
                            className="object-cover shadow w-full h-full absolute inset-0"
                            style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                          />
                        </div>
                      </div>
                    )}
                    {/* Row 4: 3 small images (2 per row in mobile) */}
                    {galleryImages.length >= 8 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        <div className="relative w-full h-[180px] md:h-[480px] mb-4 md:mb-0">
                          <img
                            src={getValidImageUrl(galleryImages[5], "/placeholder.svg")}
                            alt="Gallery 6"
                            className="object-cover shadow w-full h-full absolute inset-0"
                            style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                          />
                        </div>
                        <div className="relative w-full h-[180px] md:h-[480px] mb-4 md:mb-0">
                          <img
                            src={getValidImageUrl(galleryImages[6], "/placeholder.svg")}
                            alt="Gallery 7"
                            className="object-cover shadow w-full h-full absolute inset-0"
                            style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                          />
                        </div>
                        <div className="relative w-full h-[180px] md:h-[480px] col-span-2 md:col-span-1">
                          <img
                            src={getValidImageUrl(galleryImages[7], "/placeholder.svg")}
                            alt="Gallery 8"
                            className="object-cover shadow w-full h-full absolute inset-0"
                            style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                          />
                        </div>
                      </div>
                    )}
                  </section>
                )}
            </main>
            <Footer />
        </div>
    );
} 
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Loading from "@/components/ui/loading";
import RichTextViewer from "@/components/ui/RichTextViewer";
import { images } from "@/assets/images";
import type { PeripheralWithImages } from "./page";

interface Template1Props {
    peripheral: PeripheralWithImages | null;
    loading: boolean;
    isInitialLoading: boolean;
    getValidImageUrl: (url: string | null, fallback?: string) => string;
}

export default function Template1({ peripheral, loading, isInitialLoading, getValidImageUrl }: Template1Props) {
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
            <main className={`flex-1 pt-[56px] md:pt-[73px] ${bgColor} pb-42`}>
                <div className="relative w-full h-[477px] md:h-[705px]">
                    <img
                        src={bannerImageUrl}
                        alt={peripheral.title || "Story banner"}
                        className="object-cover w-full h-full absolute inset-0"
                        style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                        loading="eager"
                    />
                </div>

                {(peripheral.title || formattedDate || peripheral.credits || peripheral.event_overview || peripheral.highlight_quote || peripheral.paragraph_1 || peripheral.paragraph_2) && (
                    <div className="container mx-auto px-4 py-16 md:py-16 flex flex-col gap-0 md:gap-36">
                        {(peripheral.title || formattedDate || peripheral.credits || peripheral.event_overview) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                {(peripheral.title || formattedDate || peripheral.credits) && (
                                    <div>
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
                        )}

                        {peripheral.highlight_quote && !isContentEmpty(peripheral.highlight_quote) && (
                            <div className="my-28 md:my-36 max-w-4xl mx-auto text-center">
                                <h2 className="text-[20px] md:text-4xl font-itc-demi leading-tight">
                                    <RichTextViewer content={peripheral.highlight_quote} />
                                </h2>
                            </div>
                        )}

                        {(peripheral.paragraph_1 || peripheral.paragraph_2) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-16 gap-7 mb-24">
                                {peripheral.paragraph_1 && !isContentEmpty(peripheral.paragraph_1) && (
                                    <div className="text-[12px] md:text-sm font-folio-light leading-relaxed">
                                        <RichTextViewer content={peripheral.paragraph_1} />
                                    </div>
                                )}
                                {peripheral.paragraph_2 && !isContentEmpty(peripheral.paragraph_2) && (
                                    <div className="text-[12px] md:text-sm font-folio-light leading-relaxed">
                                        <RichTextViewer content={peripheral.paragraph_2} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Images Section - Adapted from old code */}
                {peripheral.images.length > 0 &&
                    (peripheral.images.length < 2 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 px-4 max-w-screen-xl mx-auto">
                            {peripheral.images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image.src || "/placeholder.svg"}
                                        alt={image.alt}
                                        className="w-full h-auto"
                                        style={{maxHeight: "600px", objectFit: "contain"}}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full mb-24 flex flex-row overflow-x-auto hide-scrollbar">
                            <div className="flex space-x-6">
                                {peripheral.images.map((image, index) => (
                                    <div key={index} className="flex items-center justify-center">
                                        <img
                                            src={image.src || "/placeholder.svg"}
                                            alt={image.alt}
                                            className="min-w-[380px] min-h-[450px] md:min-w-[880px] md:min-h-[900px] object-contain"
                                            style={{objectFit: "contain"}}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                {peripheral.paragraph_bottom && !isContentEmpty(peripheral.paragraph_bottom) && (
                    <div className="max-w-3xl px-4 md:px-0 md:ml-34 md:mb-24">
                        <div className="text-[12px] md:text-sm font-folio-light leading-relaxed">
                            <RichTextViewer content={peripheral.paragraph_bottom} />
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
} 
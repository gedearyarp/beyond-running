"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Loading from "@/components/ui/loading";
import RichTextViewer from "@/components/ui/RichTextViewer";
import { supabase } from "@/lib/supabase";
import type { Peripherals } from "@/app/peripherals/page";
import { images } from "@/assets/images";

// Extended type to include images array
interface PeripheralWithImages extends Peripherals {
    images: Array<{
        src: string;
        alt: string;
    }>;
}

export default function PeripheralsDetailPage() {
    const params = useParams();
    const id = params.slug as string;
    const [peripheral, setPeripheral] = useState<PeripheralWithImages | null>(null);
    const [loading, setLoading] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {

    }, []);

    useEffect(() => {
        const fetchPeripheral = async () => {
            try {
                const { data, error } = await supabase
                    .from("peripherals")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) throw error;

                // Create images array from existing image fields
                const images = [];
                if (data.left_img) {
                    images.push({
                        src: data.left_img,
                        alt: `${data.title} - Left image`,
                    });
                }
                if (data.right_img) {
                    images.push({
                        src: data.right_img,
                        alt: `${data.title} - Right image`,
                    });
                }

                setPeripheral({
                    ...data,
                    images,
                });
            } catch (error) {
                console.error("Error fetching peripheral:", error);
            } finally {
                setLoading(false);
                setIsInitialLoading(false);
            }
        };

        fetchPeripheral();
    }, [id]);

    // Validate and format image URL
    const getValidImageUrl = (url: string | null, fallback: string = images.peripheralImage) => {
        return url && url.trim() !== "" ? url : fallback;
    };

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
                <main className="flex-1 pt-[73px]">
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
                <main className="flex-1 pt-[73px]">
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

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className={`flex-1 pt-[73px] ${bgColor} pb-42`}>
                <div className="relative w-full h-[477px] md:h-[705px]">
                    <Image
                        src={bannerImageUrl}
                        alt={peripheral.title || "Story banner"}
                        fill
                        className="object-cover"
                        priority
                        unoptimized={bannerImageUrl.includes("supabase.co")}
                    />
                </div>

                <div className="container mx-auto px-4 py-16 md:py-16 flex flex-col gap-0 md:gap-36">
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
                                <div className="text-[12px] md:text-sm font-folio-light leading-relaxed space-y-6">
                                    <RichTextViewer content={peripheral.event_overview} />
                                </div>
                            )}
                        </div>
                    </div>

                    {peripheral.highlight_quote && (
                        <div className="my-28 md:my-36 max-w-4xl mx-auto text-center">
                            <h2 className="text-[20px] md:text-4xl font-itc-demi leading-tight">
                                <RichTextViewer content={peripheral.highlight_quote} />
                            </h2>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
                        {peripheral.paragraph_1 && (
                            <div className="text-[12px] md:text-sm font-folio-light leading-relaxed">
                                <RichTextViewer content={peripheral.paragraph_1} />
                            </div>
                        )}
                        {peripheral.paragraph_2 && (
                            <div className="text-[12px] md:text-sm font-folio-light leading-relaxed">
                                <RichTextViewer content={peripheral.paragraph_2} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Images Section - Adapted from old code */}
                {peripheral.images.length > 0 &&
                    (peripheral.images.length < 2 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 px-4 max-w-screen-xl mx-auto">
                            {peripheral.images.map((image, index) => (
                                <div key={index} className="relative">
                                    <Image
                                        src={image.src || "/placeholder.svg"}
                                        alt={image.alt}
                                        width={0}
                                        height={0}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="w-full h-auto"
                                        style={{
                                            maxHeight: "600px",
                                            objectFit: "contain",
                                        }}
                                        unoptimized={image.src.includes("supabase.co")}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full mb-24 flex flex-row overflow-x-auto hide-scrollbar">
                            <div className="flex space-x-6">
                                {peripheral.images.map((image, index) => (
                                    <div key={index} className="flex items-center justify-center">
                                        <Image
                                            src={image.src || "/placeholder.svg"}
                                            alt={image.alt}
                                            width={0}
                                            height={0}
                                            sizes="500px"
                                            className="min-w-[380px] min-h-[450px] md:min-w-[880px] md:min-h-[900px] object-contain"
                                            unoptimized={image.src.includes("supabase.co")}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                {peripheral.paragraph_bottom && (
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

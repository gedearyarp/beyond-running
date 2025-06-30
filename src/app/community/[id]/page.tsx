"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Loading from "@/components/ui/loading";
import RichTextViewer from "@/components/ui/RichTextViewer";
import { supabase } from "@/lib/supabase";
import type { Community } from "@/app/community/page";
import { getAllCollections } from "@/lib/shopify";
import { Collection } from "@/lib/shopify/types";
import { images } from "@/assets/images";

export default function CommunityDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [event, setEvent] = useState<Community | null>(null);
    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const collectionsData = await getAllCollections();
                setCollections(collectionsData);
            } catch (error) {
                console.error("Failed to fetch collections:", error);
            }
        };

        fetchCollections();
    }, []);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data, error } = await supabase
                    .from("communities")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) throw error;

                setEvent(data);
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
                setIsInitialLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    // Validate and format image URL
    const getValidImageUrl = (url: string | null, fallback: string = images.peripheralImage) => {
        return url && url.trim() !== "" ? url : fallback;
    };

    if (isInitialLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading text="Loading event details..." />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header collections={collections} />
                <main className="flex-1 pt-[88px]">
                    <div className="container mx-auto px-4 py-12">
                        <Loading text="Loading event details..." />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header collections={collections} />
                <main className="flex-1 pt-[88px]">
                    <div className="container mx-auto px-4 py-12">
                        <p className="text-center">Event not found</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const bannerImageUrl = getValidImageUrl(event.banner_img, images.communityBanner);
    const communityImageUrl = getValidImageUrl(event.community_img, images.peripheralImage);

    return (
        <div className="flex flex-col min-h-screen">
            <Header collections={collections} />
            <main className="flex-1 pt-[88px]">
                {/* Hero Banner */}
                <div className="relative w-full h-[477px] md:h-[608px]">
                    <Image
                        src={bannerImageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                        unoptimized={bannerImageUrl.includes("supabase.co")}
                    />
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-40">
                        {/* Left Column - Event Image */}
                        <div>
                            <h1 className="text-2xl md:text-4xl font-itc-demi mb-8 md:hidden">
                                {event.title}
                            </h1>
                            <div className="relative h-[481px] md:h-[900px] w-full">
                                <Image
                                    src={communityImageUrl}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                    unoptimized={communityImageUrl.includes("supabase.co")}
                                />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-[42px] font-itc-demi mb-8 hidden md:block">
                                {event.title}
                            </h1>

                            <div className="mb-8 text-center md:text-left">
                                <RichTextViewer
                                    content={event.time_place}
                                    className="text-[16px] font-folio-bold mb-1"
                                />
                            </div>

                            <div className="mb-8">
                                <RichTextViewer
                                    content={event.event_overview}
                                    className="text-[16px] font-folio-medium mb-8 leading-relaxed"
                                />
                            </div>

                            <div className="mb-8">
                                <RichTextViewer
                                    content={event.event_tnc}
                                    className="text-[16px] font-folio-medium mb-8 leading-relaxed"
                                />
                            </div>

                            {event.signup_link && (
                                <a
                                    href={event.signup_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[24px] block w-full bg-black text-white py-4 font-itc-md hover:bg-gray-900 transition-colors mb-6 text-center"
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
                                            className="text-sm font-folio-medium hover:underline"
                                        >
                                            Full Rundown
                                        </a>
                                    )}
                                    {event.documentation_url && (
                                        <a
                                            href={event.documentation_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-folio-medium hover:underline"
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
    );
}

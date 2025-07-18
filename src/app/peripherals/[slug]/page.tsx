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
import Template1 from "./Template1";
import Template2 from "./Template2";
import Template3 from "./Template3";

// Extended type to include images array and template_type
export interface PeripheralWithImages extends Peripherals {
    images: Array<{
        src: string;
        alt: string;
    }>;
    template_type?: string;
    featured_images?: any[];
    sections?: any[];
    gallery_images?: any[];
    full_width_image?: string;
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
                console.log(data)

                // Parse JSONB fields if present
                let featured_images = [];
                let sections = [];
                let gallery_images = [];
                if (data.featured_images) {
                    featured_images = Array.isArray(data.featured_images) ? data.featured_images : JSON.parse(data.featured_images);
                }
                if (data.sections) {
                    sections = Array.isArray(data.sections) ? data.sections : JSON.parse(data.sections);
                }
                if (data.gallery_images) {
                    gallery_images = Array.isArray(data.gallery_images) ? data.gallery_images : JSON.parse(data.gallery_images);
                }

                // Create images array from existing image fields (for Template1)
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
                    featured_images,
                    sections,
                    gallery_images,
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

    // Determine which template to use
    let SelectedTemplate = Template1;
    if (peripheral.template_type === '2') SelectedTemplate = Template2;
    if (peripheral.template_type === '3') SelectedTemplate = Template3;

    return (
        <SelectedTemplate
            peripheral={peripheral}
            loading={loading}
            isInitialLoading={isInitialLoading}
            getValidImageUrl={getValidImageUrl}
        />
    );
}

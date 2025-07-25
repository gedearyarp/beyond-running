"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import RichTextViewer from "@/components/ui/RichTextViewer";

interface Slide {
    id: string;
    image: string;
    mobile_image?: string;
    title: string;
    description: string;
    url_link?: string;
    url_button_wording?: string;
}

export default function HeroSlider() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const fetchSlides = async () => {
            const { data, error } = await supabase
                .from("carousels")
                .select("id, pictures, mobile_image, title, subtitle, url_link, url_button_wording")
                .eq("is_active", true)
                .order("created_at", { ascending: true });
            if (error) {
                console.error("Failed to fetch carousels:", error);
                return;
            }
            const mappedSlides = (data || []).map((item) => ({
                id: item.id,
                image: item.pictures,
                mobile_image: item.mobile_image || null,
                title: item.title,
                description: item.subtitle || "",
                url_link: item.url_link || undefined,
                url_button_wording: item.url_button_wording || undefined,
            }));
            setSlides(mappedSlides);
        };
        fetchSlides();
    }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (slides.length === 0) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 10000);
        return () => clearInterval(interval);
    }, [slides]);

    // Swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.touches[0].clientX);
    };
    const handleTouchEnd = () => {
        if (touchStartX === null || touchEndX === null) return;
        const distance = touchStartX - touchEndX;
        if (Math.abs(distance) > 50) {
            if (distance > 0) {
                // Swipe left
                nextSlide();
            } else {
                // Swipe right
                prevSlide();
            }
        }
        setTouchStartX(null);
        setTouchEndX(null);
    };

    if (slides.length === 0) {
        return <div className="w-full h-[764px] md:h-[900px] flex items-center justify-center bg-gray-100">Loading...</div>;
    }

    return (
        <div
            className="relative w-full h-[764px] md:h-[900px] overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <div className="relative w-full h-full">
                        <img
                            src={isMobile ? (slide.mobile_image || slide.image || "/placeholder.svg") : (slide.image || "/placeholder.svg")}
                            alt={slide.title}
                            className="object-cover w-full h-full absolute inset-0"
                            style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                            loading={index === 0 ? "eager" : undefined}
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        {/* Title in center */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                            <div className="max-w-4xl px-8">
                                <RichTextViewer content={slide.title} className="text-4xl md:text-6xl font-bold font-avant-garde tracking-tight" />
                            </div>
                        </div>
                        {/* Description at bottom */}
                        <div className="absolute bottom-16 left-0 right-0 text-center text-white">
                            <p className="text-sm md:text-base max-w-3xl mx-auto px-8 font-avant-garde">
                                {slide.description}
                            </p>
                            {slide.url_link && (
                                <a
                                    href={slide.url_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-4 px-6 py-2 bg-white text-black rounded-full font-folio-bold text-sm hover:bg-gray-200 transition"
                                >
                                    {slide.url_button_wording?.trim() ? slide.url_button_wording : "more"}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {/* Navigation Controls Container */}
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center">
                {/* Left Arrow */}
                <button
                    onClick={prevSlide}
                    className="hidden md:block mx-4 p-2 rounded-full text-white hover:bg-black/50 transition-colors"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                {/* Navigation Dots */}
                <div className="flex space-x-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
                {/* Right Arrow */}
                <button
                    onClick={nextSlide}
                    className="hidden md:block mx-4 p-2 rounded-full text-white hover:bg-black/50 transition-colors"
                    aria-label="Next slide"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

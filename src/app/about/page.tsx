"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { images } from "@/assets/images";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 mb-48 pt-[56px] md:pt-[73px]">
                {/* Hero Section */}
                <div className="relative w-full h-[477px] md:h-[806px]">
                    <img
                        src={images.aboutBanner}
                        alt="Beyond Running Team"
                        className="object-cover brightness-75 w-full h-full absolute inset-0"
                        style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}}
                        loading="eager"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 md:w-32 md:h-32">
                            <img
                                src="/icons/Blogo.svg"
                                alt="Beyond Running Logo"
                                width={128}
                                height={128}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Brand Name */}
                <div className="container text-center mx-auto px-4 py-16">
                    <h1 className="text-4xl md:text-9xl font-itc-bold tracking-tight">
                        BEYOND : RUNNING
                    </h1>
                </div>

                {/* Brand Story */}
                <div className="container mx-auto px-4 md:py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Motion Image */}
                        <div className="relative h-[464px] md:h-[851px]">
                            <img src={images.aboutImage} alt="Runners in motion" className="w-full h-full object-cover absolute inset-0" style={{objectFit: 'cover', width: '100%', height: '100%', position: 'absolute'}} />
                        </div>

                        {/* Brand Story Text */}
                        <div className="space-y-8 text-2xl font-folio-bold x-24">
                            <p className="text-sm md:text-base">
                                The spark that ignited our journey was to place Indonesia at the
                                forefront of the global running culture, not as followers, but as
                                trailblazers. We gathered inspiration and fuel for our innovative
                                process from the center of the equator line, suiting the extreme
                                running conditions. Thus, we created Beyond Running with the help
                                and support by the local running communities.
                            </p>

                            <p className="text-sm md:text-base">
                                Beyond Running is a running apparel brand based in Jakarta.
                                Initiated by four like-minded people who see running in a wider
                                range. Through this brand, they want to capture moments, feelings,
                                and experiences when it comes to running. Each collection is built
                                from a collective response of the community under the brand,
                                designed to seamlessly fit in a runners wardrobe and tested to suit
                                all running purposes.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

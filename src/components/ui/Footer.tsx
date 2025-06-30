"use client";

import Link from "next/link";
import { ArrowRight, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import useMobile from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";
import { images } from "@/assets/images";

export default function Footer() {
    const isMobile = useMobile();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isContactModalOpen, setContactModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || isSubmitting) return;

        setIsSubmitting(true);
        try {
            // Check if email already exists
            const { data: existingEmail } = await supabase
                .from("newsletter_subscribers")
                .select("email")
                .eq("email", email)
                .single();

            if (existingEmail) {
                setMessage("This email is already subscribed to our newsletter.");
                setTimeout(() => setMessage(""), 3000);
                return;
            }

            // Insert new email
            const { error } = await supabase.from("newsletter_subscribers").insert([{ email }]);

            if (error) throw error;

            setEmail("");
            setMessage("Thank you for subscribing!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error:", error);
            setMessage("Something went wrong. Please try again.");
            setTimeout(() => setMessage(""), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Only render the form on the client side
    const renderNewsletterForm = () => {
        if (!mounted) return null;

        return (
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-b border-[#000000] pb-2 focus:outline-none focus:border-black"
                        required
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        className="absolute right-0 bottom-2 cursor-pointer"
                        title="Subscribe to newsletter"
                        disabled={isSubmitting}
                    >
                        <ArrowRight className={`h-5 w-5 ${isSubmitting ? "opacity-50" : ""}`} />
                    </button>
                </div>
                {message && (
                    <p
                        className={`text-sm mt-2 ${
                            message.includes("already subscribed")
                                ? "text-yellow-600"
                                : message.includes("error")
                                  ? "text-red-500"
                                  : "text-green-500"
                        }`}
                    >
                        {message}
                    </p>
                )}
            </form>
        );
    };

    // Contact Modal Component
    const ContactModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-all duration-300">
                <div className="relative w-full max-w-4xl bg-white overflow-hidden rounded-lg shadow-2xl transition-all duration-500 transform">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full transition-colors duration-200 cursor-pointer shadow-lg"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5 text-black" />
                    </button>

                    <div className="flex flex-col md:flex-row min-h-[400px] md:min-h-[500px]">
                        {/* Image - Left side */}
                        <div className="w-full md:w-1/2 relative h-48 md:h-auto">
                            <Image
                                src={images.contactImage}
                                alt="Contact Us - Runners"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>

                        {/* Content - Right side */}
                        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white">
                            <div className="max-w-sm mx-auto w-full">
                                <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 md:mb-12 text-center leading-tight">
                                    YOU CAN REACH US
                                    <br />
                                    THROUGH:
                                </h2>

                                <div className="space-y-4 md:space-y-6">
                                    <a
                                        href="mailto:dummy@email.com"
                                        className="block w-full bg-[#d17928] hover:bg-[#c06820] text-white text-lg md:text-xl font-semibold py-4 md:py-5 rounded transition-all duration-300 text-center"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        EMAIL
                                    </a>

                                    <a
                                        href="https://wa.me/6281234567890"
                                        className="block w-full bg-[#d17928] hover:bg-[#c06820] text-white text-lg md:text-xl font-semibold py-4 md:py-5 rounded transition-all duration-300 text-center"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        WHATSAPP
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <footer className="border-t border-black h-full md:h-[333px] w-full pt-12 md:pb-0">
            {/* Contact Modal */}
            <ContactModal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)} />
            <div className="w-full px-4 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-12 md:h-[333px] pb-26 md:pb-12">
                    <div
                        className={`flex md:flex-col h-full gap-18 md:w-sm ${!isMobile && "justify-between"}`}
                    >
                        <Image
                            src="/icons/logoB.gif"
                            alt="Beyond Running Animation"
                            height={125}
                            width={125}
                            className="object-cover"
                            unoptimized={true} // Important for GIFs to animate properly
                        />
                        <>
                            {isMobile ? (
                                <div className="flex md:flex-row flex-col justify-center font-folio-light">
                                    <p>BEYOND RUNNING</p>
                                    <p>© 2025.</p>
                                    <p className="mt-6">All Rights Reserved</p>
                                </div>
                            ) : (
                                <div className="flex md:flex-row flex-col font-folio-light">
                                    <p>BEYOND RUNNING © 2025.</p>
                                    <p>All Rights Reserved</p>
                                </div>
                            )}
                        </>
                    </div>

                    <div className="h-full md:w-xs w-full md:ml-24 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-folio-bold bg-background mb-4">
                                JOIN THE MOTION
                            </h3>
                            <p className="text-sm font-folio-light mb-12 md:mb-6">
                                Keep up with the new drops, insights, runners stories and more.
                            </p>
                        </div>
                        <div>
                            {renderNewsletterForm()}
                            <div className="flex flex-col md:flex-row justify-between md:items-center pt-8 border-t border-gray-200 text-sm font-itc-xl">
                                <div className="flex gap-8 mt-4 md:mt-0">
                                    <button
                                        type="button"
                                        className="hover:underline cursor-pointer bg-transparent border-none p-0 m-0 text-inherit"
                                        onClick={() => setContactModalOpen(true)}
                                    >
                                        Contact Us
                                    </button>
                                    <Link href="/faq" className="hover:underline cursor-pointer">
                                        FAQ
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:justify-between md:gap-0 gap-4">
                        <div>
                            <h3 className="text-lg font-folio-bold mb-4">
                                FOLLOW US ON SOCIAL MEDIA
                            </h3>
                            <p className="text-sm font-folio-light mb-6">
                                Beyond running is a running apparel brand based in Jakarta. Each
                                collection is built from a collective response of the running
                                community, designed to seamlessly fit in a runners wardrobe and
                                tested to suit all running purposes.
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <Link
                                href="https://instagram.com"
                                aria-label="Instagram"
                                className="hover:opacity-70 cursor-pointer"
                            >
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link
                                href="https://twitter.com"
                                aria-label="Twitter"
                                className="hover:opacity-70 cursor-pointer"
                            >
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

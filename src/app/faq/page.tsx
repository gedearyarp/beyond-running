"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Loading from "@/components/ui/loading";
import { ChevronDown, Search } from "lucide-react";
import type { JSX } from "react";
import { getAllCollections } from "@/lib/shopify";
import { Collection } from "@/lib/shopify/types";

type FAQSection =
    | "contact"
    | "ordersShipping"
    | "sizingCare"
    | "returnsExchanges";

interface FAQItem {
    question: string;
    answer: string | JSX.Element;
}

interface FAQData {
    [key: string]: FAQItem[];
}

export default function FAQPage() {
    const searchParams = useSearchParams();
    const sectionParam = searchParams?.get("section") as FAQSection | null;
    const [activeSection, setActiveSection] = useState<FAQSection>("contact");
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Set section from query param on first mount
        if (sectionParam && ["contact", "ordersShipping", "sizingCare", "returnsExchanges"].includes(sectionParam)) {
            setActiveSection(sectionParam as FAQSection);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const fetchCollections = async () => {
            try {
                setIsLoading(true);
                const collectionsData = await getAllCollections();
                setCollections(collectionsData);
            } catch (error) {
                console.error("Failed to fetch collections:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollections();
    }, [mounted]);

    const toggleExpanded = (itemKey: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemKey)) {
            newExpanded.delete(itemKey);
        } else {
            newExpanded.add(itemKey);
        }
        setExpandedItems(newExpanded);
    };

    const faqData = useMemo<FAQData>(
        () => ({
            contact: [
                {
                    question: "How do I contact Beyond Running?",
                    answer: "You can reach us anytime by emailing info.beyondrunning@gmail.com. We'll get back to you within 48 business hours.",
                },
            ],
            ordersShipping: [
                {
                    question: "What courier providers do you use?",
                    answer: "For deliveries within Indonesia, we use trusted local courier providers such as JNE. For international deliveries, we primarily use Pos Indonesia for reliable and fast delivery.",
                },
                {
                    question: "Has my order been shipped?",
                    answer: "You'll receive a shipment notification along with tracking information via email once your order has been dispatched. Orders are typically processed within 1-2 business days unless otherwise stated.",
                },
                {
                    question: "How long will it take for my order to arrive?",
                    answer: (
                        <div>
                            <p className="mb-2">Order processing time is 1-2 business days unless stated otherwise.</p>
                            <ul className="list-disc pl-5">
                                <li><strong>Domestic (Indonesia):</strong> Standard shipping within Jakarta usually takes 1-3 business days, while deliveries to other major cities and regions in Indonesia typically take 3-7 business days.</li>
                                <li><strong>International:</strong> International shipping times vary by destination, but typically range from 5-10 business days via Pos Indonesia.</li>
                            </ul>
                            <p className="mt-2">You'll receive an email with tracking information as soon as your order ships.</p>
                        </div>
                    ),
                },
                {
                    question: "Do you ship internationally?",
                    answer: "Yes, we proudly ship our products globally! International shipping costs and estimated delivery times will be calculated at checkout based on your location.",
                },
            ],
            sizingCare: [
                {
                    question: "How do I pick the right size?",
                    answer: "In general, our styles run true to size. You can find style-specific fit and sizing recommendations under the 'Size Guide' dropdown on each product page. This is also where you'll find our size charts with additional details and a guide on how to measure yourself.",
                },
                {
                    question: "How do I care for my running apparel?",
                    answer: "To ensure the longevity of your apparel, we recommend machine washing cold with like colors, avoiding bleach, and tumble drying low or hang drying. Do not iron directly on graphics. Full care instructions are also listed on the garment's label.",
                },
            ],
            returnsExchanges: [
                {
                    question: "What is your return/exchange policy?",
                    answer: "We have a 7-day return policy, meaning returns must be initiated within 7 days from the date your order was delivered. To be eligible for a return, items must be in the same condition that you received them: unworn, unwashed, with tags, and in the original packaging. All international orders are final sale. We do not accept returns for small batch specialty items, and products with custom printing.",
                },
                {
                    question: "How do I return or exchange an item?",
                    answer: "To start a return or exchange, please email us at info.beyondrunning@gmail.com. You can exchange for a new size (if the requested size is still available) or return for a refund (some exceptions apply). Items sent back to us without first requesting a return will not be accepted.",
                },
                {
                    question: "How do exchanges work?",
                    answer: "Email us at info.beyondrunning@gmail.com to initiate an exchange for a new size. You'll first create a return, and then you'll be able to pick a new size. With instant exchanges, your new exchange order is placed immediately, which is the fastest way to ensure you get what you want. You'll receive an email with new tracking confirmation as soon as your new order ships.",
                },
                {
                    question: "When will I get my refund or store credit?",
                    answer: "Once we receive your return, we'll review the item(s) and if approved, we'll process the refund on your original payment method within 2-3 business days. We'll email you when the refund is issued. Please remember, refunds to international bank accounts may take an additional 5-7 business days to be processed and reflected in your account, depending on your bank.",
                },
                {
                    question: "What if I received a defective item in my order?",
                    answer: "Please notify us immediately (and within the 7-day return policy) if an item is defective or damaged upon receipt, please email us at info.beyondrunning@gmail.com and state the damaged part of the items so we can review your order. Damaged items are considered received in damaged condition or have a manufacturing defect. Items damaged through normal wear and tear are not considered defective.",
                },
                {
                    question: "What do I do if I get the wrong item in my order?",
                    answer: "Please notify us immediately through our email (and within the 7-day return policy) if you received the wrong item in your order. Email us at info.beyondrunning@gmail.com.",
                },
            ],
        }),
        []
    );

    const sectionTitles: Record<FAQSection, string> = {
        contact: "Contact Us",
        ordersShipping: "Orders & Shipping",
        sizingCare: "Sizing & Product Care",
        returnsExchanges: "Returns & Exchanges",
    };

    const filteredFAQData = useMemo(() => {
        if (!searchQuery.trim()) {
            return { [activeSection]: faqData[activeSection] };
        }

        return Object.entries(faqData).reduce((acc, [section, items]) => {
            const filteredItems = items.filter(
                (item) =>
                    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (typeof item.answer === "string" &&
                        item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            if (filteredItems.length > 0) {
                acc[section] = filteredItems;
            }
            return acc;
        }, {} as FAQData);
    }, [searchQuery, activeSection, faqData]);

    useEffect(() => {
        if (searchQuery) {
            const allKeys = Object.values(filteredFAQData)
                .flat()
                .map((_, index) => `search-${index}`);
            setExpandedItems(new Set(allKeys));
        }
    }, [searchQuery, filteredFAQData]);

    const handleSectionChange = (section: FAQSection) => {
        setActiveSection(section);
        setSearchQuery("");
        setExpandedItems(new Set());
    };

    if (!mounted || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading text="Loading FAQ..." />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 bg-white pt-[56px] md:pt-[73px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 pb-12 md:pb-20">
                    <div className="mb-8 md:mb-12">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-itc-demi text-black animate-fade-in">
                            FAQ
                        </h1>
                    </div>

                    <div className="mb-8 md:mb-12">
                        <div
                            className={`relative max-w-md transition-all duration-300 ${isSearchFocused ? "transform scale-105" : ""
                                }`}
                        >
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search FAQ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="w-full font-folio-light pl-10 pr-4 pt-4.5 pb-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-12">
                        {/* Desktop Sidebar Navigation */}
                        <div className="lg:col-span-1">
                            <nav className="space-y-2 sticky top-32">
                                {Object.entries(sectionTitles).map(([key, title], index) => (
                                    <button
                                        key={key}
                                        onClick={() => handleSectionChange(key as FAQSection)}
                                        className={`block w-full text-left py-3 px-4 text-sm md:text-base font-folio-bold transition-all duration-300 rounded-lg group animate-fade-in cursor-pointer ${activeSection === key && !searchQuery
                                            ? "text-white bg-black transform scale-105"
                                            : "text-gray-600 hover:text-black hover:bg-gray-100 hover:transform hover:translate-x-2"
                                            }`}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <span className="relative">
                                            {title}
                                            <span
                                                className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ${activeSection === key && !searchQuery
                                                    ? "w-full"
                                                    : "group-hover:w-full"
                                                    }`}
                                            ></span>
                                        </span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* FAQ Content */}
                        <div className="lg:col-span-3">
                            {searchQuery && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
                                    <p className="text-sm font-folio-light text-gray-800">
                                        <span className="font-folio-bold">
                                            {Object.values(filteredFAQData).flat().length} result(s)
                                            found
                                        </span>{" "}
                                        for "{searchQuery}"
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4 md:space-y-6">
                                {searchQuery
                                    ? // Search Results
                                    Object.entries(filteredFAQData).map(([section, items]) =>
                                        items.map((faq, index) => {
                                            const itemKey = `search-${index}`;
                                            const isExpanded = expandedItems.has(itemKey);
                                            return (
                                                <div
                                                    key={itemKey}
                                                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in"
                                                    style={{ animationDelay: `${index * 100}ms` }}
                                                >
                                                    <button
                                                        onClick={() => toggleExpanded(itemKey)}
                                                        className="w-full text-left p-4 md:p-6 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between group"
                                                    >
                                                        <div>
                                                            <h3 className="text-base md:text-lg font-folio-bold text-black group-hover:text-gray-500 transition-colors duration-300">
                                                                {faq.question}
                                                            </h3>
                                                            <p className="text-sm font-folio-light text-gray-500 mt-1 capitalize">
                                                                {
                                                                    sectionTitles[
                                                                    section as FAQSection
                                                                    ]
                                                                }
                                                            </p>
                                                        </div>
                                                        <div
                                                            className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                                                                }`}
                                                        >
                                                            <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                                        </div>
                                                    </button>
                                                    <div
                                                        className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded
                                                            ? "max-h-96 opacity-100"
                                                            : "max-h-0 opacity-0"
                                                            }`}
                                                    >
                                                        <div className="p-4 md:p-6 pt-0 font-folio-light text-sm md:text-base text-gray-700 leading-relaxed">
                                                            {typeof faq.answer === "string" ? (
                                                                <p>{faq.answer}</p>
                                                            ) : (
                                                                faq.answer
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )
                                    : // Regular Section View
                                    faqData[activeSection]?.map((faq, index) => {
                                        const itemKey = `${activeSection}-${index}`;
                                        const isExpanded = true;

                                        return (
                                            <div
                                                key={itemKey}
                                                className="border-b border-gray-200 pb-8 md:pb-12 last:border-b-0 animate-fade-in hover:bg-gray-50 transition-colors duration-300 rounded-lg p-4 md:p-6 -m-4 md:-m-6 mb-4 md:mb-6 cursor-pointer"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <h3 className="text-lg md:text-xl font-folio-bold text-black mb-4 md:mb-6 transition-colors duration-300">
                                                    {faq.question}
                                                </h3>
                                                <div className="text-sm md:text-base font-folio-light text-gray-700 leading-relaxed">
                                                    {typeof faq.answer === "string" ? (
                                                        <p>{faq.answer}</p>
                                                    ) : (
                                                        faq.answer
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                {/* No Results */}
                                {searchQuery &&
                                    Object.values(filteredFAQData).flat().length === 0 && (
                                        <div className="text-center py-12 animate-fade-in font-folio-medium">
                                            <div className="text-gray-400 mb-4">
                                                <Search className="h-16 w-16 mx-auto" />
                                            </div>
                                            <h3 className="text-lg text-gray-900 mb-2">
                                                No results found
                                            </h3>
                                            <p className="text-gray-600">
                                                Try adjusting your search terms or{" "}
                                                <button
                                                    onClick={() => setSearchQuery("")}
                                                    className="text-gray-500 hover:text-gray-600 underline"
                                                >
                                                    browse all FAQs
                                                </button>
                                            </p>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
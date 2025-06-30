"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Loading from "@/components/ui/loading";
import { ChevronDown, Search } from "lucide-react";
import type { JSX } from "react";
import { getAllCollections } from "@/lib/shopify";
import { Collection } from "@/lib/shopify/types";

type FAQSection = "general" | "returns" | "repairs" | "products" | "care";

interface FAQItem {
    question: string;
    answer: string | JSX.Element;
}

interface FAQData {
    [key: string]: FAQItem[];
}

export default function FAQPage() {
    const [activeSection, setActiveSection] = useState<FAQSection>("general");
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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

    // Memoize the FAQ data to prevent recreation on every render
    const faqData = useMemo<FAQData>(
        () => ({
            general: [
                {
                    question: "How Do I Contact BEYOND:RUNNING?",
                    answer: "Reach us at anytime by emailing mail@beyondrunning.com. We will get back to you within 48hrs.",
                },
                {
                    question: "How Do I Become Member?",
                    answer: "You can sign up for our membership here! Membership gets you early access to drops, 10% off all orders, free domestic standard shipping, and an annual gift!",
                },
                {
                    question: "Do You Have a Shop?",
                    answer: (
                        <div>
                            <p className="mb-2">
                                You can shop the range, try pieces on, meet the team and receive
                                in-person advice from the Showroom at 107 Clifton Street, EC2A 4LG,
                                London (map). If there is a specific item you are looking for,
                                please email us ahead of time, and we will do our best to make sure
                                it is here for your visit.
                            </p>
                            <p>Please note we only accept card payments.</p>
                        </div>
                    ),
                },
                {
                    question: "What Forms of Payment Do You Accept?",
                    answer: "We accept all major debit and credit cards. We also offer PayPal, Google Pay and ShopPay.",
                },
                {
                    question: "Can I Reserve an Item?",
                    answer: "Due to high levels of demand, we are unable to reserve items. Please contact us if you have any questions, our team are all experienced runners and here to help you decide which is the right piece of kit for your needs.",
                },
                {
                    question: "Where is My 10% Welcome Discount?",
                    answer: "You will receive an email with your 10% welcome discount code once you have entered your email address on the website. Occasionally it goes to the junk mailbox, so please check there. It can take up to 15 minutes to arrive. If you do not receive it, please contact us. Please note we can't retrospectively apply this once an order has been made.",
                },
            ],
            returns: [
                {
                    question: "What is Your Returns Policy?",
                    answer: (
                        <div>
                            We offer free global returns for most countries within 28 days, take a
                            look{" "}
                            <a
                                href="#"
                                className="underline hover:text-orange-500 transition-colors duration-300"
                            >
                                here
                            </a>{" "}
                            at our returns page which outlines our policy and process in full.
                        </div>
                    ),
                },
                {
                    question: "What is the 1 Month Guarantee?",
                    answer: (
                        <div>
                            If you are not satisfied after running for up to 1 month in a SOAR
                            garment you can return it to us for a full refund. Full details of the 1
                            Month Guarantee can be found{" "}
                            <a
                                href="#"
                                className="underline hover:text-orange-500 transition-colors duration-300"
                            >
                                here
                            </a>
                            .
                        </div>
                    ),
                },
                {
                    question:
                        "Can I still return an item under the 1 Month Guarantee after 28 days?",
                    answer: (
                        <div>
                            <p className="mb-4">
                                Items purchased beyond our 28 day returns period may be refunded
                                under our 1 Month Guarantee policy. We request customers post the
                                item at their own expense to our warehouse, and contact our email
                                regarding their claim no more than 31 days after initial delivery of
                                the item:
                            </p>
                            <div className="mb-4 p-4 bg-gray-50 font-folio-light rounded-lg border-l-4 border-gray-500">
                                <p className="font-folio-medium">Beyond Running Returns</p>
                                <p>Haul + Store</p>
                                <p>Unit 17, Admiralty Way Camberley,</p>
                                <p>Surrey</p>
                                <p>GU15 3DT</p>
                                <p>UK</p>
                            </div>
                            <p>
                                If the item was purchased less than 28 days ago, please follow the
                                link{" "}
                                <a
                                    href="#"
                                    className="underline hover:text-orange-500 transition-colors duration-300"
                                >
                                    here
                                </a>{" "}
                                for more information about how to return it.
                            </p>
                        </div>
                    ),
                },
                {
                    question: "Where is my refund/exchange?",
                    answer: "Returns take approximately 3 business days to arrive back at our warehouse. Once our warehouse team check in your return, your refund/exchange should arrive in 1-5 business days.",
                },
                {
                    question: "Why isn't the returns link working with my order number?",
                    answer: "When using the returns page please ensure that you remove the '#' from your order number. Your order number should begin with 'SOAR' and is then followed by a sequence of numbers. If you are still having issues, please email us at: enquiries@soarrunning.com",
                },
                {
                    question: "Can I return a product bought at a sample sale?",
                    answer: "We are unable to refund or exchange any items bought from any of our sample sales.",
                },
            ],
            repairs: [
                {
                    question: "How do I request a repair for my product?",
                    answer: "If your BEYOND:RUNNING product needs repair, please contact our customer service team with photos of the issue and your order details. We'll assess the damage and provide repair options.",
                },
                {
                    question: "What types of repairs do you offer?",
                    answer: "We offer repairs for zippers, seam issues, and minor fabric damage. Our repair service aims to extend the life of your running gear and maintain its performance.",
                },
                {
                    question: "Is there a cost for repairs?",
                    answer: "Repairs for manufacturing defects within the first year are free of charge. For wear-and-tear repairs or damage outside warranty, we offer competitive repair pricing.",
                },
                {
                    question: "How long does a repair take?",
                    answer: "Most repairs are completed within 2-3 weeks from when we receive your item. We'll provide tracking information and updates throughout the repair process.",
                },
            ],
            products: [
                {
                    question: "What materials are used in BEYOND:RUNNING products?",
                    answer: "We use premium technical fabrics including recycled polyester, merino wool blends, and innovative moisture-wicking materials designed specifically for running performance.",
                },
                {
                    question: "How do I choose the right size?",
                    answer: "Please refer to our detailed size guide available on each product page. Our sizing is designed for a performance fit. If you're between sizes, we recommend sizing up for comfort.",
                },
                {
                    question: "Are your products suitable for all weather conditions?",
                    answer: "Our product range includes items designed for various weather conditions. We offer lightweight options for warm weather, insulated pieces for cold conditions, and versatile layers for changing weather.",
                },
                {
                    question: "How do I care for my BEYOND:RUNNING products?",
                    answer: "We recommend following the care instructions on each product's label. Generally, our technical fabrics perform best when washed in cold water and air-dried to maintain their performance properties.",
                },
                {
                    question: "Do you offer international shipping?",
                    answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can check shipping options and costs during checkout.",
                },
            ],
            care: [
                {
                    question: "How should I wash my running gear?",
                    answer: "For best results, wash your running gear in cold water with a mild detergent. Avoid fabric softeners as they can reduce the performance properties of technical fabrics.",
                },
                {
                    question: "Can I use fabric softener on BEYOND:RUNNING products?",
                    answer: "No, we recommend avoiding fabric softeners as they can coat the technical fibers and reduce their moisture-wicking and breathability properties.",
                },
                {
                    question: "How do I remove odors from my running gear?",
                    answer: "Technical fabrics can develop odors over time. We recommend using sports-specific detergents and occasionally adding a cup of white vinegar to the wash cycle to help remove odors.",
                },
                {
                    question: "Should I iron my running gear?",
                    answer: "Most of our technical fabrics don't require ironing. If needed, use a low heat setting and avoid ironing directly on any printed graphics or reflective elements.",
                },
            ],
        }),
        []
    );

    const sectionTitles: Record<FAQSection, string> = {
        general: "General",
        returns: "Returns & Exchanges",
        repairs: "Repairs & Maintenance",
        products: "Products & Sizing",
        care: "Care & Maintenance",
    };

    // Filter FAQ data based on search query
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

    // Auto-expand search results
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
            <Header collections={collections} />

            <main className="flex-1 bg-white pt-[88px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 pb-12 md:pb-20">
                    <div className="mb-8 md:mb-12">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-itc-demi text-black animate-fade-in">
                            FAQ
                        </h1>
                    </div>

                    <div className="mb-8 md:mb-12">
                        <div
                            className={`relative max-w-md transition-all duration-300 ${
                                isSearchFocused ? "transform scale-105" : ""
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
                                        className={`block w-full text-left py-3 px-4 text-sm md:text-base font-folio-bold transition-all duration-300 rounded-lg group animate-fade-in cursor-pointer ${
                                            activeSection === key && !searchQuery
                                                ? "text-white bg-black transform scale-105"
                                                : "text-gray-600 hover:text-black hover:bg-gray-100 hover:transform hover:translate-x-2"
                                        }`}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <span className="relative">
                                            {title}
                                            <span
                                                className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ${
                                                    activeSection === key && !searchQuery
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
                                                              className={`transform transition-transform duration-300 ${
                                                                  isExpanded ? "rotate-180" : ""
                                                              }`}
                                                          >
                                                              <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                                          </div>
                                                      </button>
                                                      <div
                                                          className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                                              isExpanded
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

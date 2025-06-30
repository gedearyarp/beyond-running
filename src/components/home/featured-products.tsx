"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { getAllCollections, getProductsByCollection, type Collection } from "@/lib/shopify";
import type { ProductCardType } from "@/lib/shopify/types";

export default function FeaturedProducts() {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [products, setProducts] = useState<ProductCardType[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);

    // Fetch collections and initial products
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const allCollections = await getAllCollections();
                // We are interested in the first 3 collections for the tabs
                const featuredCollections = allCollections.slice(0, 3);
                setCollections(featuredCollections);

                // Fetch products for the default tab (the first collection)
                if (featuredCollections.length > 0) {
                    const collectionProducts = await getProductsByCollection(
                        featuredCollections[0].handle
                    );
                    setProducts(collectionProducts);
                }
            } catch (error) {
                console.error("Error fetching featured products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle tab change to load products from the corresponding collection
    const handleTabClick = async (index: number) => {
        if (activeTabIndex === index || !collections[index] || loading) return;

        setActiveTabIndex(index);
        setCurrentProductIndex(0); // Reset scroll on tab change
        try {
            setLoading(true);
            const collectionHandle = collections[index].handle;
            const collectionProducts = await getProductsByCollection(collectionHandle);
            setProducts(collectionProducts);
        } catch (error) {
            console.error(`Error fetching products for ${collections[index].title}:`, error);
        } finally {
            setLoading(false);
        }
    };

    // Determine products per view based on screen size
    const getProductsPerView = () => {
        // This will be handled by CSS Grid, but we use this for navigation logic
        return 4; // Default for desktop, CSS will handle responsive behavior
    };

    const productsPerView = getProductsPerView();

    // Fungsi untuk mendapatkan index halaman terakhir
    const getLastPageIndex = () => {
        if (products.length % productsPerView === 0) {
            return products.length - productsPerView;
        }
        return products.length - (products.length % productsPerView);
    };

    // Navigation functions for products
    const nextProducts = () => {
        if (products.length > productsPerView) {
            const lastPageIndex = getLastPageIndex();
            if (currentProductIndex >= lastPageIndex) return;
            const nextIndex = currentProductIndex + productsPerView;
            if (nextIndex >= products.length) {
                setCurrentProductIndex(lastPageIndex);
            } else if (nextIndex > lastPageIndex) {
                setCurrentProductIndex(lastPageIndex);
            } else {
                setCurrentProductIndex(nextIndex);
            }
        }
    };

    const prevProducts = () => {
        if (currentProductIndex === 0) return;
        setCurrentProductIndex(Math.max(currentProductIndex - productsPerView, 0));
    };

    // Get current products to display
    const getCurrentProducts = () => {
        if (products.length <= productsPerView) {
            return products;
        }
        // If on the last page and not a full page, show the last productsPerView items
        if (currentProductIndex + productsPerView > products.length) {
            return products.slice(Math.max(products.length - productsPerView, 0), products.length);
        }
        return products.slice(currentProductIndex, currentProductIndex + productsPerView);
    };

    const currentProducts = getCurrentProducts();
    const showNavigation = products.length > productsPerView;
    const totalPages = Math.ceil(products.length / productsPerView);
    const canGoNext = showNavigation && currentProductIndex + productsPerView < products.length;
    const canGoPrev = showNavigation && currentProductIndex > 0;

    // Fungsi untuk menentukan halaman aktif (dot aktif)
    const getActivePage = () => {
        if (currentProductIndex >= (totalPages - 1) * productsPerView) {
            return totalPages - 1;
        }
        return Math.floor(currentProductIndex / productsPerView);
    };

    // Determine the currently active collection
    const activeCollection = collections[activeTabIndex];

    if (loading && products.length === 0) {
        return (
            <div className="my-12">
                <div className="mb-4 md:mb-6 px-4 md:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl md:text-[42px] font-itc-demi mb-3 md:mb-4 lg:mb-10">
                        FEATURED ARTICLES
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center pb-2 gap-2 sm:gap-3 md:gap-6">
                        <div className="flex gap-3 md:gap-6 overflow-x-auto pb-2 sm:pb-0">
                            {collections.map((collection, index) => (
                                <button
                                    key={collection.id}
                                    className={`text-xs sm:text-sm md:text-base font-medium whitespace-nowrap font-folio-medium transition-colors px-1 py-1 ${
                                        activeTabIndex === index
                                            ? "font-bold text-black"
                                            : "text-gray-500 hover:text-black"
                                    } cursor-pointer opacity-50 flex items-center gap-2`}
                                    onClick={() => handleTabClick(index)}
                                    disabled
                                >
                                    {collection.title}
                                    {activeTabIndex === index && (
                                        <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin align-middle ml-1"></span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="sm:ml-auto">
                            <Link
                                href="/shop"
                                className="text-xs sm:text-sm md:text-base font-itc-md underline cursor-pointer opacity-50 pointer-events-none"
                            >
                                SHOP NOW
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center h-64">
                    {/* Animated 3 Dots Loading */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                    <div className="text-gray-500 text-sm font-folio-medium">Loading Products</div>
                </div>
                <style jsx>{`
                    @keyframes bounce {
                        0%,
                        80%,
                        100% {
                            transform: scale(1);
                        }
                        40% {
                            transform: scale(1.5);
                        }
                    }
                    .animate-bounce {
                        display: inline-block;
                        animation: bounce 1.4s infinite both;
                    }
                    .animate-bounce:nth-child(1) {
                        animation-delay: -0.32s;
                    }
                    .animate-bounce:nth-child(2) {
                        animation-delay: -0.16s;
                    }
                    .animate-bounce:nth-child(3) {
                        animation-delay: 0s;
                    }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                `}</style>
            </div>
        );
    }

    if (!loading && products.length === 0) {
        return (
            <div className="my-8 md:my-12">
                <div className="mb-4 md:mb-6 px-4 md:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl md:text-[42px] font-itc-demi mb-3 md:mb-4 lg:mb-10">
                        FEATURED ARTICLES
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center pb-2 gap-2 sm:gap-3 md:gap-6">
                        <div className="flex gap-3 md:gap-6 overflow-x-auto pb-2 sm:pb-0">
                            {collections.map((collection, index) => (
                                <button
                                    key={collection.id}
                                    className={`text-xs sm:text-sm md:text-base font-medium whitespace-nowrap font-folio-medium transition-colors px-1 py-1 ${
                                        activeTabIndex === index
                                            ? "font-bold text-black"
                                            : "text-gray-500 hover:text-black"
                                    } cursor-pointer`}
                                    onClick={() => handleTabClick(index)}
                                    disabled={loading}
                                >
                                    {collection.title}
                                </button>
                            ))}
                        </div>
                        <div className="sm:ml-auto">
                            <Link
                                href="/shop"
                                className="text-xs sm:text-sm md:text-base font-itc-md underline cursor-pointer"
                            >
                                SHOP NOW
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[200px] py-12">
                    <div className="text-gray-400 text-lg font-folio-medium text-center">
                        No products found in this collection.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="my-8 md:my-12">
            <div className="mb-4 md:mb-6 px-4 md:px-6 lg:px-8">
                <div className="flex flex-row items-center justify-between mb-3 md:mb-4 lg:mb-10">
                    <h2 className="text-2xl sm:text-3xl md:text-[42px] font-itc-demi ">
                        FEATURED ARTICLES
                    </h2>
                    <div className="block sm:hidden px-4">
                        <Link href="/shop" className="text-xs font-itc-md underline cursor-pointer">
                            SHOP NOW
                        </Link>
                    </div>
                </div>
                <div className="relative flex flex-col sm:flex-row sm:items-center pb-2 gap-2 sm:gap-3 md:gap-6">
                    <div className="flex gap-3 md:gap-6 overflow-x-auto pb-2 sm:pb-0">
                        {collections.map((collection, index) => (
                            <button
                                key={collection.id}
                                className={`text-xs sm:text-sm md:text-base font-medium whitespace-nowrap font-folio-medium transition-colors px-1 py-1 ${
                                    activeTabIndex === index
                                        ? "font-bold text-black"
                                        : "text-gray-500 hover:text-black"
                                } cursor-pointer`}
                                onClick={() => handleTabClick(index)}
                                disabled={loading}
                            >
                                {collection.title}
                            </button>
                        ))}
                    </div>
                    {/* SHOP NOW for desktop */}
                    <div className="hidden sm:block absolute right-0 top-0">
                        <Link
                            href="/shop"
                            className="text-xs sm:text-sm md:text-base font-itc-md underline cursor-pointer"
                        >
                            SHOP NOW
                        </Link>
                    </div>
                </div>
            </div>

            <div className="relative">
                {/* Product Navigation Arrows - Hidden on mobile, visible on tablet+ */}
                {showNavigation && (
                    <>
                        <button
                            onClick={prevProducts}
                            disabled={!canGoPrev}
                            className="hidden md:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 p-2 lg:p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5" />
                        </button>
                        <button
                            onClick={nextProducts}
                            disabled={!canGoNext}
                            className="hidden md:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 p-2 lg:p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
                        </button>
                    </>
                )}

                {/* Products Grid Container */}
                <div className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20">
                    <div
                        className={`
            grid gap-3 sm:gap-4 lg:gap-6 transition-opacity duration-300 justify-center
            ${loading ? "opacity-50" : "opacity-100"}
            ${currentProducts.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : ""}
            ${currentProducts.length === 2 ? "grid-cols-1 xs:grid-cols-2 max-w-2xl mx-auto" : ""}
            ${currentProducts.length === 3 ? "grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto" : ""}
            ${currentProducts.length >= 4 ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : ""}
          `}
                    >
                        {currentProducts.map((product) => (
                            <div key={product.id} className="flex justify-center">
                                <div className="w-full max-w-[280px] sm:max-w-none">
                                    <ProductCard
                                        product={product}
                                        collectionHandle={activeCollection?.handle}
                                    />
                                </div>
                            </div>
                        ))}
                        {/* Add invisible placeholders to keep the last row centered and tidy */}
                        {currentProducts.length < productsPerView &&
                            Array.from({ length: productsPerView - currentProducts.length }).map(
                                (_, idx) => <div key={`placeholder-${idx}`} className="invisible" />
                            )}
                    </div>
                </div>

                {/* Mobile Navigation - Swipe indicators and touch-friendly dots */}
                {showNavigation && (
                    <div className="mt-4 md:mt-6">
                        {/* Mobile swipe hint */}
                        <div className="md:hidden text-center text-xs text-gray-400 mb-3">
                            Swipe to see more products
                        </div>

                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-2">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        // Calculate the correct index for the last page
                                        if (index === totalPages - 1) {
                                            setCurrentProductIndex(
                                                Math.max(products.length - productsPerView, 0)
                                            );
                                        } else {
                                            setCurrentProductIndex(index * productsPerView);
                                        }
                                    }}
                                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors touch-manipulation ${
                                        getActivePage() === index
                                            ? "bg-black"
                                            : "bg-gray-300 hover:bg-gray-400"
                                    } cursor-pointer`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Mobile Touch Navigation Buttons */}
                {showNavigation && (
                    <div className="flex md:hidden justify-center gap-4 mt-4 px-4">
                        <button
                            onClick={prevProducts}
                            disabled={!canGoPrev}
                            className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Prev</span>
                        </button>
                        <button
                            onClick={nextProducts}
                            disabled={!canGoNext}
                            className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation cursor-pointer"
                        >
                            <span className="text-sm font-medium">Next</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                    </div>
                )}

                {/* Collection Link */}
                {activeCollection && !loading && (
                    <div className="text-center mt-6 md:mt-8 px-4">
                        <Link
                            href={`/shop/${activeCollection.handle}`}
                            className="inline-flex items-center gap-2 text-sm md:text-base font-folio-medium text-gray-600 hover:text-black transition-colors touch-manipulation cursor-pointer"
                        >
                            View all in {activeCollection.title}
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

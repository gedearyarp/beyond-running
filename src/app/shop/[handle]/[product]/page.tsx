// DEPRECATED: This file will be removed after all product links are migrated to /product/:productName
"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import ProductCard from "@/components/ui/ProductCard";
import SizeChartModal from "@/components/ui/size-chart";
import AddToCartButton from "@/components/ui/add-to-cart-button";
import type { ProductDetailType, ProductCardType } from "@/lib/shopify/types";
import RichTextViewer from "@/components/ui/RichTextViewer";

// Constants
const GALLERY_AUTO_SCROLL_INTERVAL = 10000;

// Types
interface ProductDetailPageProps {
    product: ProductDetailType;
    relatedProducts: ProductCardType[];
}

// Gallery image type
type GalleryImage = { url: string; altText: string };

// Utility functions
const getColorHex = (colorName: string): string => {
    const colorMap: Record<string, string> = {
        black: "#000000",
        white: "#F0EBE3",
        olive: "#7aa799",
        navy: "#0a192f",
        gray: "#808080",
        mint: "#98fb98",
        red: "#CD5656",
        blue: "#9EC6F3",
        cream: "#ebe4dc",
    };
    return colorMap[colorName.toLowerCase()] || "#cccccc";
};

// New utility functions for color-based gallery images
const extractColorFromAltText = (altText: string): string | null => {
    if (!altText) return null;
    // Misal altText: "Product - Black" atau hanya "Black"
    // Ambil kata terakhir setelah '-' atau seluruh altText jika tidak ada '-'
    const parts = altText.split("-").map((s) => s.trim());
    const colorCandidate = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    // Hanya ambil huruf
    const colorMatch = colorCandidate.match(/([a-zA-Z]+)/);
    return colorMatch ? colorMatch[1].toLowerCase() : null;
};

const findRelatedImagesByColor = (allImages: { url: string; altText: string }[], selectedColor: string): { url: string; altText: string }[] => {
    if (!selectedColor || !allImages.length) return [];
    const colorName = selectedColor.toLowerCase();
    // Find images that match the selected color
    const relatedImages = allImages.filter((img) => {
        const extractedColor = extractColorFromAltText(img.altText);
        return extractedColor === colorName;
    });
    // If no exact matches found, try partial matches
    if (relatedImages.length === 0) {
        const partialMatches = allImages.filter((img) => {
            const extractedColor = extractColorFromAltText(img.altText);
            return (
                (extractedColor && extractedColor.includes(colorName)) ||
                colorName.includes(extractedColor || "")
            );
        });
        return partialMatches;
    }
    return relatedImages;
};

// Main component
export default function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
    // --- MEMOS ---
    const hasSizeOptions = useMemo(() => {
        return product.variants.edges.some((edge) =>
            edge.node.selectedOptions.some((opt) => opt.name.toLowerCase() === "size")
        );
    }, [product.variants]);

    const variantAvailability = useMemo(() => {
        const availability = new Map<string, boolean>();
        product.variants.edges.forEach((edge) => {
            const colorOption = edge.node.selectedOptions.find(
                (opt) => opt.name.toLowerCase() === "color"
            );
            const sizeOption = edge.node.selectedOptions.find(
                (opt) => opt.name.toLowerCase() === "size"
            );

            if (hasSizeOptions) {
                // Product has size options - use color-size combination
                if (colorOption && sizeOption) {
                    availability.set(
                        `${colorOption.value}-${sizeOption.value}`,
                        edge.node.availableForSale
                    );
                }
            } else {
                // Product has no size options - use only color
                if (colorOption) {
                    availability.set(colorOption.value, edge.node.availableForSale);
                }
            }
        });
        return availability;
    }, [product.variants, hasSizeOptions]);

    const isVariantAvailable = useCallback(
        (color: string, size?: string) => {
            if (hasSizeOptions) {
                // Product has size options - check color-size combination
                return variantAvailability.get(`${color}-${size}`) ?? false;
            } else {
                // Product has no size options - check only color
                return variantAvailability.get(color) ?? false;
            }
        },
        [variantAvailability, hasSizeOptions]
    );

    const isAnyVariantInStock = useMemo(
        () => Array.from(variantAvailability.values()).some((available) => available),
        [variantAvailability]
    );

    // --- DATA EXTRACTION ---
    const allGalleryImages = useMemo(
        () => product?.images?.edges?.map((edge) => ({ url: edge.node.url, altText: edge.node.altText || "" })) || [],
        [product?.images?.edges]
    );
    const formattedPrice = product?.priceRange?.minVariantPrice
        ? `${product.priceRange.minVariantPrice.currencyCode} ${Number(product.priceRange.minVariantPrice.amount).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
        : "Price not available";

    // Extract available options
    const availableColors = product?.variants?.edges
        ? Array.from(
            new Set(
                product.variants.edges.flatMap(
                    (v) =>
                        v.node.selectedOptions
                            ?.filter((opt) => opt.name.toLowerCase() === "color")
                            .map((opt) => opt.value) || []
                )
            )
        )
        : [];

    const availableSizes = product?.variants?.edges
        ? Array.from(
            new Set(
                product.variants.edges.flatMap(
                    (v) =>
                        v.node.selectedOptions
                            ?.filter((opt) => opt.name.toLowerCase() === "size")
                            .map((opt) => opt.value) || []
                )
            )
        )
        : [];

    // --- STATE MANAGEMENT ---
    const [selectedSize, setSelectedSize] = useState<string | null>(() => {
        // Only set initial size if product has size options
        if (hasSizeOptions) {
            const firstAvailable = product.variants.edges.find((v) => v.node.availableForSale);
            return (
                firstAvailable?.node.selectedOptions.find(
                    (opt) => opt.name.toLowerCase() === "size"
                )?.value || null
            );
        }
        return null;
    });
    const [selectedColor, setSelectedColor] = useState<string | null>(() => {
        const firstAvailable = product.variants.edges.find((v) => v.node.availableForSale);
        return (
            firstAvailable?.node.selectedOptions.find((opt) => opt.name.toLowerCase() === "color")
                ?.value || null
        );
    });
    const [displayImage, setDisplayImage] = useState({
        url: product?.images?.edges?.[0]?.node?.url || "/placeholder.svg",
        altText: product?.images?.edges?.[0]?.node?.altText || product?.title || "Product image",
    });
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
    const [activeGalleryImage, setActiveGalleryImage] = useState(0);
    const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);

    // Touch state for swipe gesture (mobile)
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);

    // Create color-based gallery images (after state declarations)
    const galleryImages = useMemo(() => {
        if (!selectedColor || allGalleryImages.length === 0) {
            return allGalleryImages;
        }
        const colorSpecificImages = findRelatedImagesByColor(allGalleryImages, selectedColor);
        // If we found color-specific images, use them
        if (colorSpecificImages.length > 0) {
            return colorSpecificImages;
        }
        // Fallback to all images if no color-specific images found
        return allGalleryImages;
    }, [allGalleryImages, selectedColor]);

    // Refs
    const mainImageRef = useRef<HTMLDivElement>(null);

    // Callbacks
    const handleCartClick = useCallback(() => {
        // Cart will be opened by the Header component when items are added
    }, []);

    const handleColorSelect = (color: string) => {
        // Don't change if it's the same color
        if (selectedColor === color) return;

        setSelectedColor(color);

        // Only handle size logic if product has size options
        if (hasSizeOptions && selectedSize && !isVariantAvailable(color, selectedSize)) {
            // Try to find an available size for this color
            const availableSizeForColor = availableSizes.find((size) =>
                isVariantAvailable(color, size)
            );
            if (availableSizeForColor) {
                setSelectedSize(availableSizeForColor);
            }
        }
    };

    const handleSizeSelect = (size: string) => {
        // Don't change if it's the same size
        if (selectedSize === size) return;

        setSelectedSize(size);

        // Only handle color logic if product has size options
        if (hasSizeOptions && selectedColor && !isVariantAvailable(selectedColor, size)) {
            // Try to find an available color for this size
            const availableColorForSize = availableColors.find((color) =>
                isVariantAvailable(color, size)
            );
            if (availableColorForSize) {
                setSelectedColor(availableColorForSize);
            }
        }
    };

    // Effects
    useEffect(() => {
        if (selectedColor && product?.variants) {
            // First, try to get the variant image
            const variant = product.variants.edges.find((edge) =>
                edge.node.selectedOptions.some(
                    (option) =>
                        option.name.toLowerCase() === "color" && option.value === selectedColor
                )
            );
            if (variant?.node.image) {
                setDisplayImage({
                    url: variant.node.image.url,
                    altText: variant.node.image.altText || product.title,
                });
            } else {
                // If no variant image, try to find color-specific gallery images
                const colorSpecificImages = findRelatedImagesByColor(
                    allGalleryImages,
                    selectedColor
                );
                if (colorSpecificImages.length > 0) {
                    setDisplayImage({
                        url: colorSpecificImages[0].url,
                        altText: colorSpecificImages[0].altText || `${product?.title || "Product"} - ${selectedColor}`,
                    });
                } else {
                    // Fallback to the first product image
                    setDisplayImage({
                        url: product?.images?.edges?.[0]?.node?.url || "/placeholder.svg",
                        altText:
                            product?.images?.edges?.[0]?.node?.altText ||
                            product?.title ||
                            "Product image",
                    });
                }
            }
        }
    }, [selectedColor, product?.images?.edges]);

    // Handler for clicking gallery image
    const handleGalleryImageClick = useCallback((image: GalleryImage) => {
        setDisplayImage({
            url: image.url,
            altText: image.altText || product?.title || "Product image",
        });
        // Scroll to main image
        if (mainImageRef.current) {
            mainImageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [product?.title]);

    // Handler for touch events (mobile swipe)
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
        setTouchEndX(null);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStartX === null || touchEndX === null) return;
        const distance = touchStartX - touchEndX;
        const minSwipeDistance = 50; // px
        if (distance > minSwipeDistance) {
            // Swipe left (next)
            setActiveGalleryImage((prev) => {
                const next = prev + 1;
                if (next < galleryImages.length) {
                    handleGalleryImageClick(galleryImages[next]);
                    return next;
                }
                return prev;
            });
        } else if (distance < -minSwipeDistance) {
            // Swipe right (prev)
            setActiveGalleryImage((prev) => {
                const next = prev - 1;
                if (next >= 0) {
                    handleGalleryImageClick(galleryImages[next]);
                    return next;
                }
                return prev;
            });
        }
        setTouchStartX(null);
        setTouchEndX(null);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (galleryImages.length >= 2) {
                setActiveGalleryImage((prev) => {
                    return (prev + 1) % galleryImages.length;
                });
            }
        }, GALLERY_AUTO_SCROLL_INTERVAL);

        return () => clearInterval(interval);
    }, [galleryImages.length]);

    // Reset active gallery image when gallery images change
    useEffect(() => {
        if (galleryImages.length >= 2) {
            setActiveGalleryImage(0);
        }
    }, [galleryImages]);

    // Auto-hover animation for desktop simple grid layout (less than 4 images)
    useEffect(() => {
        if (galleryImages.length > 1 && galleryImages.length < 4) {
            const interval = setInterval(() => {
                setHoveredImageIndex((prev) => {
                    if (prev === null) return 0;
                    return (prev + 1) % galleryImages.length;
                });
            }, 3000); // Change hover every 3 seconds

            return () => clearInterval(interval);
        }
    }, [galleryImages.length]);

    // Ensure we have valid initial selections
    useEffect(() => {
        if (!selectedColor && availableColors.length > 0) {
            const firstAvailable = product.variants.edges.find((v) => v.node.availableForSale);
            const initialColor = firstAvailable?.node.selectedOptions.find(
                (opt) => opt.name.toLowerCase() === "color"
            )?.value;
            if (initialColor) {
                setSelectedColor(initialColor);
            }
        }

        // Only set initial size if product has size options
        if (hasSizeOptions && !selectedSize && availableSizes.length > 0) {
            const firstAvailable = product.variants.edges.find((v) => v.node.availableForSale);
            const initialSize = firstAvailable?.node.selectedOptions.find(
                (opt) => opt.name.toLowerCase() === "size"
            )?.value;
            if (initialSize) {
                setSelectedSize(initialSize);
            }
        }
    }, [
        product.variants,
        availableColors,
        availableSizes,
        selectedColor,
        selectedSize,
        hasSizeOptions,
    ]);

    // Size chart data (legacy, will be replaced by images)
    const sizeChartData = [
        { size: "X-Small", chest: "43", front: "59", back: "61" },
        { size: "Small", chest: "46", front: "61", back: "63" },
        { size: "Medium", chest: "48", front: "63", back: "65" },
        { size: "Large", chest: "50", front: "65", back: "67" },
        { size: "X-Large", chest: "53", front: "68", back: "70" },
    ];

    // Filter images with altText 'size_guide'
    const sizeGuideImages = allGalleryImages.filter(img => img.altText && img.altText.toLowerCase() === 'size_guide');

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-[56px] md:pt-[73px]">
                <div className="container mx-auto md:px-4 md:py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <div ref={mainImageRef}>
                            <div className="bg-gray-100 mt-16 aspect-square relative overflow-hidden">
                                <Image
                                    src={displayImage.url}
                                    alt={displayImage.altText}
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="w-full flex md:justify-end">
                            <div className="md:w-2/3 md:px-0 px-4">
                                <div className="flex mb-12">
                                    <Link
                                        href="/shop"
                                        className="flex items-center underline text-xs font-avant-garde group transition-all duration-300"
                                    >
                                        <ArrowLeft className="h-3 w-3 mr-1 transition-transform duration-300 group-hover:-translate-x-1" />
                                        <span className="font-folio-light group-hover:text-gray-500">
                                            BACK TO COLLECTIONS
                                        </span>
                                    </Link>
                                </div>
                                <h1 className="text-3xl md:text-[36px] font-itc-demi mb-1 animate-fade-in">
                                    {product?.title || "Product Name"}
                                </h1>
                                <p className="text-xl md:text-[24px] font-folio-bold mb-8 animate-fade-in animation-delay-200">
                                    {formattedPrice}
                                </p>

                                {/* Product Description as Rich Text */}
                                {product?.descriptionHtml && (
                                    <div className="mb-10 animate-fade-in animation-delay-300">
                                        <RichTextViewer content={product.descriptionHtml} className="text-sm md:text-[14px] font-folio-light" />
                                    </div>
                                )}

                                {/* Color Selection */}
                                <div className="mt-10 border-b pb-12">
                                    <h3 className="text-sm font-folio-bold mb-4">COLOR</h3>
                                    <div className="flex space-x-3">
                                        {availableColors.length > 0 ? (
                                            availableColors.map((color) => {
                                                // A color is available if:
                                                // - Product has size options: there's at least one size available for it AND product has stock
                                                // - Product has no size options: the color variant is available for sale
                                                const isAvailable =
                                                    isAnyVariantInStock &&
                                                    (hasSizeOptions
                                                        ? availableSizes.some((size) =>
                                                            isVariantAvailable(color, size)
                                                        )
                                                        : isVariantAvailable(color));
                                                return (
                                                    <button
                                                        key={color}
                                                        disabled={!isAvailable}
                                                        className={`w-10 h-10 rounded-full transition-all duration-300 transform cursor-pointer ${selectedColor === color
                                                            ? "ring-2 ring-offset-4 ring-black scale-110"
                                                            : "border border-gray-300 hover:scale-110"
                                                            } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        style={{
                                                            backgroundColor: getColorHex(color),
                                                        }}
                                                        onClick={() => handleColorSelect(color)}
                                                        aria-label={color}
                                                    />
                                                );
                                            })
                                        ) : (
                                            <p className="text-xs text-gray-500">
                                                No colors available
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Size Selection */}
                                {hasSizeOptions && (
                                    <div className="mt-10">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-folio-bold">SIZE</h3>
                                            <button
                                                onClick={() => {
                                                    if (sizeGuideImages.length > 0) setIsSizeChartOpen(true);
                                                }}
                                                className={`text-xs underline font-avant-garde relative group cursor-pointer transition-colors
                                                    ${sizeGuideImages.length === 0 ? 'opacity-50 cursor-not-allowed pointer-events-auto' : 'hover:text-orange-500'}`}
                                                disabled={sizeGuideImages.length === 0}
                                                tabIndex={sizeGuideImages.length === 0 ? -1 : 0}
                                                title={sizeGuideImages.length === 0 ? 'Size guide not available' : ''}
                                            >
                                                <span className="text-sm font-folio-medium">
                                                    SIZE GUIDE
                                                </span>
                                                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                                                {sizeGuideImages.length === 0 && (
                                                    <span className="ml-2 text-xs text-red-500 font-folio-light"></span>
                                                )}
                                            </button>
                                        </div>
                                        <div className="flex space-x-8">
                                            {availableSizes.length > 0 ? (
                                                availableSizes.map((size) => {
                                                    // A size is available if the selected color is available with this size AND product has stock
                                                    const isAvailable =
                                                        isAnyVariantInStock &&
                                                        (selectedColor
                                                            ? isVariantAvailable(
                                                                selectedColor,
                                                                size
                                                            )
                                                            : true);
                                                    return (
                                                        <button
                                                            key={size}
                                                            disabled={!isAvailable}
                                                            className={`w-10 h-10 flex items-center justify-center transition-all duration-300 cursor-pointer ${selectedSize === size
                                                                ? "border border-black rounded-full font-bold transform scale-110"
                                                                : "border-gray-300 hover:border-black text-[#ADADAD] hover:text-black hover:scale-110"
                                                                } ${!isAvailable ? "opacity-25 cursor-not-allowed relative" : ""} font-itc-bold`}
                                                            onClick={() => handleSizeSelect(size)}
                                                        >
                                                            {size}
                                                            {!isAvailable && (
                                                                <span className="absolute w-full h-0.5 bg-gray-400 transform rotate-45"></span>
                                                            )}
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-xs font-folio-medium text-gray-500">
                                                    No sizes available
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Add to Cart Button */}
                                <AddToCartButton
                                    product={product}
                                    selectedSize={selectedSize}
                                    selectedColor={selectedColor}
                                    hasSizeOptions={hasSizeOptions}
                                    disabled={
                                        !isAnyVariantInStock ||
                                        (hasSizeOptions
                                            ? selectedColor && selectedSize
                                                ? !isVariantAvailable(selectedColor, selectedSize)
                                                : true
                                            : selectedColor
                                                ? !isVariantAvailable(selectedColor)
                                                : true)
                                    }
                                    buttonText={!isAnyVariantInStock ? "OUT OF STOCK" : undefined}
                                />

                                {/* Additional Links */}
                                <div className="flex flex-row justify-center gap-4 sm:gap-8 mt-6 text-sm w-full font-folio-light">
                                    <Link href="/faq?section=ordersShipping" className="underline hover:text-orange-500 transition-colors duration-300 relative group text-center sm:text-left">
                                        <span>Delivery</span>
                                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                    <Link href="/faq?section=returnsExchanges" className="underline hover:text-orange-500 transition-colors duration-300 relative group text-center sm:text-left">
                                        <span>Return & Exchange</span>
                                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                    <Link href="/faq?section=sizingCare" className="underline hover:text-orange-500 transition-colors duration-300 relative group text-center sm:text-left">
                                        <span>Washing Guide</span>
                                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gallery Images */}
                    {galleryImages.length > 1 && (
                        <div className="mt-16 px-4 md:px-0">
                            {/* Mobile Layout - Always show one image at a time */}
                            <div className="md:hidden">
                                <div className="overflow-hidden">
                                    <div className="flex justify-center">
                                        <div className="relative w-full max-w-[300px]">
                                            <div
                                                className="flex space-x-4 transition-transform duration-700 ease-in-out"
                                                style={{
                                                    transform: `translateX(-${activeGalleryImage * (300 + 16)}px)`,
                                                }}
                                                onTouchStart={handleTouchStart}
                                                onTouchMove={handleTouchMove}
                                                onTouchEnd={handleTouchEnd}
                                            >
                                                {galleryImages.map((image, index) => (
                                                    <div
                                                        key={image.url}
                                                        className={`flex-shrink-0 w-[300px] h-[225px] relative transition-all duration-500 cursor-pointer ${activeGalleryImage === index
                                                            ? "scale-100 opacity-100"
                                                            : "scale-95 opacity-80"
                                                            }`}
                                                        onClick={() => {
                                                            setActiveGalleryImage(index);
                                                            handleGalleryImageClick(image);
                                                        }}
                                                    >
                                                        <Image
                                                            src={image.url || "/placeholder.svg"}
                                                            alt={image.altText || `Product view ${index + 1}`}
                                                            fill
                                                            className="object-cover transition-transform duration-500 hover:scale-105"
                                                            sizes="300px"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Navigation Dots */}
                                    <div className="flex justify-center mt-4 space-x-2">
                                        {galleryImages.map((_, index) => (
                                            <button
                                                key={index}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${activeGalleryImage === index
                                                    ? "bg-orange-500 w-4"
                                                    : "bg-gray-300 hover:bg-gray-400"
                                                    }`}
                                                onClick={() => setActiveGalleryImage(index)}
                                                aria-label={`View image ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Layout - Original rules */}
                            <div className="hidden md:block">
                                {galleryImages.length < 4 ? (
                                    // Simple grid layout for less than 4 images
                                    <div className="flex justify-center overflow-hidden">
                                        <div className="flex space-x-4 max-w-full">
                                            {galleryImages.map((image, index) => (
                                                <div
                                                    key={image.url}
                                                    className="relative w-[400px] h-[300px] lg:w-[500px] lg:h-[375px] flex-shrink-0 transition-all duration-500 cursor-pointer"
                                                    onMouseEnter={() => setHoveredImageIndex(index)}
                                                    onMouseLeave={() => setHoveredImageIndex(null)}
                                                    onClick={() => handleGalleryImageClick(image)}
                                                >
                                                    <Image
                                                        src={image.url || "/placeholder.svg"}
                                                        alt={image.altText || `Product view ${index + 1}`}
                                                        fill
                                                        className={`object-cover transition-transform duration-500 ${hoveredImageIndex === index
                                                            ? "scale-105"
                                                            : "scale-100"
                                                            }`}
                                                        sizes="(max-width: 1024px) 400px, 500px"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    // Pagination layout for 4 or more images
                                    <div className="overflow-hidden">
                                        <div className="flex justify-center">
                                            <div className="relative w-full max-w-[500px]">
                                                <div
                                                    className="flex space-x-4 transition-transform duration-700 ease-in-out"
                                                    style={{
                                                        transform: `translateX(-${activeGalleryImage * (500 + 16)}px)`,
                                                    }}
                                                >
                                                    {galleryImages.map((image, index) => (
                                                        <div
                                                            key={image.url}
                                                            className={`flex-shrink-0 w-[500px] h-[375px] relative transition-all duration-500 cursor-pointer ${activeGalleryImage === index
                                                                ? "scale-100 opacity-100"
                                                                : "scale-95 opacity-80"
                                                                }`}
                                                            onClick={() => {
                                                                setActiveGalleryImage(index);
                                                                handleGalleryImageClick(image);
                                                            }}
                                                        >
                                                            <Image
                                                                src={image.url || "/placeholder.svg"}
                                                                alt={image.altText || `Product view ${index + 1}`}
                                                                fill
                                                                className="object-cover transition-transform duration-500 hover:scale-105"
                                                                sizes="500px"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop Navigation Dots - only for 4+ images */}
                                        <div className="flex justify-center mt-4 space-x-2">
                                            {galleryImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${activeGalleryImage === index
                                                        ? "bg-orange-500 w-4"
                                                        : "bg-gray-300 hover:bg-gray-400"
                                                        }`}
                                                    onClick={() => setActiveGalleryImage(index)}
                                                    aria-label={`View image ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Show message when no color-specific images found */}
                    {selectedColor && galleryImages.length === 0 && allGalleryImages.length > 0 && (
                        <div className="mt-16 text-center">
                            <p className="text-gray-500 text-sm">
                                No additional images available for {selectedColor} color variant.
                            </p>
                        </div>
                    )}

                    {/* Related Products */}
                    <div className="mt-20 px-4 md:px-0">
                        <h2 className="text-xl md:text-[16px] font-itc-demi mb-8 text-left">
                            YOU MAY ALSO LIKE
                        </h2>
                        {relatedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {relatedProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="transform transition-transform duration-300 hover:scale-105"
                                    >
                                        <ProductCard product={product} />
                                        <button
                                            className="mt-2 text-xs underline font-avant-garde relative group overflow-hidden"
                                            onClick={handleCartClick}
                                        >
                                            {/* <span className="relative z-10 group-hover:text-orange-500 transition-colors duration-300">
                        ADD TO BAG
                      </span>
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span> */}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-8 text-gray-500">
                                No related products found.
                            </p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />

            {/* Size Chart Modal */}
            <SizeChartModal
                isOpen={isSizeChartOpen}
                onClose={() => setIsSizeChartOpen(false)}
                sizeData={sizeChartData}
                productName={`${product?.title || "Product"}`}
                sizeGuideImages={sizeGuideImages}
            />
        </div>
    );
}

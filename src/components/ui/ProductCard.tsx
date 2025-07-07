// components/ui/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import { ProductCardType } from "@/lib/shopify/types";

interface ProductCardProps {
    product: ProductCardType;
    isShop?: boolean;
    collectionHandle?: string;
    selectedColor?: string;
    onColorSelect?: (color: string) => void;
}

// Utility: extract color from alt text (copied from product detail page)
function extractColorFromAltText(altText: string): string | null {
    if (!altText) return null;
    const parts = altText.split("-").map((s) => s.trim());
    const colorCandidate = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    const colorMatch = colorCandidate.match(/([a-zA-Z]+)/);
    return colorMatch ? colorMatch[1].toLowerCase() : null;
}

// Utility: find images by color (copied from product detail page)
function findRelatedImagesByColor(
    allImages: { url: string; altText: string }[],
    selectedColor: string
): { url: string; altText: string }[] {
    if (!selectedColor || !allImages.length) return [];
    const colorName = selectedColor.toLowerCase();
    const relatedImages = allImages.filter((img) => {
        const extractedColor = extractColorFromAltText(img.altText);
        return extractedColor === colorName;
    });
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
}

export default function ProductCard({ product, isShop, collectionHandle, selectedColor, onColorSelect }: ProductCardProps) {
    const imageUrl = product.images?.edges?.[0]?.node?.url || "/placeholder.svg";
    const imageAlt = product.images?.edges?.[0]?.node?.altText || product.title;

    const formattedPrice = product.priceRange
        ? `${product.priceRange.minVariantPrice.currencyCode} ${Number(product.priceRange.minVariantPrice.amount).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
        : "1";

    // Calculate colors count from metafields
    const colorsCount = (() => {
        if (!product.metafields || !Array.isArray(product.metafields)) return 0;

        const colorMetafield = product.metafields.find((m) => m && m.key === "color-pattern");
        if (!colorMetafield || !colorMetafield.references || !colorMetafield.references.nodes)
            return 0;

        return colorMetafield.references.nodes.filter((node) => node && node.handle).length;
    })();

    // Ambil list warna dari metafields
    const colorHandles = (() => {
        if (!product.metafields || !Array.isArray(product.metafields)) return [];
        const colorMetafield = product.metafields.find((m) => m && m.key === "color-pattern");
        if (!colorMetafield || !colorMetafield.references || !colorMetafield.references.nodes)
            return [];
        return colorMetafield.references.nodes
            .filter((node) => node && node.handle)
            .map((node) => node.handle);
    })();

    // Mapping handle ke HEX (tambahkan sesuai kebutuhan)
    const colorMap: Record<string, string> = {
        black: "#000000",
        white: "#FFFFFF",
        cream: "#F5F5DC",
        "cream-1": "#F5F5DC",
        navy: "#001F3F",
        blue: "#0074D9",
        red: "#FF4136",
        green: "#2ECC40",
        yellow: "#FFDC00",
        grey: "#AAAAAA",
        gray: "#AAAAAA",
        // tambahkan mapping lain sesuai kebutuhan
    };

    // Ensure product.handle exists
    if (!product.handle) {
        console.error("Product handle is missing:", product);
        return null;
    }

    // Use consistent URL structure
    const productUrl = `/product/${product.handle}`;

    // Prepare all images for color matching
    const allImages = (product.images?.edges || []).map(edge => ({ url: edge.node.url, altText: edge.node.altText || "" }));

    // Determine which color is selected (for shop, use prop; for detail, fallback to undefined)
    // If no selectedColor, default to first color
    const activeColor = selectedColor || colorHandles[0];

    // Find image for selected color (if available, use same logic as product detail)
    function getImageForColor(color: string) {
        if (allImages.length > 0 && color) {
            const colorImages = findRelatedImagesByColor(allImages, color);
            if (colorImages.length > 0) {
                return colorImages[0];
            }
        }
        // Fallback to first image
        return { url: imageUrl, altText: imageAlt };
    }
    const displayImage = activeColor ? getImageForColor(activeColor) : { url: imageUrl, altText: imageAlt };

    return (
        <Link href={productUrl} className="group block w-full">
            <div
                className={`${isShop
                    ? "w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px]"
                    : "w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px]"
                    } relative mb-3 overflow-hidden`}
            >
                <Image
                    src={displayImage.url}
                    alt={displayImage.altText}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    priority={isShop}
                />
            </div>
            <div className="px-1">
                <h3 className="font-bold text-xs sm:text-sm font-folio-bold line-clamp-2 mb-1">
                    {product.title}
                </h3>
                {/* List bulatan warna */}
                {colorHandles.length > 0 && (
                    <div className="flex flex-row gap-3 mb-2">
                        {colorHandles.map((handle, idx) => {
                            const isSelected = activeColor === handle;
                            return (
                                <span key={handle + idx}>
                                    {onColorSelect ? (
                                        <button
                                            type="button"
                                            className={`
                                                inline-block
                                                w-6 h-6 md:w-5 md:h-5
                                                rounded-full
                                                shadow-md
                                                focus:outline-none
                                                transition-all duration-200
                                                relative
                                                active:scale-95
                                                hover:scale-110
                                                hover:shadow-lg
                                                ring-offset-2
                                                cursor-pointer
                                                ${isSelected ? "ring-2 ring-black border-black scale-110" : "border-gray-200"}
                                            `}
                                            style={{ backgroundColor: colorMap[handle] || "#E5E7EB" }}
                                            title={handle}
                                            aria-label={handle}
                                            onClick={e => {
                                                e.preventDefault();
                                                onColorSelect(handle);
                                            }}
                                        >
                                            {/* For accessibility: visually hidden label */}
                                            <span className="sr-only">{handle}</span>
                                        </button>
                                    ) : (
                                        <span
                                            className={`
                                                inline-block
                                                w-8 h-8 md:w-7 md:h-7
                                                rounded-full
                                                border-2
                                                ${isSelected ? "ring-2 ring-black border-black scale-110" : "border-gray-200"}
                                                shadow-md
                                                transition-all duration-200
                                            `}
                                            style={{ backgroundColor: colorMap[handle] || "#E5E7EB" }}
                                            title={handle}
                                        />
                                    )}
                                </span>
                            );
                        })}
                    </div>
                )}
                <p className="text-xs text-gray-600 mb-1 font-folio-light">{colorsCount} Colors</p>
                <p className="text-xs sm:text-sm font-folio-bold">{formattedPrice}</p>
            </div>
        </Link>
    );
}

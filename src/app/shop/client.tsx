"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import ProductCard from "@/components/ui/ProductCard";
import CustomDropdown from "@/components/ui/dropdown";
import Loading from "@/components/ui/loading";
import useMobile from "@/hooks/use-mobile";
import FilterModal, { type FilterSelections } from "@/components/shop/filter-modal";
import SortModal from "@/components/shop/sort-modal";
import type { ProductCardType, Collection } from "@/lib/shopify/types";
import {
    extractSizeOptions,
    extractCategoryOptions,
    extractGenderOptions,
    productMatchesSize,
    productMatchesCategory,
    productMatchesGender,
} from "@/lib/utils/product-sorting";
import { images } from "@/assets/images";
import GifIcon from "../../../public/gif/discover-white.gif"
import { useSearchParams } from "next/navigation";

const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price, Low to High" },
    { value: "price-high", label: "Price, High to Low" },
];

interface ShopPageClientProps {
    initialProducts: ProductCardType[];
    collections: Collection[];
    collection?: Collection;
}

export default function ShopPageClient({
    initialProducts,
    collection,
}: ShopPageClientProps) {
    const [products, setProducts] = useState<ProductCardType[]>(initialProducts);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Load more states
    const [displayedProducts, setDisplayedProducts] = useState<ProductCardType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const productsPerPage = 20;

    // Desktop dropdown states
    const [size, setSize] = useState("");
    const [category, setCategory] = useState("");
    const [gender, setGender] = useState("");
    const [sortBy, setSortBy] = useState("featured");

    // Add state for subcategory
    const [subcategory, setSubcategory] = useState("");

    const isMobile = useMobile();

    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);

    // Mobile filter modal states
    const [appliedFilters, setAppliedFilters] = useState<FilterSelections>({
        size: [],
        category: [],
        gender: [],
    });

    const [appliedSort, setAppliedSort] = useState<string>("featured");

    // Extract filter options from products
    const sizeOptions = useMemo(() => extractSizeOptions(initialProducts), [initialProducts]);
    const categoryOptions = useMemo(
        () => extractCategoryOptions(initialProducts),
        [initialProducts]
    );
    const genderOptions = useMemo(() => {
        const options = extractGenderOptions(initialProducts);
        // Add "All Gender" as default option
        return [{ value: "all", label: "All Gender" }, ...options];
    }, [initialProducts]);

    // Helper to normalize tag values
    const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, "-");

    // Generate subcategory options based on selected category
    const subcategoryOptions = useMemo(() => {
        if (!category) return [];
        // Find all products that match the selected category
        const productsInCategory = initialProducts.filter(
            (p) => p.productType && p.productType.toLowerCase().replace(/\s+/g, "-") === category
        );
        // Collect all tags from those products
        const tagSet = new Set<string>();
        productsInCategory.forEach((p) => {
            (p.tags || []).forEach((tag) => tagSet.add(tag));
        });
        // Return as dropdown options (normalize value, keep label original)
        return Array.from(tagSet).sort().map((tag) => ({ value: normalize(tag), label: tag }));
    }, [category, initialProducts]);

    // Convert desktop dropdown values to filter arrays
    const getActiveFilters = (): FilterSelections => {
        if (isMobile) {
            return appliedFilters;
        } else {
            // Use value for category and gender
            const selectedSizeOption = sizeOptions.find((option) => option.value === size);
            const selectedCategoryOption = categoryOptions.find((option) => option.value === category);
            const selectedGenderOption = genderOptions.find((option) => option.value === gender);

            return {
                size: selectedSizeOption ? [selectedSizeOption.label] : [],
                category: selectedCategoryOption ? [selectedCategoryOption.value] : [],
                gender:
                    selectedGenderOption && selectedGenderOption.value !== "all"
                        ? [selectedGenderOption.value]
                        : [],
            };
        }
    };

    const searchParams = useSearchParams();

    const hasInitializedFromUrl = useRef(false);
    const lastUrl = useRef("");

    useEffect(() => {
        // Reset filter state setiap kali URL berubah
        const url = window.location.search;
        if (lastUrl.current !== url) {
            lastUrl.current = url;
            const urlCategory = searchParams.get("category");
            const urlGender = searchParams.get("gender");
            const urlSubcategory = searchParams.get("subcategory");

            setCategory("");
            setGender("");
            setSubcategory("");

            if (urlGender && genderOptions.some(opt => opt.value === urlGender)) {
                setGender(urlGender);
            }
            let matchedCategory = categoryOptions.find(opt => opt.value === urlCategory)?.value;
            if (!matchedCategory && urlCategory) {
                if (urlCategory.endsWith('s')) {
                    matchedCategory = categoryOptions.find(opt => opt.value === urlCategory.slice(0, -1))?.value;
                } else {
                    matchedCategory = categoryOptions.find(opt => opt.value === urlCategory + 's')?.value;
                }
            }
            if (matchedCategory) {
                setCategory(matchedCategory);
            }
            // subcategory akan di-handle di useEffect terpisah di bawah
        }
        // Untuk mobile, biarkan tetap sinkron setiap kali URL berubah
        // (tidak perlu perubahan di sini, sudah handled di useEffect lain)
        // eslint-disable-next-line
    }, [searchParams, categoryOptions, genderOptions]);

    // Sinkronkan subcategory dari URL setiap kali category/subcategoryOptions berubah
    useEffect(() => {
        const urlSubcategory = searchParams.get("subcategory");
        if (urlSubcategory && subcategoryOptions.some(opt => opt.value === urlSubcategory)) {
            setSubcategory(urlSubcategory);
        } else if (!urlSubcategory) {
            setSubcategory("");
        }
        // eslint-disable-next-line
    }, [category, subcategoryOptions, searchParams]);

    useEffect(() => {
        const applyClientSideFiltersAndSort = () => {
            setLoading(true);
            setError(null);
            try {
                let filteredProducts = [...initialProducts];
                const activeFilters = getActiveFilters();

                // Apply size filter
                if (activeFilters.size.length > 0) {
                    filteredProducts = filteredProducts.filter((product) =>
                        productMatchesSize(product, activeFilters.size)
                    );
                }

                // Apply combined category and gender filter (AND logic)
                if (activeFilters.category.length > 0 && activeFilters.gender.length > 0) {
                    filteredProducts = filteredProducts.filter((product) => {
                        // Category match
                        const catMatch = productMatchesCategory(product, activeFilters.category);
                        // Gender match
                        const genderMatch = productMatchesGender(product, activeFilters.gender);
                        return catMatch && genderMatch;
                    });
                } else {
                    // Fallback: apply each filter separately if only one is selected
                    if (activeFilters.category.length > 0) {
                        filteredProducts = filteredProducts.filter((product) =>
                            productMatchesCategory(product, activeFilters.category)
                        );
                    }
                    if (activeFilters.gender.length > 0) {
                        filteredProducts = filteredProducts.filter((product) =>
                            productMatchesGender(product, activeFilters.gender)
                        );
                    }
                }

                // Apply category, gender, and subcategory (tag) filter in mobile with AND logic using helpers
                if (isMobile) {
                    // Convert label to value for category
                    let catValue = "";
                    if (activeFilters.category && activeFilters.category[0]) {
                        const found = categoryOptions.find(opt => opt.label === activeFilters.category[0]);
                        catValue = found ? found.value : "";
                    }
                    let genderValue = "";
                    if (activeFilters.gender && activeFilters.gender[0]) {
                        const found = genderOptions.find(opt => opt.label === activeFilters.gender[0]);
                        genderValue = found ? found.value : "";
                    }
                    let filtered = [...filteredProducts];
                    if (catValue) {
                        filtered = filtered.filter((product) =>
                            productMatchesCategory(product, [catValue])
                        );
                    }
                    if (genderValue && genderValue !== "all") {
                        filtered = filtered.filter((product) =>
                            productMatchesGender(product, [genderValue])
                        );
                    }
                    const typeLabel = activeFilters.type && activeFilters.type[0];
                    if (typeLabel) {
                        const normType = normalize(typeLabel);
                        filtered = filtered.filter((product) =>
                            (product.tags || []).some((tag) => {
                                const normTag = normalize(tag);
                                return (
                                    normTag === normType ||
                                    normTag + 's' === normType ||
                                    normTag === normType + 's'
                                );
                            })
                        );
                    }
                    filteredProducts = filtered;
                } else if (subcategory) {
                    filteredProducts = filteredProducts.filter((product) =>
                        (product.tags || []).some((tag) => {
                            const normTag = normalize(tag);
                            // Match exact, or singular/plural
                            return (
                                normTag === subcategory ||
                                normTag + 's' === subcategory ||
                                normTag === subcategory + 's'
                            );
                        })
                    );
                }

                const sortedProducts = [...filteredProducts];
                const currentSort = isMobile ? appliedSort : sortBy;

                switch (currentSort) {
                    case "price-low":
                        sortedProducts.sort(
                            (a, b) =>
                                Number.parseFloat(a.priceRange.minVariantPrice.amount) -
                                Number.parseFloat(b.priceRange.minVariantPrice.amount)
                        );
                        break;
                    case "price-high":
                        sortedProducts.sort(
                            (a, b) =>
                                Number.parseFloat(b.priceRange.minVariantPrice.amount) -
                                Number.parseFloat(a.priceRange.minVariantPrice.amount)
                        );
                        break;
                    case "featured":
                    default:
                        // Keep original order from Shopify (featured order)
                        // No sorting needed, just use the order as received
                        break;
                }

                setProducts(sortedProducts);

                // Reset pagination and set initial displayed products
                setCurrentPage(1);
                setDisplayedProducts(sortedProducts.slice(0, productsPerPage));
                setHasMore(sortedProducts.length > productsPerPage);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        applyClientSideFiltersAndSort();
    }, [appliedFilters, appliedSort, size, category, gender, sortBy, initialProducts, isMobile, subcategory]);

    // Initialize displayed products on first load
    useEffect(() => {
        if (initialProducts.length > 0 && displayedProducts.length === 0) {
            setDisplayedProducts(initialProducts.slice(0, productsPerPage));
            setHasMore(initialProducts.length > productsPerPage);
            setIsInitialLoading(false);
        }
    }, [initialProducts, displayedProducts.length]);

    const filterButtonLabel = useMemo(() => {
        const activeFilters = getActiveFilters();
        const allFilters = [
            ...activeFilters.size,
            ...activeFilters.category,
            ...activeFilters.gender,
        ];

        if (allFilters.length === 0) {
            return "+ Filter";
        }

        if (allFilters.length <= 2) {
            return `+ ${allFilters.join(", ")}`;
        }

        return `+ ${allFilters[0]}, ${allFilters[1]} +${allFilters.length - 2}`;
    }, [appliedFilters, size, category, gender, isMobile]);

    const sortButtonLabel = useMemo(() => {
        const currentSort = isMobile ? appliedSort : sortBy;
        const sortOption = sortOptions.find((option) => option.value === currentSort);
        return sortOption ? sortOption.label : "Featured";
    }, [appliedSort, sortBy, isMobile]);

    const [hasUserAppliedMobileFilter, setHasUserAppliedMobileFilter] = useState(false);

    const handleApplyFilters = (filters: FilterSelections) => {
        setAppliedFilters(filters);
        setHasUserAppliedMobileFilter(true);
        setShowFilter(false);
    };

    const handleApplySort = (sort: string) => {
        setAppliedSort(sort);
        setShowSort(false);
    };

    const loadMore = () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);

        // Simulate loading delay
        setTimeout(() => {
            const nextPage = currentPage + 1;
            const startIndex = (nextPage - 1) * productsPerPage;
            const endIndex = startIndex + productsPerPage;

            // Get more products from the filtered products
            const moreProducts = products.slice(startIndex, endIndex);

            if (moreProducts.length > 0) {
                setDisplayedProducts((prev) => [...prev, ...moreProducts]);
                setCurrentPage(nextPage);
                setHasMore(endIndex < products.length);
            } else {
                setHasMore(false);
            }

            setLoadingMore(false);
        }, 500); // 500ms delay for better UX
    };

    const clearAllFilters = () => {
        setAppliedFilters({
            size: [],
            category: [],
            gender: [],
        });
        setHasUserAppliedMobileFilter(false);
        setSize("");
        setCategory("");
        setGender("");
        setSubcategory("");
    };

    // Sinkronkan appliedFilters dengan state gender/category/type dari URL/header di mobile
    useEffect(() => {
        if (isMobile && !hasUserAppliedMobileFilter) {
            setAppliedFilters((prev) => ({
                ...prev,
                gender: gender ? [gender] : [],
                category: category ? [category] : [],
                type: subcategory ? [subcategory] : [],
            }));
        }
    }, [gender, category, subcategory, isMobile, hasUserAppliedMobileFilter]);

    // Untuk mobile, urutkan filter options agar yang sudah dipilih user muncul di urutan teratas
    const sortedSizeOptions = useMemo(() => {
        if (!isMobile || !appliedFilters.size.length) return sizeOptions;
        return [
            ...sizeOptions.filter(opt => appliedFilters.size.includes(opt.label)),
            ...sizeOptions.filter(opt => !appliedFilters.size.includes(opt.label)),
        ];
    }, [isMobile, sizeOptions, appliedFilters.size]);
    const sortedCategoryOptions = useMemo(() => {
        if (!isMobile || !appliedFilters.category.length) return categoryOptions;
        return [
            ...categoryOptions.filter(opt => appliedFilters.category.includes(opt.value)),
            ...categoryOptions.filter(opt => !appliedFilters.category.includes(opt.value)),
        ];
    }, [isMobile, categoryOptions, appliedFilters.category]);
    const sortedGenderOptions = useMemo(() => {
        if (!isMobile || !appliedFilters.gender.length) return genderOptions;
        return [
            ...genderOptions.filter(opt => appliedFilters.gender.includes(opt.value)),
            ...genderOptions.filter(opt => !appliedFilters.gender.includes(opt.value)),
        ];
    }, [isMobile, genderOptions, appliedFilters.gender]);

    // Helper: konversi array value ke array label pakai options
    function valuesToLabels(values: string[], options: { value: string; label: string }[]) {
        return values
            .map((val) => options.find((opt) => opt.value === val)?.label)
            .filter((x): x is string => !!x);
    }

    const [filterSnapshot, setFilterSnapshot] = useState(appliedFilters);

    useEffect(() => {
        if (showFilter) {
            setFilterSnapshot(appliedFilters);
        }
    }, [showFilter, appliedFilters]);

    // Helper untuk generate subcategoryOptions dari category tertentu
    function getSubcategoryOptionsForCategory(catValue: string) {
        if (!catValue) return [];
        const productsInCategory = initialProducts.filter(
            (p) => p.productType && p.productType.toLowerCase().replace(/\s+/g, "-") === catValue
        );
        const tagSet = new Set<string>();
        productsInCategory.forEach((p) => {
            (p.tags || []).forEach((tag) => tagSet.add(tag));
        });
        return Array.from(tagSet).sort().map((tag) => ({ value: normalize(tag), label: tag }));
    }

    // Helper: konversi query param ke label (untuk initialFilters dari URL)
    function getLabelFromValue(val: string | null, options: { value: string; label: string }[]) {
        if (!val) return [];
        const found = options.find(opt => opt.value === val);
        return found ? [found.label] : [];
    }

    // Track selected color per product (keyed by product.handle)
    const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});

    // Handler to update selected color for a product
    const handleColorSelect = (productHandle: string, color: string) => {
        setSelectedColors((prev) => ({ ...prev, [productHandle]: color }));
    };

    if (isInitialLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading text="Loading products..." />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-[56px] md:pt-[73px]">
                <div className="relative w-full h-[477px] md:h-[608px]">
                    <Image
                        src={collection?.image?.url || images.shopImage}
                        alt={collection?.title || "Collections End of Summer"}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    {isMobile ? (
                        <>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                <Image
                                    src={GifIcon}
                                    alt="Animated Icon"
                                    width={200}
                                    height={200}
                                    className="drop-shadow-2xl mb-6"
                                    unoptimized // Important for GIFs
                                />
                            </div>
                            <div className="absolute w-full flex justify-center bottom-14 text-center items-center">
                                <h1 className="flex flex-col gap-2 text-4xl font-bold font-avant-garde tracking-wide text-white">
                                    <p>{collection ? "COLLECTION:" : "BEYOND:RUNNING"}</p>
                                    <p>
                                        {collection?.title || ""}{" "}
                                    </p>
                                </h1>
                            </div>
                        </>
                    ) : (
                        <div className="absolute top-1/2 -translate-y-1/2 z-20 w-full justify-between flex flex-row items-center gap-6 pr-12">
                            <Image
                                src={GifIcon}
                                alt="Animated Icon"
                                width={200}
                                height={200}
                                className="w-[200px] h-[200px] drop-shadow-2xl"
                                unoptimized // Important for GIFs
                            />
                            <h1 className="text-4xl font-itc-demi tracking-wide text-white uppercase whitespace-nowrap">
                                {collection ? "COLLECTIONS " : "BEYOND:RUNNING"}{" "}
                                {collection?.title || " "}
                            </h1>
                        </div>
                    )}
                </div>

                <div className="container mx-auto px-4 py-12">
                    {collection?.description && (
                        <div className="max-w-3xl mb-12">
                            <p className="text-xs md:text-sm font-folio-bold">
                                {collection.description}
                            </p>
                        </div>
                    )}

                    {/* Replace the filter controls section with this enhanced version */}
                    <div className={`${isMobile ? "mb-2" : "border-b border-gray-200 mb-8"} pb-4`}>
                        {isMobile ? (
                            <>
                                {/* Mobile Filter Controls */}
                                <div className="flex w-full justify-between items-center mb-4">
                                    <button
                                        onClick={() => setShowFilter(true)}
                                        className="button-ripple flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-itc-md hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 active:scale-95"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707L9 19.414V13.414a1 1 0 00-.293-.707L2.293 6.293A1 1 0 012 5.586V4z"
                                            />
                                        </svg>
                                        {filterButtonLabel}
                                    </button>

                                    <button
                                        onClick={() => setShowSort(true)}
                                        className="button-ripple flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full text-sm font-itc-md hover:border-black transition-all duration-300 transform hover:scale-105 active:scale-95"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 11h8"
                                            />
                                        </svg>
                                        {sortButtonLabel}
                                    </button>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-itc-md text-gray-500">
                                        {displayedProducts.length} ITEMS
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Desktop Filter Controls */}
                                <div className="flex justify-between items-start">
                                    <div className="flex font-folio-medium space-x-8 mb-4 md:mb-0">
                                        <div className="">
                                            <CustomDropdown
                                                options={sizeOptions}
                                                value={size}
                                                onChange={setSize}
                                                placeholder="Size"
                                            />
                                        </div>
                                        <div className="">
                                            <CustomDropdown
                                                options={categoryOptions}
                                                value={category}
                                                onChange={(val) => {
                                                    setCategory(val);
                                                    setSubcategory(""); // reset subcategory when category changes
                                                }}
                                                placeholder="Category"
                                            />
                                        </div>
                                        {/* Subcategory Dropdown: only show if category is selected and options exist */}
                                        {category && subcategoryOptions.length > 0 && (
                                            <div className="">
                                                <CustomDropdown
                                                    options={subcategoryOptions}
                                                    value={subcategory}
                                                    onChange={setSubcategory}
                                                    placeholder="Type"
                                                />
                                            </div>
                                        )}
                                        <div className="">
                                            <CustomDropdown
                                                options={genderOptions}
                                                value={gender}
                                                onChange={setGender}
                                                placeholder="All Gender"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center font-folio-medium space-x-6">
                                        <span className="text-sm">
                                            {displayedProducts.length} ITEMS
                                        </span>
                                        <span className="text-sm">|</span>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm">Sort By:</span>
                                                <CustomDropdown
                                                    isSort={true}
                                                    options={sortOptions}
                                                    value={sortBy}
                                                    onChange={setSortBy}
                                                    placeholder="Featured"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Filters Section - Desktop */}
                                {/* (size || category || (gender && gender !== "all")) && (
                                    <div className="mt-6 pt-4 border-t border-gray-100"> ...chips... </div>
                                ) */}
                            </>
                        )}
                    </div>

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
                            <p className="text-center text-gray-600 font-avant-garde">
                                Loading products...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    className="w-8 h-8 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Oops! Something went wrong
                            </h3>
                            <p className="text-center text-red-500 font-avant-garde">
                                Error loading products: {error}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 bg-black text-white px-6 py-2 rounded-full text-sm font-avant-garde hover:bg-gray-800 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading && !error && displayedProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20">
                            {/* Check if filters are applied */}
                            {(() => {
                                const activeFilters = getActiveFilters();
                                const hasActiveFilters =
                                    activeFilters.size.length > 0 ||
                                    activeFilters.category.length > 0 ||
                                    activeFilters.gender.length > 0;

                                if (hasActiveFilters) {
                                    // Filtered empty state
                                    return (
                                        <div className="text-center max-w-md mx-auto">
                                            <div className="relative mb-8">
                                                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                                    <svg
                                                        className="w-12 h-12 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-itc-bold text-gray-900 mb-3">
                                                No Products Found
                                            </h3>
                                            <p className="text-gray-600 mb-6 leading-relaxed font-itc-md">
                                                We couldn&apos;t find any products matching your current
                                                filters. Try adjusting your search criteria or
                                                explore our full collection.
                                            </p>

                                            <div className="space-y-3 mb-8">
                                                <div className="flex flex-wrap justify-center gap-2 text-sm">
                                                    <span className="text-gray-500 font-itc-md">
                                                        Current filters:
                                                    </span>
                                                    {activeFilters.size.map((size, index) => (
                                                        <span
                                                            key={`size-${index}`}
                                                            className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-itc-md"
                                                        >
                                                            {size}
                                                        </span>
                                                    ))}
                                                    {activeFilters.category.map(
                                                        (category, index) => (
                                                            <span
                                                                key={`category-${index}`}
                                                                className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-itc-md"
                                                            >
                                                                {category}
                                                            </span>
                                                        )
                                                    )}
                                                    {activeFilters.gender.map((gender, index) => (
                                                        <span
                                                            key={`gender-${index}`}
                                                            className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-itc-md"
                                                        >
                                                            {gender}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                                <button
                                                    onClick={clearAllFilters}
                                                    className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-itc-demi hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                        />
                                                    </svg>
                                                    Clear All Filters
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        window.scrollTo({
                                                            top: 0,
                                                            behavior: "smooth",
                                                        })
                                                    }
                                                    className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full text-sm font-itc-demi hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M7 16l-4-4m0 0l4-4m-4 4h18"
                                                        />
                                                    </svg>
                                                    Browse All Products
                                                </button>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    // General empty state (no products at all)
                                    return (
                                        <div className="text-center max-w-lg mx-auto">
                                            <div className="relative mb-8">
                                                <div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner">
                                                        <svg
                                                            className="w-10 h-10 text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1.5}
                                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1L5 3l4 2 4-2-4-2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-1/3 w-6 h-6 bg-yellow-200 rounded-full animate-pulse"></div>
                                                <div
                                                    className="absolute bottom-8 left-1/4 w-4 h-4 bg-blue-200 rounded-full animate-pulse"
                                                    style={{ animationDelay: "0.5s" }}
                                                ></div>
                                                <div
                                                    className="absolute top-8 left-1/3 w-3 h-3 bg-pink-200 rounded-full animate-pulse"
                                                    style={{ animationDelay: "1s" }}
                                                ></div>
                                            </div>

                                            <h3 className="text-3xl font-itc-bold text-gray-900 mb-4">
                                                No Products Available
                                            </h3>
                                            <p className="text-gray-600 mb-8 text-lg leading-relaxed font-itc-md">
                                                We&apos;re currently updating our inventory. Check back
                                                soon for amazing new products, or explore our other
                                                collections!
                                            </p>

                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <button
                                                    onClick={() => window.location.reload()}
                                                    className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full text-sm font-itc-demi hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                        />
                                                    </svg>
                                                    Refresh Page
                                                </button>
                                                <button
                                                    onClick={() => window.history.back()}
                                                    className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-sm font-itc-demi hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M7 16l-4-4m0 0l4-4m-4 4h18"
                                                        />
                                                    </svg>
                                                    Go Back
                                                </button>
                                            </div>

                                            <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                                                <h4 className="font-itc-demi text-gray-900 mb-2">
                                                    Stay Updated!
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-4 font-itc-md">
                                                    Be the first to know when new products arrive.
                                                </p>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-itc-md"
                                                    />
                                                    <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-itc-demi hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                                                        Notify Me
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    )}

                    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-[15px] md:gap-6">
                        {!loading &&
                            !error &&
                            displayedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    isShop={true}
                                    collectionHandle={collection?.handle}
                                    selectedColor={selectedColors[product.handle]}
                                    onColorSelect={(color) => handleColorSelect(product.handle, color)}
                                />
                            ))}
                    </div>

                    <div className="flex justify-center mt-12">
                        {hasMore && !loading && !error && (
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className={`flex items-center gap-3 border border-black px-8 py-3 text-sm font-avant-garde transition-all duration-300 ${loadingMore
                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                    : "hover:bg-black hover:text-white hover:scale-105"
                                    }`}
                            >
                                {loadingMore ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                        LOAD MORE
                                    </>
                                )}
                            </button>
                        )}

                        {!hasMore && displayedProducts.length > 0 && !loading && !error && (
                            <div className="text-center">
                                <p className="text-sm font-folio-light text-gray-500 mb-4">
                                    You&apos;ve reached the end of the collection
                                </p>
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                    className="flex gap-2 mx-auto text-sm font-folio-light text-gray-600 hover:text-black transition-colors cursor-pointer"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                                        />
                                    </svg>
                                    Back to Top
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
            {showFilter && (
                (() => {
                    // Ambil query param dari URL
                    const urlCategory = searchParams.get("category");
                    const urlGender = searchParams.get("gender");
                    const urlSubcategory = searchParams.get("subcategory");
                    // Jika user belum pernah apply filter, gunakan initialFilters dari URL
                    const isInitial = !hasUserAppliedMobileFilter;
                    let selectedCategoryLabel = isInitial ? getLabelFromValue(urlCategory, categoryOptions)[0] : (filterSnapshot.category && filterSnapshot.category[0]) || "";
                    let selectedGenderLabel = isInitial ? getLabelFromValue(urlGender, genderOptions)[0] : (filterSnapshot.gender && filterSnapshot.gender[0]) || "";
                    let selectedTypeLabel = "";
                    let dynamicTypeOptions: { value: string; label: string }[] = [];
                    if (selectedCategoryLabel) {
                        const found = categoryOptions.find(opt => opt.label === selectedCategoryLabel);
                        const catValue = found ? found.value : "";
                        dynamicTypeOptions = getSubcategoryOptionsForCategory(catValue);
                        if (isInitial) {
                            selectedTypeLabel = getLabelFromValue(urlSubcategory, dynamicTypeOptions)[0] || "";
                        } else {
                            selectedTypeLabel = (filterSnapshot.type && filterSnapshot.type[0]) || "";
                        }
                    }
                    return (
                        <FilterModal
                            onClose={() => setShowFilter(false)}
                            onApplyFilters={handleApplyFilters}
                            initialFilters={{
                                size: filterSnapshot.size,
                                category: selectedCategoryLabel ? [selectedCategoryLabel] : [],
                                gender: selectedGenderLabel ? [selectedGenderLabel] : [],
                                type: selectedTypeLabel ? [selectedTypeLabel] : [],
                            }}
                            sizeOptions={sortedSizeOptions}
                            categoryOptions={sortedCategoryOptions}
                            genderOptions={sortedGenderOptions}
                            getSubcategoryOptionsForCategory={getSubcategoryOptionsForCategory}
                        />
                    );
                })()
            )}

            {showSort && (
                <SortModal
                    onClose={() => setShowSort(false)}
                    onApplySort={handleApplySort}
                    initialSort={appliedSort}
                />
            )}
            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes pulse {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }

                .animate-pulse-slow {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes slideInFromLeft {
                    from {
                        transform: translateX(-100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }

                @keyframes slideInFromRight {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }

                @keyframes slideOutToLeft {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-100%);
                    }
                }

                @keyframes slideOutToRight {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(100%);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }

                .modal-backdrop {
                    animation: fadeIn 0.3s ease-out;
                }

                .modal-backdrop.closing {
                    animation: fadeOut 0.3s ease-out;
                }

                .filter-modal-slide-in {
                    animation: slideInFromLeft 0.3s ease-out;
                }

                .filter-modal-slide-out {
                    animation: slideOutToLeft 0.3s ease-out;
                }

                .sort-modal-slide-in {
                    animation: slideInFromRight 0.3s ease-out;
                }

                .sort-modal-slide-out {
                    animation: slideOutToRight 0.3s ease-out;
                }

                .button-ripple {
                    position: relative;
                    overflow: hidden;
                }

                .button-ripple::after {
                    content: "";
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: translate(-50%, -50%);
                    transition:
                        width 0.6s,
                        height 0.6s;
                }

                .button-ripple:active::after {
                    width: 300px;
                    height: 300px;
                }
            `}</style>
        </div>
    );
}

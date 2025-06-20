"use client"

import { useMemo, useState, useEffect } from "react"
import Image from "next/image"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import ProductCard from "@/components/ui/ProductCard"
import CustomDropdown from "@/components/ui/dropdown"
import useMobile from "@/hooks/use-mobile"
import FilterModal, { type FilterSelections } from "@/components/shop/filter-modal"
import SortModal from "@/components/shop/sort-modal"
import type { ProductCardType, Collection } from "@/lib/shopify/types"
import {
  extractSizeOptions,
  extractCategoryOptions,
  extractGenderOptions,
  productMatchesSize,
  productMatchesCategory,
  productMatchesGender,
} from "@/lib/utils/product-sorting"

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price, Low to High" },
  { value: "price-high", label: "Price, High to Low" },
]

interface ShopPageClientProps {
  initialProducts: ProductCardType[]
  collections: Collection[]
  collection?: Collection
}

export default function ShopPageClient({ initialProducts, collections, collection }: ShopPageClientProps) {
  const [products, setProducts] = useState<ProductCardType[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load more states
  const [displayedProducts, setDisplayedProducts] = useState<ProductCardType[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const productsPerPage = 20

  // Desktop dropdown states
  const [size, setSize] = useState("")
  const [category, setCategory] = useState("")
  const [gender, setGender] = useState("")
  const [sortBy, setSortBy] = useState("featured")

  const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [showFilter, setShowFilter] = useState(false)
  const [showSort, setShowSort] = useState(false)

  // Mobile filter modal states
  const [appliedFilters, setAppliedFilters] = useState<FilterSelections>({
    size: [],
    category: [],
    gender: [],
  })

  const [appliedSort, setAppliedSort] = useState<string>("featured")

  // Extract filter options from products
  const sizeOptions = useMemo(() => extractSizeOptions(initialProducts), [initialProducts])
  const categoryOptions = useMemo(() => extractCategoryOptions(initialProducts), [initialProducts])
  const genderOptions = useMemo(() => {
    const options = extractGenderOptions(initialProducts)
    // Add "All Gender" as default option
    return [{ value: "all", label: "All Gender" }, ...options]
  }, [initialProducts])

  // Convert desktop dropdown values to filter arrays
  const getActiveFilters = (): FilterSelections => {
    if (isMobile) {
      return appliedFilters
    } else {
      // Find the selected options by value and get their labels
      const selectedSizeOption = sizeOptions.find((option) => option.value === size)
      const selectedCategoryOption = categoryOptions.find((option) => option.value === category)
      const selectedGenderOption = genderOptions.find((option) => option.value === gender)

      return {
        size: selectedSizeOption ? [selectedSizeOption.label] : [],
        category: selectedCategoryOption ? [selectedCategoryOption.label] : [],
        gender: selectedGenderOption && selectedGenderOption.value !== "all" ? [selectedGenderOption.label] : [],
      }
    }
  }

  useEffect(() => {
    const applyClientSideFiltersAndSort = () => {
      setLoading(true)
      setError(null)
      try {
        let filteredProducts = [...initialProducts]
        const activeFilters = getActiveFilters()

        // Apply size filter
        if (activeFilters.size.length > 0) {
          filteredProducts = filteredProducts.filter((product) => productMatchesSize(product, activeFilters.size))
        }

        // Apply category filter
        if (activeFilters.category.length > 0) {
          filteredProducts = filteredProducts.filter((product) =>
            productMatchesCategory(product, activeFilters.category),
          )
        }

        // Apply gender filter
        if (activeFilters.gender.length > 0) {
          filteredProducts = filteredProducts.filter((product) => productMatchesGender(product, activeFilters.gender))
        }

        const sortedProducts = [...filteredProducts]
        const currentSort = isMobile ? appliedSort : sortBy

        switch (currentSort) {
          case "price-low":
            sortedProducts.sort(
              (a, b) =>
                Number.parseFloat(a.priceRange.minVariantPrice.amount) -
                Number.parseFloat(b.priceRange.minVariantPrice.amount),
            )
            break
          case "price-high":
            sortedProducts.sort(
              (a, b) =>
                Number.parseFloat(b.priceRange.minVariantPrice.amount) -
                Number.parseFloat(a.priceRange.minVariantPrice.amount),
            )
            break
          case "featured":
          default:
            // Keep original order from Shopify (featured order)
            // No sorting needed, just use the order as received
            break
        }

        setProducts(sortedProducts)
        
        // Reset pagination and set initial displayed products
        setCurrentPage(1)
        setDisplayedProducts(sortedProducts.slice(0, productsPerPage))
        setHasMore(sortedProducts.length > productsPerPage)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    applyClientSideFiltersAndSort()
  }, [appliedFilters, appliedSort, size, category, gender, sortBy, initialProducts, isMobile])

  // Initialize displayed products on first load
  useEffect(() => {
    if (initialProducts.length > 0 && displayedProducts.length === 0) {
      setDisplayedProducts(initialProducts.slice(0, productsPerPage))
      setHasMore(initialProducts.length > productsPerPage)
    }
  }, [initialProducts, displayedProducts.length])

  const filterButtonLabel = useMemo(() => {
    const activeFilters = getActiveFilters()
    const allFilters = [...activeFilters.size, ...activeFilters.category, ...activeFilters.gender]

    if (allFilters.length === 0) {
      return "+ Filter"
    }

    if (allFilters.length <= 2) {
      return `+ ${allFilters.join(", ")}`
    }

    return `+ ${allFilters[0]}, ${allFilters[1]} +${allFilters.length - 2}`
  }, [appliedFilters, size, category, gender, isMobile])

  const sortButtonLabel = useMemo(() => {
    const currentSort = isMobile ? appliedSort : sortBy
    const sortOption = sortOptions.find(option => option.value === currentSort)
    return sortOption ? sortOption.label : "Featured"
  }, [appliedSort, sortBy, isMobile])

  const handleApplyFilters = (filters: FilterSelections) => {
    setAppliedFilters(filters)
    setShowFilter(false)
  }

  const handleApplySort = (sort: string) => {
    setAppliedSort(sort)
    setShowSort(false)
  }

  const loadMore = () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    
    // Simulate loading delay
    setTimeout(() => {
      const nextPage = currentPage + 1
      const startIndex = (nextPage - 1) * productsPerPage
      const endIndex = startIndex + productsPerPage
      
      // Get more products from the filtered products
      const moreProducts = products.slice(startIndex, endIndex)
      
      if (moreProducts.length > 0) {
        setDisplayedProducts(prev => [...prev, ...moreProducts])
        setCurrentPage(nextPage)
        setHasMore(endIndex < products.length)
      } else {
        setHasMore(false)
      }
      
      setLoadingMore(false)
    }, 500) // 500ms delay for better UX
  }

  const clearAllFilters = () => {
    // Clear mobile filters
    setAppliedFilters({
      size: [],
      category: [],
      gender: [],
    })

    // Clear desktop dropdowns
    setSize("")
    setCategory("")
    setGender("")
  }

  const clearSizeFilter = () => {
    // Clear mobile size filter
    setAppliedFilters((prev) => ({
      ...prev,
      size: [],
    }))

    // Clear desktop size dropdown
    setSize("")
  }

  const clearCategoryFilter = () => {
    // Clear mobile category filter
    setAppliedFilters((prev) => ({
      ...prev,
      category: [],
    }))

    // Clear desktop category dropdown
    setCategory("")
  }

  const clearGenderFilter = () => {
    // Clear mobile gender filter
    setAppliedFilters((prev) => ({
      ...prev,
      gender: [],
    }))

    // Clear desktop gender dropdown
    setGender("")
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header collections={collections} />
      <main className="flex-1">
        <div className="relative w-full h-[477px] md:h-[608px]">
          <Image
            src={collection?.image?.url || "/images/shop.png"}
            alt={collection?.title || "Collections End of Summer"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          {isMobile ? (
            <div className="absolute w-full flex justify-center bottom-14 text-center items-center">
              <h1 className="flex flex-col gap-2 text-4xl font-bold font-avant-garde tracking-wide text-white">
                <p>{collection ? "COLLECTION:" : "COLLECTIONS:"}</p>
                <p>
                  {collection?.title || "END OF"} <span className="italic">{collection ? "" : "SUMMER"}</span>
                </p>
              </h1>
            </div>
          ) : (
            <div className="absolute inset-y-0 right-0 flex items-center pr-12">
              <h1 className="text-4xl font-itc-demi tracking-wide text-white uppercase">
                {collection ? "COLLECTIONS " : "COLLECTIONS "} {collection?.title || "END OF "}
                <span className="italic">{collection ? "" : "SUMMER"}</span>
              </h1>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 py-12">
          {collection?.description && (
            <div className="max-w-3xl mb-12">
              <p className="text-xs md:text-sm font-folio-bold">{collection.description}</p>
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
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-avant-garde hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full text-sm font-avant-garde hover:border-black transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                {/* Active Filters Chips - Mobile */}
                {(appliedFilters.size.length > 0 ||
                  appliedFilters.category.length > 0 ||
                  appliedFilters.gender.length > 0) && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {appliedFilters.size.map((size, index) => (
                        <div
                          key={`size-${index}`}
                          className="animate-slideIn group flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 px-3 py-2 rounded-lg text-xs font-medium shadow-sm"
                        >
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span className="font-semibold">Size</span>
                            <span className="text-blue-600">•</span>
                            <span>{size}</span>
                          </div>
                          <button
                            onClick={clearSizeFilter}
                            className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}

                      {appliedFilters.category.map((category, index) => (
                        <div
                          key={`category-${index}`}
                          className="animate-slideIn group flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-800 px-3 py-2 rounded-lg text-xs font-medium shadow-sm"
                        >
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="font-semibold">Category</span>
                            <span className="text-green-600">•</span>
                            <span>{category}</span>
                          </div>
                          <button
                            onClick={clearCategoryFilter}
                            className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}

                      {appliedFilters.gender.map((gender, index) => (
                        <div
                          key={`gender-${index}`}
                          className="animate-slideIn group flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 text-purple-800 px-3 py-2 rounded-lg text-xs font-medium shadow-sm"
                        >
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span className="font-semibold">Gender</span>
                            <span className="text-purple-600">•</span>
                            <span>{gender}</span>
                          </div>
                          <button
                            onClick={clearGenderFilter}
                            className="ml-1 hover:bg-purple-200 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={clearAllFilters}
                      className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-semibold transition-all duration-300 hover:scale-105"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Clear All Filters
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm font-avant-garde text-gray-500">{displayedProducts.length} ITEMS</span>
                </div>
              </>
            ) : (
              <>
                {/* Desktop Filter Controls */}
                <div className="flex justify-between items-start">
                  <div className="flex font-folio-medium space-x-8 mb-4 md:mb-0">
                    <div className="">
                      <CustomDropdown options={sizeOptions} value={size} onChange={setSize} placeholder="Size" />
                    </div>

                    <div className="">
                      <CustomDropdown
                        options={categoryOptions}
                        value={category}
                        onChange={setCategory}
                        placeholder="Category"
                      />
                    </div>

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
                    <span className="text-sm">{displayedProducts.length} ITEMS</span>
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
                {(size || category || (gender && gender !== "all")) && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-wrap gap-3">
                          {size && (
                            <div className="animate-slideIn group flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="font-medium">Size</span>
                                <span className="text-blue-600">•</span>
                                <span>{sizeOptions.find((opt) => opt.value === size)?.label}</span>
                              </div>
                              <button
                                onClick={clearSizeFilter}
                                className="ml-2 hover:bg-blue-200 rounded-full p-1 transition-colors duration-200 group-hover:scale-110"
                              >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}

                          {category && (
                            <div className="animate-slideIn group flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-800 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="font-medium">Category</span>
                                <span className="text-green-600">•</span>
                                <span>{categoryOptions.find((opt) => opt.value === category)?.label}</span>
                              </div>
                              <button
                                onClick={clearCategoryFilter}
                                className="ml-2 hover:bg-green-200 rounded-full p-1 transition-colors duration-200 group-hover:scale-110"
                              >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}

                          {gender && gender !== "all" && (
                            <div className="animate-slideIn group flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 text-purple-800 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="font-medium">Gender</span>
                                <span className="text-purple-600">•</span>
                                <span>{genderOptions.find((opt) => opt.value === gender)?.label}</span>
                              </div>
                              <button
                                onClick={clearGenderFilter}
                                title="Clear"
                                className="ml-2 hover:bg-purple-200 rounded-full p-1 transition-colors duration-200 group-hover:scale-110"
                              >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={clearAllFilters}
                        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Clear All
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
              <p className="text-center text-gray-600 font-avant-garde">Loading products...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-center text-red-500 font-avant-garde">Error loading products: {error}</p>
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
                const activeFilters = getActiveFilters()
                const hasActiveFilters =
                  activeFilters.size.length > 0 || activeFilters.category.length > 0 || activeFilters.gender.length > 0

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

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 font-avant-garde">No Products Found</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        We couldn't find any products matching your current filters. Try adjusting your search criteria
                        or explore our full collection.
                      </p>

                      <div className="space-y-3 mb-8">
                        <div className="flex flex-wrap justify-center gap-2 text-sm">
                          <span className="text-gray-500">Current filters:</span>
                          {activeFilters.size.map((size, index) => (
                            <span key={`size-${index}`} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {size}
                            </span>
                          ))}
                          {activeFilters.category.map((category, index) => (
                            <span
                              key={`category-${index}`}
                              className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                            >
                              {category}
                            </span>
                          ))}
                          {activeFilters.gender.map((gender, index) => (
                            <span
                              key={`gender-${index}`}
                              className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                            >
                              {gender}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={clearAllFilters}
                          className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:from-orange-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                          className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full text-sm font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  )
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

                      <h3 className="text-3xl font-bold text-gray-900 mb-4 font-avant-garde">No Products Available</h3>
                      <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        We're currently updating our inventory. Check back soon for amazing new products, or explore our
                        other collections!
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={() => window.location.reload()}
                          className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-sm font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <h4 className="font-semibold text-gray-900 mb-2">Stay Updated!</h4>
                        <p className="text-sm text-gray-600 mb-4">Be the first to know when new products arrive.</p>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                            Notify Me
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                }
              })()}
            </div>
          )}

          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-[15px] md:gap-6">
            {!loading &&
              !error &&
              displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} isShop={true} collectionHandle={collection?.handle} />
              ))}
          </div>

          <div className="flex justify-center mt-12">
            {hasMore && !loading && !error && (
              <button 
                onClick={loadMore}
                disabled={loadingMore}
                className={`flex items-center gap-3 border border-black px-8 py-3 text-sm font-avant-garde transition-all duration-300 ${
                  loadingMore 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'hover:bg-black hover:text-white hover:scale-105'
                }`}
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  You've reached the end of the collection
                </p>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex gap-2 mx-auto text-sm font-folio-light text-gray-600 hover:text-black transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <FilterModal
          onClose={() => setShowFilter(false)}
          onApplyFilters={handleApplyFilters}
          initialFilters={appliedFilters}
          sizeOptions={sizeOptions}
          categoryOptions={categoryOptions}
          genderOptions={genderOptions}
        />
      )}

      {showSort && (
        <SortModal onClose={() => setShowSort(false)} onApplySort={handleApplySort} initialSort={appliedSort} />
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
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .8;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}

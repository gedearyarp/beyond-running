"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import ViewList from "@/components/peripherals/ListView"
import GridView from "@/components/peripherals/GridView"
import CustomDropdown from "@/components/ui/dropdown"
import useMobile from "@/hooks/use-mobile"
import MobileHeader from "@/components/mobile-header"
import MobileMenu from "@/components/mobile-menu"
import PeripheralsFilterModal from "@/components/peripherals/filter-modal"
import PeripheralsSortModal from "@/components/peripherals/sort-modal"
import { supabase } from "@/lib/supabase"
import { useSearchParams } from "next/navigation"

// Type definition based on Supabase table
export type Peripherals = {
  id: string
  title: string | null
  category: string | null
  is_active: boolean | null
  created_at: string | null
  updated_at: string | null
  credits: string | null
  event_overview: string | null
  event_date: string | null
  highlight_quote: string | null
  paragraph_1: string | null
  paragraph_2: string | null
  paragraph_bottom: string | null
  background_color: string | null
  main_img: string | null
  banner_img: string | null
  left_img: string | null
  right_img: string | null
}

// Dropdown options
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "oldest", label: "Date, Oldest to Latest" },
  { value: "latest", label: "Date, Latest to Oldest" },
]

const filterOptions = [
  { value: "all", label: "All Stories" },
  { value: "discovery", label: "Discovery" },
  { value: "clarity", label: "Clarity" },
  { value: "community", label: "Community" },
]

type ViewMode = "list" | "grid"

export default function PeripheralsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [filter, setFilter] = useState("all")
  const [peripherals, setPeripherals] = useState<Peripherals[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)

  const [appliedFilters, setAppliedFilters] = useState({
    category: "All Stories",
    viewType: "Grid View",
  })
  const [appliedSort, setAppliedSort] = useState("Featured")

  const searchParams = useSearchParams();

  // Sync filter param from URL to state
  useEffect(() => {
    const filterParam = searchParams?.get("filter");
    if (filterParam && filterParam !== filter) {
      setFilter(filterParam);
    }
    // Jika tidak ada param, biarkan default "all"
  }, [searchParams]);

  useEffect(() => {
    const fetchPeripherals = async () => {
      setLoading(true)
      setError(null)
      try {
        let query = supabase.from("peripherals").select("*").eq("is_active", true)

        // Apply sorting
        if (sortBy === "latest") {
          query = query.order("event_date", { ascending: false })
        } else if (sortBy === "oldest") {
          query = query.order("event_date", { ascending: true })
        } else {
          // Default featured sorting by created_at desc
          query = query.order("created_at", { ascending: false })
        }

        // Apply category filter
        if (filter !== "all") {
          query = query.ilike("category", `%${filter}%`)
        }

        const { data, error } = await query

        if (error) throw error

        setPeripherals(data || [])
      } catch (error: any) {
        console.error("Error fetching peripherals:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPeripherals()
  }, [sortBy, filter])

  // Clear all filters
  const clearAllFilters = () => {
    setFilter("all")
  }

  // Clear category filter
  const clearCategoryFilter = () => {
    setFilter("all")
  }

  // Format filter button label
  const filterButtonLabel = useMemo(() => {
    const activeFilters = []
    if (filter !== "all") {
      const categoryLabel = filterOptions.find((opt) => opt.value === filter)?.label
      if (categoryLabel) activeFilters.push(categoryLabel)
    }

    if (activeFilters.length === 0) {
      return "+ Filter"
    }
    if (activeFilters.length <= 2) {
      return `+ ${activeFilters.join(", ")}`
    }
    return `+ ${activeFilters[0]}, ${activeFilters[1]} +${activeFilters.length - 2}`
  }, [filter])

  // Format sort button label
  const sortButtonLabel = useMemo(() => {
    return `Sort By: ${appliedSort}`
  }, [appliedSort])

  const handleApplyFilters = (filters: { category: string; viewType: string }) => {
    setAppliedFilters(filters)

    // Update filter dan viewMode berdasarkan pilihan di modal
    const filterValue = filters.category.toLowerCase().replace(" stories", "")
    setFilter(filterValue === "all" ? "all" : filterValue)

    setViewMode(filters.viewType.toLowerCase().replace(" view", "") as ViewMode)
  }

  const handleApplySort = (sort: string) => {
    setAppliedSort(sort)

    // Update sortBy berdasarkan pilihan di modal
    if (sort === "Featured") {
      setSortBy("featured")
    } else if (sort === "Newest to Oldest") {
      setSortBy("latest")
    } else if (sort === "Oldest to Newest") {
      setSortBy("oldest")
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isMobile ? (
        <>
          <MobileHeader onMenuClick={toggleMobileMenu} />
          {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
        </>
      ) : (
        <Header />
      )}
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="relative w-full h-[477px] md:h-[608px]">
          <Image src="/images/peripherals_banner.png" alt="Runner with medal" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/10" />
          {isMobile ? (
            <div className="absolute w-full flex justify-center bottom-14 text-center items-center">
              <h1 className="flex flex-col gap-2 text-3xl font-itc-demi tracking-wide text-white">
                BEYOND : PERIPHERALS
              </h1>
            </div>
          ) : (
            <div className="absolute inset-y-0 right-0 flex items-center pr-12">
              <h1 className="text-4xl font-itc-demi tracking-wide text-white">PERIPHERALS</h1>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Description */}
          <div className="max-w-3xl mb-12">
            <p className="text-xs md:text-sm font-folio-bold">
              Dive into our curated stories that highlight the intersection of journey, innovation, culture, and
              community. Discover how Beyond Running extends beyond the track into everyday movement.
            </p>
          </div>

          {/* Enhanced Filters and Controls */}
          <div className={`${isMobile ? "mb-2" : "mb-8"} pb-4`}>
            {isMobile ? (
              <>
                {/* Mobile Filter Controls */}
                <div className="flex w-full justify-between items-center mb-4">
                  <button
                    onClick={() => setShowFilterModal(true)}
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
                    onClick={() => setShowSortModal(true)}
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
                    {sortButtonLabel.replace("Sort By: ", "")}
                  </button>
                </div>

                {/* Active Filters Chips - Mobile */}
                {filter !== "all" && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="animate-slideIn group flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 text-purple-800 px-3 py-2 rounded-lg text-xs font-medium shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          <span className="font-semibold">Category</span>
                          <span className="text-purple-600">•</span>
                          <span>{filterOptions.find((opt) => opt.value === filter)?.label}</span>
                        </div>
                        <button
                          onClick={clearCategoryFilter}
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
                  <span className="text-sm font-avant-garde text-gray-500">{peripherals.length} STORIES</span>
                </div>
              </>
            ) : (
              <>
                {/* Desktop Filter Controls */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-8 mb-4 md:mb-0">
                    <div className="font-folio-medium">
                      <CustomDropdown
                        options={filterOptions}
                        value={filter}
                        onChange={setFilter}
                        placeholder="All Stories"
                      />
                    </div>

                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-8">
                      <button
                        className={`text-sm transition-all duration-200 ${
                          viewMode === "grid"
                            ? "font-folio-bold text-black border-b-2 border-black pb-1"
                            : "font-folio-medium text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setViewMode("grid")}
                      >
                        Grid View
                      </button>
                      <button
                        className={`text-sm font-avant-garde transition-all duration-200 ${
                          viewMode === "list"
                            ? "font-folio-bold text-black border-b-2 border-black pb-1"
                            : "font-folio-medium text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setViewMode("list")}
                      >
                        List View
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <span className="text-sm font-folio-medium">{peripherals.length} STORIES</span>
                    <span className="text-sm font-folio-medium">|</span>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center gap-3 font-folio-medium">
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
                {filter !== "all" && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-wrap gap-3">
                          <div className="animate-slideIn group flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 text-purple-800 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="font-medium">Category</span>
                              <span className="text-purple-600">•</span>
                              <span>{filterOptions.find((opt) => opt.value === filter)?.label}</span>
                            </div>
                            <button
                              onClick={clearCategoryFilter}
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

          {/* Enhanced Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
              <p className="text-center text-gray-600 font-avant-garde">Loading stories...</p>
            </div>
          )}

          {/* Enhanced Error State */}
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
              <p className="text-center text-red-500 font-avant-garde">Error loading stories: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-black text-white px-6 py-2 rounded-full text-sm font-avant-garde hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Enhanced Empty State */}
          {!loading && !error && peripherals.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              {(() => {
                const hasActiveFilters = filter !== "all"

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
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 font-avant-garde">No Stories Found</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        We couldn't find any stories matching your current filter. Try exploring different categories or
                        browse all our stories.
                      </p>

                      <div className="space-y-3 mb-8">
                        <div className="flex flex-wrap justify-center gap-2 text-sm">
                          <span className="text-gray-500">Current filter:</span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                            {filterOptions.find((opt) => opt.value === filter)?.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={clearAllFilters}
                          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
                          Browse All Stories
                        </button>
                      </div>
                    </div>
                  )
                } else {
                  // General empty state (no stories at all)
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
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
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

                      <h3 className="text-3xl font-bold text-gray-900 mb-4 font-avant-garde">No Stories Available</h3>
                      <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        We're currently crafting amazing new stories about running, culture, and community. Check back
                        soon for inspiring content!
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
                    </div>
                  )
                }
              })()}
            </div>
          )}

          {/* Stories Display */}
          {!loading && !error && peripherals.length > 0 && (
            <>{viewMode === "list" ? <ViewList peripherals={peripherals} /> : <GridView peripherals={peripherals} />}</>
          )}
        </div>
      </main>
      <Footer />
      {/* Mobile Modals */}
      {showFilterModal && (
        <PeripheralsFilterModal
          onClose={() => setShowFilterModal(false)}
          onApplyFilters={handleApplyFilters}
          initialFilters={appliedFilters}
        />
      )}
      {showSortModal && (
        <PeripheralsSortModal
          onClose={() => setShowSortModal(false)}
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

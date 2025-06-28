"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import GridView from "@/components/community/GridView"
import ListView from "@/components/community/ListView"
import CalendarView from "@/components/community/CalendarView"
import CustomDropdown from "@/components/ui/dropdown"
import useMobile from "@/hooks/use-mobile"
import CommunityFilterModal from "@/components/community/filter-modal"
import CommunitySortModal from "@/components/community/sort-modal"
import { supabase } from "@/lib/supabase"
import { useSearchParams } from "next/navigation"
import { getAllCollections } from "@/lib/shopify"
import { Collection } from "@/lib/shopify/types"

// Type definition based on Supabase table
export type Community = {
  id: string
  title: string
  category: string
  event_date: string
  event_location: string
  event_overview: string
  event_tnc: string
  time_place: string
  main_img: string | null
  banner_img: string | null
  community_img: string | null
  signup_link: string | null
  full_rundown_url: string | null
  documentation_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Dropdown options
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "upcoming", label: "Date, Upcoming Events" },
  { value: "past", label: "Date, Past Events" },
]

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "marathon", label: "Marathon" },
  { value: "exhibition", label: "Exhibition" },
  { value: "workshop", label: "Workshop" },
]

type ViewMode = "grid" | "list" | "calendar"

export default function CommunityPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [category, setCategory] = useState("all")
  const [events, setEvents] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])

  const isMobile = useMobile()
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)

  const [appliedViewType, setAppliedViewType] = useState("Grid View")
  const [appliedSort, setAppliedSort] = useState("Featured")

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionsData = await getAllCollections()
        setCollections(collectionsData)
      } catch (error) {
        console.error("Failed to fetch collections:", error)
      }
    }

    fetchCollections()
  }, [])

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true)
      setError(null)
      try {
        let query = supabase.from("communities").select("*").eq("is_active", true)

        // Apply sorting
        if (sortBy === "upcoming") {
          query = query.gte("event_date", new Date().toISOString()).order("event_date", { ascending: true })
        } else if (sortBy === "past") {
          query = query.lt("event_date", new Date().toISOString()).order("event_date", { ascending: false })
        }

        const { data, error } = await query

        if (error) throw error

        setEvents(data || [])
      } catch (error: any) {
        console.error("Error fetching communities:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCommunities()
  }, [sortBy])

  // Sync view param from URL to state
  useEffect(() => {
    const view = searchParams?.get("view");
    if (view === "upcoming") {
      setSortBy("upcoming");
      setAppliedSort("Upcoming Events");
      setViewMode("grid");
      setAppliedViewType("Grid View");
    } else if (view === "past") {
      setSortBy("past");
      setAppliedSort("Past Events");
      setViewMode("grid");
      setAppliedViewType("Grid View");
    } else if (view === "calendar") {
      setViewMode("calendar");
      setAppliedViewType("Calendar View");
    }
    // If view param is not present, do not override user selection
  }, [searchParams]);

  // Filter events by category
  const filteredEvents = useMemo(() => {
    if (category === "all") return events
    return events.filter((event) => event.category?.toLowerCase() === category.toLowerCase())
  }, [events, category])

  // Clear all filters
  const clearAllFilters = () => {
    setCategory("all")
    // Remove view mode clearing from here
  }

  // Clear category filter
  const clearCategoryFilter = () => {
    setCategory("all")
  }

  // Format filter button label
  const filterButtonLabel = useMemo(() => {
    const activeFilters = []
    if (category !== "all") {
      const categoryLabel = categoryOptions.find((opt) => opt.value === category)?.label
      if (categoryLabel) activeFilters.push(categoryLabel)
    }
    // Remove view mode logic from here

    if (activeFilters.length === 0) {
      return "+ Filter"
    }
    if (activeFilters.length <= 2) {
      return `+ ${activeFilters.join(", ")}`
    }
    return `+ ${activeFilters[0]}, ${activeFilters[1]} +${activeFilters.length - 2}`
  }, [category]) // Remove viewMode from dependencies

  // Format sort button label
  const sortButtonLabel = useMemo(() => {
    return `Sort By: ${appliedSort}`
  }, [appliedSort])

  const handleApplyViewType = (viewType: string) => {
    setAppliedViewType(viewType)
    setViewMode(viewType.toLowerCase().replace(" view", "") as ViewMode)
  }

  const handleApplySort = (sort: string) => {
    setAppliedSort(sort)

    // Update sortBy berdasarkan pilihan di modal
    if (sort === "Featured") {
      setSortBy("featured")
    } else if (sort === "Upcoming Events") {
      setSortBy("upcoming")
    } else if (sort === "Past Events") {
      setSortBy("past")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header collections={collections} />
      <main className="flex-1 pt-[88px]">
        {/* Hero Banner */}
        <div className="relative w-full h-[477px] md:h-[608px]">
          <Image src="/images/com_banner.png" alt="Community Banner" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/10" />
          {isMobile ? (
            <div className="absolute w-full flex justify-center bottom-14 text-center items-center">
              <h1 className="flex flex-col gap-2 text-3xl font-bold font-avant-garde tracking-wide text-white">
                COMMUNITY
              </h1>
            </div>
          ) : (
            <div className="absolute inset-y-0 right-0 flex items-center pr-12">
              <h1 className="text-3xl md:text-4xl font-bold font-avant-garde tracking-wide text-white">COMMUNITY</h1>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Description */}
          <div className="max-w-3xl mb-12">
            <p className="text-xs md:text-sm font-avant-garde">
              Explore Beyond Community—where running transcends individual pursuits and becomes a collective journey.
              From local meetups to global collaborations, we celebrate the connections, stories, and shared purpose
              that fuel every stride. Join us in shaping a culture built on movement, resilience, and unity.
            </p>
          </div>

          {/* Enhanced Filters and Controls */}
          <div className={`${isMobile ? "mb-2" : "border-gray-200 mb-8"} pb-4`}>
            {isMobile ? (
              <>
                {/* Mobile Filter Controls */}
                <div className="flex w-full justify-between items-center mb-4">
                  <button
                    onClick={() => setShowFilterModal(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-avant-garde hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 cursor-pointer"
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
                    className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full text-sm font-avant-garde hover:border-black transition-all duration-300 cursor-pointer"
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
                {category !== "all" && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="animate-slideIn group flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-800 px-3 py-2 rounded-lg text-xs font-medium shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="font-semibold">Category</span>
                          <span className="text-green-600">•</span>
                          <span>{categoryOptions.find((opt) => opt.value === category)?.label}</span>
                        </div>
                        <button
                          onClick={clearCategoryFilter}
                          className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors duration-200 cursor-pointer"
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
                      className="flex items-center gap-2 text-orange-600 hover:text-orange-800 text-sm font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
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
                  <span className="text-sm font-avant-garde text-gray-500">{filteredEvents.length} STORIES</span>
                </div>
              </>
            ) : (
              <>
                {/* Desktop Filter Controls */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-8 mb-4 md:mb-0">
                    <div className="font-folio-medium">
                      <CustomDropdown
                        options={categoryOptions}
                        value={category}
                        onChange={setCategory}
                        placeholder="All Categories"
                      />
                    </div>

                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-8">
                      <button
                        className={`text-sm font-avant-garde transition-all duration-200 cursor-pointer ${
                          viewMode === "grid"
                            ? "font-folio-bold text-black border-b-2 border-black pb-1"
                            : "font-folio-medium text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setViewMode("grid")}
                      >
                        Grid View
                      </button>
                      <button
                        className={`text-sm font-avant-garde transition-all duration-200 cursor-pointer ${
                          viewMode === "list"
                            ? "font-folio-bold text-black border-b-2 border-black pb-1"
                            : "font-folio-medium text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setViewMode("list")}
                      >
                        List View
                      </button>
                      <button
                        className={`text-sm font-avant-garde transition-all duration-200 cursor-pointer ${
                          viewMode === "calendar"
                            ? "font-folio-bold text-black border-b-2 border-black pb-1"
                            : "font-folio-medium text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setViewMode("calendar")}
                      >
                        Calendar View
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <span className="text-sm font-folio-medium">{filteredEvents.length} STORIES</span>
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
                {category !== "all" && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-wrap gap-3">
                          <div className="animate-slideIn group flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-800 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="font-medium">Category</span>
                              <span className="text-green-600">•</span>
                              <span>{categoryOptions.find((opt) => opt.value === category)?.label}</span>
                            </div>
                            <button
                              onClick={clearCategoryFilter}
                              className="ml-2 hover:bg-green-200 rounded-full p-1 transition-colors duration-200 group-hover:scale-110 cursor-pointer"
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
                        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
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
              <p className="text-center text-gray-600 font-avant-garde">Loading community events...</p>
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
              <p className="text-center text-red-500 font-avant-garde">Error loading events: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-black text-white px-6 py-2 rounded-full text-sm font-avant-garde hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Enhanced Empty State */}
          {!loading && !error && filteredEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              {(() => {
                const hasActiveFilters = category !== "all" // Remove viewMode check

                if (hasActiveFilters) {
                  // Filtered empty state - only show category in current filters
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
                              d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6"
                            />
                          </svg>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 font-avant-garde">No Events Found</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        We couldn't find any community events matching your current filters. Try adjusting your search
                        criteria or explore all our events.
                      </p>

                      <div className="space-y-3 mb-8">
                        <div className="flex flex-wrap justify-center gap-2 text-sm">
                          <span className="text-gray-500">Current filters:</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {categoryOptions.find((opt) => opt.value === category)?.label}
                          </span>
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
                          Browse All Events
                        </button>
                      </div>
                    </div>
                  )
                } else {
                  // General empty state (no events at all)
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
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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

                      <h3 className="text-3xl font-bold text-gray-900 mb-4 font-avant-garde">No Events Available</h3>
                      <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        We're currently planning exciting new community events. Check back soon for amazing experiences,
                        or explore our other content!
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

          {/* Events Display */}
          {!loading && !error && filteredEvents.length > 0 && (
            <>
              {viewMode === "grid" && <GridView events={filteredEvents} />}
              {viewMode === "list" && <ListView events={filteredEvents} />}
              {viewMode === "calendar" && <CalendarView events={filteredEvents} />}
            </>
          )}
        </div>
      </main>
      <Footer />
      {showFilterModal && (
        <CommunityFilterModal
          onClose={() => setShowFilterModal(false)}
          onApplyViewType={handleApplyViewType}
          initialViewType={appliedViewType}
        />
      )}
      {showSortModal && (
        <CommunitySortModal
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

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
import MobileHeader from "@/components/mobile-header"
import MobileMenu from "@/components/mobile-menu"
import CommunityFilterModal from "@/components/community/filter-modal"
import CommunitySortModal from "@/components/community/sort-modal"
import { supabase } from "@/lib/supabase"

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
  image_url: string
  signup_link: string | null
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

  const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)

  const [appliedViewType, setAppliedViewType] = useState("Grid View")
  const [appliedSort, setAppliedSort] = useState("Featured")

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        let query = supabase
          .from('communities')
          .select('*')
          .eq('is_active', true)

        // Apply sorting
        if (sortBy === 'upcoming') {
          query = query.gte('event_date', new Date().toISOString()).order('event_date', { ascending: true })
        } else if (sortBy === 'past') {
          query = query.lt('event_date', new Date().toISOString()).order('event_date', { ascending: false })
        }

        const { data, error } = await query

        if (error) throw error

        // Transform the data to match the Event type
        const transformedEvents = data.map(community => {
          const eventDate = new Date(community.event_date)
          return community
        })

        setEvents(transformedEvents)
      } catch (error) {
        console.error('Error fetching communities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCommunities()
  }, [sortBy])

  // Format filter button label
  const filterButtonLabel = useMemo(() => {
    if (appliedViewType === "Grid View") {
      return "+ Filter"
    }
    return `+ ${appliedViewType}`
  }, [appliedViewType])

  // Format sort button label
  const sortButtonLabel = useMemo(() => {
    return `Sort By: ${appliedSort}`
  }, [appliedSort])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <p>Loading events...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
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
          <Image src="/images/com_banner.png" alt="Community Banner" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/10" />
          {isMobile ? (
            <div className="absolute w-full flex justify-center bottom-14 text-center items-center">
              <h1 className="flex flex-col gap-2 text-3xl font-bold font-avant-garde tracking-wide text-white">COMMUNITY</h1>
            </div>
          ):(
            <div className="absolute inset-y-0 right-0 flex items-center text-white">
              <h1 className="text-3xl md:text-4xl font-bold font-avant-garde tracking-wide">COMMUNITY</h1>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Description */}
          <div className="max-w-3xl mb-12">
            <p className="text-[12px] font-bold md:font-normal md:text-base font-avant-garde">
              Explore Beyond Community—where running transcends individual pursuits and becomes a collective journey.
              From local meetups to global collaborations, we celebrate the connections, stories, and shared purpose
              that fuel every stride. Join us in shaping a culture built on movement, resilience, and unity.
            </p>
          </div>

          {/* Filters and View Toggle */}
          <div className="flex flex-wrap justify-between items-center mb-8">
            {isMobile ? (
              <>
                <div className="w-full flex justify-between">
                  <button onClick={() => setShowFilterModal(true)} className="text-sm font-avant-garde cursor-pointer">
                    {filterButtonLabel}
                  </button>
                  <button onClick={() => setShowSortModal(true)} className="text-sm font-avant-garde cursor-pointer">
                    {sortButtonLabel}
                  </button>
                </div>
                <span className="text-sm font-avant-garde mt-4">{events.length} Stories</span>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-6 mb-4 md:mb-0">
                  {viewMode === "calendar" && (
                    <CustomDropdown
                      options={categoryOptions}
                      value={category}
                      onChange={setCategory}
                      placeholder="Category"
                    />
                  )}
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                    <button
                      className={`text-sm font-avant-garde ${viewMode === "grid" ? "font-bold" : "text-gray-500"}`}
                      onClick={() => setViewMode("grid")}
                    >
                      Grid View
                    </button>
                    <button
                      className={`text-sm font-avant-garde ${viewMode === "list" ? "font-bold" : "text-gray-500"}`}
                      onClick={() => setViewMode("list")}
                    >
                      List View
                    </button>
                    <button
                      className={`text-sm font-avant-garde ${viewMode === "calendar" ? "font-bold" : "text-gray-500"}`}
                      onClick={() => setViewMode("calendar")}
                    >
                      Calendar View
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-avant-garde text-gray-500">{events.length} Stories</span>
                  <div className="flex items-center">
                    <span className="text-sm font-avant-garde mr-2">Sort By:</span>
                    <CustomDropdown
                      isSort={true}
                      options={sortOptions}
                      value={sortBy}
                      onChange={setSortBy}
                      placeholder="Featured"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Events Display */}
          {viewMode === "grid" && <GridView events={events} />}
          {viewMode === "list" && <ListView events={events} />}
          {viewMode === "calendar" && <CalendarView events={events} />}
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
    </div>
  )
}

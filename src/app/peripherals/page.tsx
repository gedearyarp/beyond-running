"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import ViewList from "@/components/peripherals/ListView"
import GridView from "@/components/peripherals/GridView"
import CustomDropdown from "@/components/ui/dropdown"
import type { Peripherals } from "@/components/peripherals/ListViewItem"
import useMobile from "@/hooks/use-mobile"
import MobileHeader from "@/components/mobile-header"
import MobileMenu from "@/components/mobile-menu"
import PeripheralsFilterModal from "@/components/peripherals/filter-modal"
import PeripheralsSortModal from "@/components/peripherals/sort-modal"

// Sample stories data
const peripherals: Peripherals[] = [
  {
    id: 1,
    date: "17.02.2025",
    title: "RUNS IN THE FAMILY",
    category: "COMMUNITY:FEATURED RUNNER",
    image_url: "/images/per_1.png",
    slug: "runs-in-the-family",
    desc: "The story of a furniture maker, found solace in running amid Seoul's Urban sprawl. Raised in nature, he now escapes the city's relentless pace through his runs."
  },
  {
    id: 2,
    date: "17.02.2025",
    title: "BEYOND SOLSTICE",
    category: "COMMUNITY:EVENT",
    image_url: "/images/per_2.png",
    slug: "beyond-solstice",
    desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl"
  },
  {
    id: 3,
    date: "17.02.2025",
    title: "A POSTCARD FROM BANDUNG",
    category: "COMMUNITY:EVENT",
    image_url: "/images/per_3.png",
    slug: "postcard-from-bandung",
    desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl"
  },
  {
    id: 4,
    date: "17.02.2025",
    title: "TRAILS THROUGH THE TIME",
    category: "COMMUNITY:EVENT",
    image_url: "/images/per_4.png",
    slug: "trails-through-time",
    desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl"
  },
  {
    id: 5,
    date: "17.02.2025",
    title: "ENDLESS ROAD",
    category: "COMMUNITY:EVENT",
    image_url: "/images/per_5.png",
    slug: "endless-road",
    desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl"
  },
  {
    id: 6,
    date: "17.02.2025",
    title: "RUNNING IS YOUR LIFE",
    category: "COMMUNITY:EVENT",
    image_url: "/images/per_6.png",
    slug: "running-is-your-life",
    desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl"
  },
  {
    id: 7,
    date: "17.02.2025",
    title: "BEYOND:MATERIALITY",
    category: "COMMUNITY:EVENT",
    image_url: "/images/per_7.png",
    slug: "beyond-materiality",
    desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl"
  },
  {
    id: 8,
    date: "17.02.2025",
    title: "THE PERSONAL RUN OF A LIFETIME",
    category: "COMMUNITY:EVENT",
    image_url: "/images/per_8.png",
    slug: "personal-run-of-lifetime",
    desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl"
  },
]

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

  const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)

  const [appliedFilters, setAppliedFilters] = useState({
    category: "All Stories",
    viewType: "Grid View",
  })
  const [appliedSort, setAppliedSort] = useState("Featured")

  // Format filter button label
  const filterButtonLabel = useMemo(() => {
    if (appliedFilters.category === "All Stories" && appliedFilters.viewType === "Grid View") {
      return "+ Filter"
    }

    if (appliedFilters.category !== "All Stories" && appliedFilters.viewType === "Grid View") {
      return `+ ${appliedFilters.category}`
    }

    if (appliedFilters.category === "All Stories" && appliedFilters.viewType !== "Grid View") {
      return `+ ${appliedFilters.viewType}`
    }

    return `+ ${appliedFilters.category}, ${appliedFilters.viewType}`
  }, [appliedFilters])

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
      <main className="flex-1 mb-12">
        {/* Hero Banner */}
        <div className="relative w-full h-[477px] md:h-[608px]">
          <Image src="/images/peripherals_banner.png" alt="Runner with medal" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/10" />
          {isMobile ? (
            <div className="absolute w-full flex justify-center bottom-14 text-center items-center">
              <h1 className="flex flex-col gap-2 text-3xl font-bold font-avant-garde tracking-wide text-white">
                BEYOND : PERIPHERALS
              </h1>
            </div>
          ):(
            <div className="absolute inset-y-0 right-0 flex items-center pr-12">
              <h1 className="text-4xl font-bold font-avant-garde tracking-wide text-white">
                PERIPHERALS
              </h1>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Description */}
          <div className="max-w-3xl mb-12">
            <p className="text-sm md:text-lg font-bold font-avant-garde">
              Dive into our curated stories that highlight the intersection of journey, innovation, culture, and
              community. Discover how Beyond Running extends beyond the track into everyday movement.
            </p>
          </div>

          {/* Filters and View Toggle */}
          <div className="flex flex-wrap justify-between items-center mb-8">
            {isMobile ? (
              <>
                <div className="w-full flex justify-between">
                  <div className="flex items-center space-x-6 md:mb-0">
                    <button onClick={() => setShowFilterModal(true)} className="text-sm font-avant-garde cursor-pointer">
                      {filterButtonLabel}
                    </button>
                  </div>
                  <div className="md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-4">
                  {/* <button
                    className={`text-sm font-avant-garde cursor-pointer ${viewMode === "grid" ? "font-bold" : "text-gray-500"}`}
                    onClick={() => setViewMode("grid")}
                  >
                    Grid View
                  </button>
                  <button
                    className={`text-sm font-avant-garde cursor-pointer ${viewMode === "list" ? "font-bold" : "text-gray-500"}`}
                    onClick={() => setViewMode("list")}
                  >
                    List View
                  </button> */}
                </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <button onClick={() => setShowSortModal(true)} className="text-sm font-avant-garde cursor-pointer">
                        {sortButtonLabel}
                      </button>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-avant-garde mt-8">10 Stories</span>
              </>
            ): (
              <>
                <div className="flex items-center space-x-6 mb-4 md:mb-0">
                  <CustomDropdown options={filterOptions} value={filter} onChange={setFilter} placeholder="All Stories" />
                </div>
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-4">
                  <button
                    className={`text-sm font-avant-garde cursor-pointer ${viewMode === "grid" ? "font-bold" : "text-gray-500"}`}
                    onClick={() => setViewMode("grid")}
                  >
                    Grid View
                  </button>
                  <button
                    className={`text-sm font-avant-garde cursor-pointer ${viewMode === "list" ? "font-bold" : "text-gray-500"}`}
                    onClick={() => setViewMode("list")}
                  >
                    List View
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="hidden md:block text-sm font-avant-garde text-gray-500">10 Stories</span>
                  <span className="hidden md:block text-sm font-avant-garde text-gray-500">|</span>
                  <div className="flex items-center">
                    <span className="text-sm font-avant-garde mr-2">Sort By:</span>
                    <CustomDropdown isSort={true} options={sortOptions} value={sortBy} onChange={setSortBy} placeholder="Featured" />
                  </div>
                </div>
              </>
            )}
          </div>
          {isMobile ?? (
            <div>
              <span className="text-sm font-avant-garde text-gray-500">10 Stories</span>
            </div>
          )}

          {/* Stories Display */}
          {viewMode === "list" ? <ViewList peripherals={peripherals} /> : <GridView peripherals={peripherals} />}
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
    </div>
  )
}

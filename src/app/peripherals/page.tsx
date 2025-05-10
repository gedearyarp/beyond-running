"use client"

import { useState } from "react"
import Image from "next/image"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import ViewList from "@/components/peripherals/ListView"
import GridView from "@/components/peripherals/GridView"
import CustomDropdown from "@/components/ui/dropdown"
import type { Peripherals } from "@/components/peripherals/ListViewItem"

// Sample stories data
const peripherals: Peripherals[] = [
  {
    id: 1,
    date: "17.02.2025",
    title: "RUNS IN THE FAMILY",
    category: "COMMUNITY:FEATURED RUNNER",
    image_url: "/images/per_1.png",
    slug: "runs-in-the-family",
    desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl"
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mb-12">
        {/* Hero Banner */}
        <div className="relative w-full h-[608px]">
          <Image src="/images/peripherals_banner.png" alt="Runner with medal" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-y-0 right-0 flex items-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold font-avant-garde tracking-wide">PERIPHERALS</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Description */}
          <div className="max-w-3xl mb-12">
            <p className="text-lg font-bold font-avant-garde">
              Dive into our curated stories that highlight the intersection of journey, innovation, culture, and
              community. Discover how Beyond Running extends beyond the track into everyday movement.
            </p>
          </div>

          {/* Filters and View Toggle */}
          <div className="flex flex-wrap justify-between items-center mb-8">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <CustomDropdown options={filterOptions} value={filter} onChange={setFilter} placeholder="All Stories" />
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-4">
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
              <span className="text-sm font-avant-garde text-gray-500">10 Stories</span>
              <span className="text-sm font-avant-garde text-gray-500">|</span>
              <div className="flex items-center">
                <span className="text-sm font-avant-garde mr-2">Sort By:</span>
                <CustomDropdown isSort={true} options={sortOptions} value={sortBy} onChange={setSortBy} placeholder="Featured" />
              </div>
            </div>
          </div>

          {/* Stories Display */}
          {viewMode === "list" ? <ViewList peripherals={peripherals} /> : <GridView peripherals={peripherals} />}
        </div>
      </main>
      <Footer />
    </div>
  )
}

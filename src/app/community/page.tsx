"use client"

import { useState } from "react"
import Image from "next/image"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import GridView from "@/components/community/GridView"
import ListView from "@/components/community/ListView"
import CalendarView from "@/components/community/CalendarView"
import CustomDropdown from "@/components/ui/dropdown"

// Sample events data
export type Event = {
  id: number
  title: string
  date: string
  location: string
  organizer: string
  image: string
  day?: number
  month?: string
  year?: number
  membersOnly?: boolean
}


const events: Event[] = [
  {
    id: 1,
    title: "EQUATOR STRIDE: THE BALI MARATHON",
    date: "02.20.2025",
    location: "BALI",
    organizer: "FLOWER BOX X SATISFY RUNNING",
    image: "/community/bali-marathon.jpg",
    day: 20,
    month: "FEBRUARY",
    year: 2025,
  },
  {
    id: 2,
    title: "UNSEEN RUNNING EXHIBITION",
    date: "02.04.2025",
    location: "JOGJAKARTA",
    organizer: "RUNHOOD MAGAZINE",
    image: "/community/running-exhibition.jpg",
    day: 4,
    month: "FEBRUARY",
    year: 2025,
  },
  {
    id: 3,
    title: "POCARI MARATHON",
    date: "01.24.2025",
    location: "JAKARTA",
    organizer: "POCARI SWEAT",
    image: "/community/pocari-marathon.jpg",
    day: 24,
    month: "JANUARY",
    year: 2025,
  },
  {
    id: 4,
    title: "SEA RUN SUMMIT: TRAIL & TECH TALK",
    date: "01.19.2025",
    location: "JAKARTA",
    organizer: "SOLOMON, GARMIN, STRAVA",
    image: "/community/sea-run-summit.jpg",
    day: 19,
    month: "JANUARY",
    year: 2025,
  },
  {
    id: 5,
    title: "SUNRISE DASH: BALI COASTAL RUN",
    date: "01.13.2025",
    location: "BALI",
    organizer: "BALI HOPE ULTRA X TROPICFEEL",
    image: "/community/sunrise-dash.jpg",
    day: 13,
    month: "JANUARY",
    year: 2025,
  },
  {
    id: 6,
    title: "HIGHLAND TEMPO: MOUNT BROMO ALTITUDE CAMP",
    date: "01.10.2025",
    location: "PROBOLINGGO",
    organizer: "SUNDO X VIBRAM",
    image: "/community/highland-tempo.jpg",
    day: 10,
    month: "JANUARY",
    year: 2025,
  },
  {
    id: 7,
    title: "RUN & RECOVER: MOVEMENT MINDFULNESS",
    date: "01.03.2025",
    location: "JAKARTA",
    organizer: "BEYOND RUNNING",
    image: "/community/run-recover.jpg",
    day: 3,
    month: "JANUARY",
    year: 2025,
    membersOnly: true,
  },
  {
    id: 8,
    title: "THE 140 RELAY RUN",
    date: "12.20.2024",
    location: "JAKARTA",
    organizer: "BEYOND RUNNING",
    image: "/community/relay-run.jpg",
    day: 20,
    month: "DECEMBER",
    year: 2024,
  },
  {
    id: 9,
    title: "THE MONSOON DASH: KUALA LUMPUR NIGHT RUN",
    date: "10.05.2024",
    location: "KUALA LUMPUR",
    organizer: "BEYOND RUNNING",
    image: "/community/monsoon-dash.jpg",
    day: 5,
    month: "OCTOBER",
    year: 2024,
  },
]

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="relative w-full h-[608px]">
          <Image src="/images/com_banner.png" alt="Community Banner" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-y-0 right-0 flex items-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold font-avant-garde tracking-wide">COMMUNITY</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Description */}
          <div className="max-w-3xl mb-12">
            <p className="text-base font-avant-garde">
              Explore Beyond Community—where running transcends individual pursuits and becomes a collective journey.
              From local meetups to global collaborations, we celebrate the connections, stories, and shared purpose
              that fuel every stride. Join us in shaping a culture built on movement, resilience, and unity.
            </p>
          </div>

          {/* Filters and View Toggle */}
          <div className="flex flex-wrap justify-between items-center mb-8">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              {viewMode === "calendar" && <CustomDropdown
                options={categoryOptions}
                value={category}
                onChange={setCategory}
                placeholder="Category"
              />
                }
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
              <span className="text-sm font-avant-garde text-gray-500">10 Stories</span>
              <div className="flex items-center">
                <span className="text-sm font-avant-garde mr-2">Sort By:</span>
                <CustomDropdown isSort={true} options={sortOptions} value={sortBy} onChange={setSortBy} placeholder="Featured" />
              </div>
            </div>
          </div>

          {/* Events Display */}
          {viewMode === "grid" && <GridView events={events} />}
          {viewMode === "list" && <ListView events={events} />}
          {viewMode === "calendar" && <CalendarView events={events} />}
        </div>
      </main>
      <Footer />
    </div>
  )
}

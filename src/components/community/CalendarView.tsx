import Link from "next/link"
import type { Event } from "@/app/community/page"

interface CalendarViewProps {
  events: Event[]
}

// Group events by year and month
function groupEventsByYearAndMonth(events: Event[]) {
  const grouped: Record<number, Record<string, Event[]>> = {}

  events.forEach((event) => {
    if (!event.year || !event.month) return

    if (!grouped[event.year]) {
      grouped[event.year] = {}
    }

    if (!grouped[event.year][event.month]) {
      grouped[event.year][event.month] = []
    }

    grouped[event.year][event.month].push(event)
  })

  return grouped
}

export default function CalendarView({ events }: CalendarViewProps) {
  const groupedEvents = groupEventsByYearAndMonth(events)

  // Sort years in descending order
  const sortedYears = Object.keys(groupedEvents)
    .map(Number)
    .sort((a, b) => b - a)

  // Month order for sorting
  const monthOrder = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ]

  return (
    <div className="w-full">
      {sortedYears.map((year) => (
        <div key={year} className="mb-12">
          <h2 className="text-2xl font-bold font-avant-garde mb-6">{year}</h2>
          <hr className="border-t border-gray-200 mb-8" />

          {Object.keys(groupedEvents[year])
            .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
            .map((month) => {
              const sortedEvents = [...groupedEvents[year][month]].sort((a, b) => {
                if (!a.day || !b.day) return 0
                return b.day - a.day
              })

              return (
                <div key={month} className="mb-16">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-16">
                    <div>
                        <h3 className="text-xl font-bold font-avant-garde">{month}</h3>
                    </div>
                    {sortedEvents.map((event) => (
                      <div key={event.id} className="relative">
                        {event.membersOnly && (
                          <div className="absolute right-0 top-0 -mt-4 -mr-4 bg-orange-500 text-white rounded-full w-20 h-20 flex items-center justify-center rotate-12 z-10">
                            <div className="text-xs font-bold font-avant-garde text-center leading-tight">
                              MEMBER
                              <br />
                              ONLY
                            </div>
                          </div>
                        )}

                        <Link href={`/community/${event.id}`} className="block group">
                          <div className="mb-4">
                            <div className="text-3xl font-bold font-avant-garde mb-4">{event.day}</div>

                            <h4 className="text-base font-bold font-avant-garde mb-6 group-hover:underline">
                              {event.title}
                            </h4>

                            <p className="text-sm uppercase font-avant-garde">{event.location}</p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>

                  <hr className="border-t border-gray-200 mt-16" />
                </div>
              )
            })}
        </div>
      ))}
    </div>
  )
}

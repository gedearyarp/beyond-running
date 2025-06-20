import Link from "next/link"
import type { Community } from "@/app/community/page"

interface CalendarViewProps {
  events: Community[]
}

interface ProcessedEvent extends Community {
  day: number
}

// Group events by year and month
function groupEventsByYearAndMonth(events: Community[]) {
  const grouped: Record<number, Record<string, ProcessedEvent[]>> = {}

  events.forEach((event) => {
    const eventDate = new Date(event.event_date)
    const year = eventDate.getFullYear()
    const month = eventDate.toLocaleString('en-US', { month: 'long' }).toUpperCase()

    if (!grouped[year]) {
      grouped[year] = {}
    }

    if (!grouped[year][month]) {
      grouped[year][month] = []
    }

    grouped[year][month].push({
      ...event,
      day: eventDate.getDate()
    } as ProcessedEvent)
  })

  return grouped
}

export default function CalendarView({ events }: CalendarViewProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 font-avant-garde">No events available</p>
      </div>
    )
  }

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
          <h2 className="text-[14px] font-folio-bold mb-6">{year}</h2>
          <hr className="border-t border-gray-200 mb-8" />

          {Object.keys(groupedEvents[year])
            .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
            .map((month) => {
              const sortedEvents = [...groupedEvents[year][month]].sort((a, b) => {
                const dayA = a.day || 0
                const dayB = b.day || 0
                return dayB - dayA
              })

              return (
                <div key={month} className="mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-16">
                    <div>
                      <h3 className="text-[14px] font-folio-bold">{month}</h3>
                    </div>
                    {sortedEvents.map((event) => (
                      <div key={event.id} className="relative">
                        <div className="mb-4">
                          <div className="text-[14px] font-folio-bold mb-4">{event.day}</div>

                          <Link href={`/community/${event.id}`} className="block">
                            <h4 className="text-[14px] font-folio-bold mb-8 hover:underline">
                              {event.title}
                            </h4>
                          </Link>

                          <p className="text-sm uppercase font-folio-medium">{event.event_location}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="border-t border-gray-200 mt-12" />
                </div>
              )
            })}
        </div>
      ))}
    </div>
  )
}

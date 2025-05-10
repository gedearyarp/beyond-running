import Image from "next/image"
import Link from "next/link"
import type { Event } from "@/app/community/page"

interface GridViewProps {
  events: Event[]
}

export default function GridView({ events }: GridViewProps) {
  // First event gets a large card
  const firstEvent = events[0]
  // Second and third events get medium cards
  const secondRowEvents = events.slice(1, 3)
  // Middle events (4-7) get small cards in a row of 4
  const middleRowEvents = events.slice(3, 7)
  // Last two events get medium cards
  const lastRowEvents = events.slice(7, 9)

  return (
    <div className="flex flex-col gap-4">
      {/* First row - 1 large + 2 medium */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Large card (spans 6 columns) */}
        <div className="md:col-span-6 relative h-[400px] overflow-hidden group">
          <Image
            src={firstEvent.image || "/placeholder.svg"}
            alt={firstEvent.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

          {/* Location Tag */}
          <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 font-avant-garde">
            {firstEvent.location}
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 text-white">
            <h3 className="text-3xl font-bold font-avant-garde mb-4">{firstEvent.title}</h3>

            <Link
              href={`/community/${firstEvent.id}`}
              className="bg-white text-black text-xs px-4 py-1 rounded-full hover:bg-gray-200 transition-colors font-avant-garde mb-8"
            >
              More
            </Link>
          </div>

          {/* Date and organizer at bottom */}
          <div className="absolute bottom-4 left-0 right-0 text-center text-white">
            <p className="text-sm font-avant-garde">{firstEvent.date}</p>
            <p className="text-xs font-avant-garde opacity-80">{firstEvent.organizer}</p>
          </div>
        </div>

        {/* Two medium cards (each spans 3 columns) */}
        {secondRowEvents.map((event) => (
          <div key={event.id} className="md:col-span-3 relative h-[400px] overflow-hidden group">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

            {/* Location Tag */}
            <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 font-avant-garde">
              {event.location}
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 text-white">
              <h3 className="text-2xl font-bold font-avant-garde mb-4">{event.title}</h3>

              <Link
                href={`/community/${event.id}`}
                className="bg-white text-black text-xs px-4 py-1 rounded-full hover:bg-gray-200 transition-colors font-avant-garde mb-8"
              >
                More
              </Link>
            </div>

            {/* Date and organizer at bottom */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <p className="text-sm font-avant-garde">{event.date}</p>
              <p className="text-xs font-avant-garde opacity-80">{event.organizer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Second row - 4 small cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {middleRowEvents.map((event) => (
          <div key={event.id} className="relative h-[300px] overflow-hidden group">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

            {/* Location Tag */}
            <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 font-avant-garde">
              {event.location}
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 text-white">
              <h3 className="text-xl font-bold font-avant-garde mb-2">{event.title}</h3>

              <Link
                href={`/community/${event.id}`}
                className="bg-white text-black text-xs px-4 py-1 rounded-full hover:bg-gray-200 transition-colors font-avant-garde mb-4"
              >
                More
              </Link>
            </div>

            {/* Date and organizer at bottom */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <p className="text-sm font-avant-garde">{event.date}</p>
              <p className="text-xs font-avant-garde opacity-80">{event.organizer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Third row - 2 medium cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lastRowEvents.map((event) => (
          <div key={event.id} className="relative h-[300px] overflow-hidden group">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

            {/* Location Tag */}
            <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 font-avant-garde">
              {event.location}
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 text-white">
              <h3 className="text-2xl font-bold font-avant-garde mb-4">{event.title}</h3>

              <Link
                href={`/community/${event.id}`}
                className="bg-white text-black text-xs px-4 py-1 rounded-full hover:bg-gray-200 transition-colors font-avant-garde mb-8"
              >
                More
              </Link>
            </div>

            {/* Date and organizer at bottom */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <p className="text-sm font-avant-garde">{event.date}</p>
              <p className="text-xs font-avant-garde opacity-80">{event.organizer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

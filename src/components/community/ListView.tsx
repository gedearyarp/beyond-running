import Link from "next/link"
import type { Event } from "@/app/community/page"
import useMobile from "@/hooks/use-mobile";

interface ListViewProps {
  events: Event[]
}

export default function ListView({ events }: ListViewProps) {
  const isMobile = useMobile();
  return (
    <div className="w-full">
      {events.map((event) => (
        <Link key={event.id} href={`/community/${event.id}`} className="block group">
          <div className="border-t border-gray-200 py-6">
            <div className="flex justify-between items-center space-x-16 md:space-x-0">
              <div className="flex-shrink-0 w-24">
                <p className="text-[12px] font-bold md:font-normal md:text-sm font-avant-garde">{event.date}</p>
              </div>
              {isMobile ? (
                <>
                  <div className="flex-grow">
                    <h3 className="text-xl md:text-2xl font-bold font-avant-garde group-hover:underline">{event.title}</h3>
                    <span className="text-xs text-[#ADADAD] uppercase font-avant-garde">{event.organizer}</span>
                  </div>
                </>
              ):(
                <>
                  <div className="flex-grow">
                    <h3 className="text-xl md:text-2xl font-bold font-avant-garde group-hover:underline">{event.title}</h3>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-xs uppercase font-avant-garde">{event.organizer}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

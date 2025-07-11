import Link from "next/link";
import type { Community } from "@/app/community/page";
import useMobile from "@/hooks/use-mobile";

interface ListViewProps {
    events: Community[];
}

export default function ListView({ events }: ListViewProps) {
    const isMobile = useMobile();

    if (events.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 font-folio-medium">No events available</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {events.map((event) => {
                const eventDate = new Date(event.event_date);
                const formattedDate = eventDate
                    .toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                    })
                    .replace(/\//g, ".");

                return (
                    <Link key={event.id} href={`/program/${event.id}`} className="block group">
                        <div className="border-t border-gray-200 py-6">
                            <div className="flex justify-between items-center space-x-16 md:space-x-36">
                                <div className="flex-shrink-0 w-24">
                                    <p className="text-[12px] font-folio-bold md:text-[18px]">
                                        {formattedDate}
                                    </p>
                                </div>
                                {isMobile ? (
                                    <>
                                        <div className="flex-grow">
                                            <h3 className="text-xl md:text-2xl font-bold font-avant-garde group-hover:underline">
                                                {event.title}
                                            </h3>
                                            <span className="text-xs text-[#ADADAD] uppercase font-avant-garde">
                                                {event.category}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex-grow">
                                            <h3 className="text-xl md:text-[36px] font-itc-demi uppercase group-hover:underline">
                                                {event.title}
                                            </h3>
                                        </div>
                                        <div className="flex-shrink-0 text-right">
                                            <span className="text-[10px] uppercase font-itc-md">
                                                {event.category}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

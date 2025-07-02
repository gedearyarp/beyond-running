import Image from "next/image";
import Link from "next/link";
import type { Community } from "@/app/community/page";
import { images } from "@/assets/images";

interface GridViewProps {
    events: Community[];
}

export default function GridView({ events }: GridViewProps) {
    if (events.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 font-avant-garde">No events available</p>
            </div>
        );
    }

    // First event gets a large card
    const firstEvent = events[0];
    // Second and third events get medium cards
    const secondRowEvents = events.slice(1, 3);
    // Middle events (4-7) get small cards in a row of 4
    const middleRowEvents = events.slice(3, 7);
    // Last two events get medium cards
    const lastRowEvents = events.slice(7, 9);

    const renderEventCard = (event: Community, size: "large" | "medium" | "small") => {
        const titleSizes = {
            large: "text-3xl",
            medium: "text-2xl",
            small: "text-xl",
        };

        const heights = {
            large: "h-[408px]",
            medium: "h-[408px]",
            small: "h-[408px]",
        };

        const eventDate = new Date(event.event_date);
        const formattedDate = eventDate
            .toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            })
            .replace(/\//g, ".");

        // Validate and format image URL
        const imageUrl =
            event.main_img && event.main_img.trim() !== ""
                ? event.main_img
                : images.peripheralImage;

        // Debug logging
        if (event.main_img) {
            console.log("Event:", event.title, "Image URL:", imageUrl);
        }

        return (
            <div key={event.id} className={`relative ${heights[size]} overflow-hidden group`}>
                <Image
                    src={imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={imageUrl.includes("supabase.co")}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

                {/* Location Tag */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-[12px] px-3 py-1 font-itc-bold uppercase">
                    {event.event_location}
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 text-white">
                    <h3 className={`text-[24px] md:text-[28px] font-itc-demi mb-8`}>
                        {event.title}
                    </h3>

                    <Link
                        href={`/program/${event.id}`}
                        className="bg-[#ADADAD] text-black text-xs px-4 py-1 rounded-full hover:bg-gray-200 transition-colors font-folio-bold mb-8"
                    >
                        More
                    </Link>
                </div>

                {/* Date and organizer at bottom */}
                <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                    <p className="text-[21px] font-folio-extra-bold">{formattedDate}</p>
                    <p className="text-[21px] font-folio-extra-bold">{event.category}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            {/* First row - 1 large + 2 medium */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Large card (spans 6 columns) */}
                <div className="md:col-span-6">{renderEventCard(firstEvent, "large")}</div>

                {/* Two medium cards (each spans 3 columns) */}
                {secondRowEvents.map((event) => (
                    <div key={event.id} className="md:col-span-3">
                        {renderEventCard(event, "medium")}
                    </div>
                ))}
            </div>

            {/* Second row - 4 small cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {middleRowEvents.map((event) => (
                    <div key={event.id}>{renderEventCard(event, "small")}</div>
                ))}
            </div>

            {/* Third row - 2 medium cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lastRowEvents.map((event) => (
                    <div key={event.id}>{renderEventCard(event, "medium")}</div>
                ))}
            </div>
        </div>
    );
}

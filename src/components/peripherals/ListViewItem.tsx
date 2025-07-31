import useMobile from "@/hooks/use-mobile";
import Link from "next/link";
import RichTextViewer from "../ui/RichTextViewer";

export interface Peripherals {
    id: string;
    title: string | null;
    category: string | null;
    is_active: boolean | null;
    created_at: string | null;
    updated_at: string | null;
    credits: string | null;
    event_overview: string | null;
    short_overview: string | null;
    event_date: string | null;
    highlight_quote: string | null;
    paragraph_1: string | null;
    paragraph_2: string | null;
    paragraph_bottom: string | null;
    background_color: string | null;
    main_img: string | null;
    banner_img: string | null;
    left_img: string | null;
    right_img: string | null;
}

interface ListViewItemProps {
    peripherals: Peripherals;
}

export default function ListViewItem({ peripherals }: ListViewItemProps) {
    const isMobile = useMobile();

    // Format date
    const formattedDate = peripherals.event_date
        ? new Date(peripherals.event_date)
              .toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
              })
              .replace(/\//g, ".")
        : "";

    return (
        <>
            {isMobile ? (
                <Link href={`/peripherals/${peripherals.id}`} className="block group">
                    <div className="border-t border-gray-200 py-6">
                        <div className="flex justify-between items-center space-x-6">
                            <div className="flex-shrink-0 w-24">
                                <p className="text-[12px] font-bold font-avant-garde">
                                    {formattedDate}
                                </p>
                            </div>
                            <div className="flex-grow">
                                <RichTextViewer
                                    content={peripherals.title || ""}
                                    className="text-[21px] font-bold font-avant-garde group-hover:underline"
                                />
                                <RichTextViewer
                                    content={peripherals.category || ""}
                                    className="text-[8px] text-[#ADADAD] uppercase font-avant-garde"
                                />
                            </div>
                        </div>
                    </div>
                </Link>
            ) : (
                <Link href={`/peripherals/${peripherals.id}`} className="block group">
                    <div className="border-t border-gray-200 py-6">
                        <div className="flex justify-between items-center space-x-36">
                            <div className="flex-shrink-0 w-24">
                                <p className="text-[18px] font-folio-bold">{formattedDate}</p>
                            </div>
                            <div className="flex-grow">
                                <RichTextViewer
                                    content={peripherals.title || ""}
                                    className="text-xl md:text-[36px] font-bold font-itc-demi uppercase group-hover:underline"
                                />
                            </div>
                            <div className="flex-shrink-0 text-right">
                                <RichTextViewer
                                    content={peripherals.category || ""}
                                    className="text-[10px] uppercase font-itc-md"
                                />
                            </div>
                        </div>
                    </div>
                </Link>
            )}
        </>
    );
}

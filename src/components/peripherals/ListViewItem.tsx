import useMobile from "@/hooks/use-mobile"
import Link from "next/link"

export interface Peripherals {
  id: string | number
  date: string
  title: string
  image_url: string
  category: string
  desc: string
  slug: string
}

interface ListViewItemProps {
  peripherals: Peripherals
}

export default function ListViewItem({ peripherals }: ListViewItemProps) {
  const isMobile = useMobile();
  return (
    <>
    {isMobile ? (
      <Link href={`/peripherals/${peripherals.slug}`} className="block group">
        <div className="border-t border-gray-200 py-6">
          <div className="flex justify-between items-center space-x-16">
            <div className="flex-shrink-0 w-24">
              <p className="text-[12px] font-bold font-avant-garde">{peripherals.date}</p>
            </div>
            <div className="flex-grow">
              <h3 className="text-[21px] font-bold font-avant-garde group-hover:underline">{peripherals.title}</h3>
                <span className="text-[8px] text-[#ADADAD] uppercase font-avant-garde">{peripherals.category}</span>
            </div>
          </div>
        </div>
      </Link>
    ):(
      <Link href={`/peripherals/${peripherals.slug}`} className="block group">
        <div className="border-t border-gray-200 py-6">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0 w-24">
              <p className="text-sm font-avant-garde">{peripherals.date}</p>
            </div>
            <div className="flex-grow">
              <h3 className="text-xl md:text-2xl font-bold font-avant-garde group-hover:underline">{peripherals.title}</h3>
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="text-xs uppercase font-avant-garde">{peripherals.category}</span>
            </div>
          </div>
        </div>
      </Link>
    )}
    </>
  )
}

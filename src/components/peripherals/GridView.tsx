import Link from "next/link"
import Image from "next/image"
import type { Peripherals } from "./ListViewItem"
import { images } from "@/assets/images"

interface PeripheralGridProps {
  peripherals: Peripherals[]
}

export default function StoryGrid({ peripherals }: PeripheralGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {peripherals.map((peripheral) => {
        // Format date
        const formattedDate = peripheral.event_date 
          ? new Date(peripheral.event_date).toLocaleDateString('en-US', { 
              month: '2-digit', 
              day: '2-digit', 
              year: 'numeric' 
            }).replace(/\//g, '.')
          : '';

        // Get image URL with fallback
        const imageUrl = peripheral.main_img && peripheral.main_img.trim() !== "" 
          ? peripheral.main_img 
          : images.peripheralImage;

        return (
          <Link key={peripheral.id} href={`/peripherals/${peripheral.id}`} className="group">
            <div className="bg-gray-100 h-[363px] md:h-[695px] relative mb-4 overflow-hidden">
              <Image
                src={imageUrl}
                alt={peripheral.title || 'Peripheral story'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized={imageUrl.includes('supabase.co')}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 p-6 text-center">
                <div className="flex flex-col gap-8 items-center text-center">
                  <div className="absolute top-2 md:top-8">
                    <p className="text-[6.5px] md:text-[12px] font-itc-xl">{formattedDate}</p>
                  </div>
                  <h3 className="text-2xl md:text-[52px] font-bold font-itc-demi uppercase tracking-wide">{peripheral.title}</h3>
                  <div className="absolute flex flex-col bottom-4 md:bottom-8 gap-8 md:gap-16 px-12 md:px-28">
                    <p className="text-[9px] md:text-[14px] font-folio-bold">{peripheral.short_overview}</p>
                    <p className="text-[7px] md:text-[10px] font-itc-md uppercase">{peripheral.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

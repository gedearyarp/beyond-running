import Link from "next/link"
import Image from "next/image"
import type { Peripherals } from "./ListViewItem"

interface PeripheralGridProps {
  peripherals: Peripherals[]
}

export default function StoryGrid({ peripherals }: PeripheralGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {peripherals.map((peripheral) => (
        <Link key={peripheral.id} href={`/peripherals/${peripheral.slug}`} className="group">
          <div className="bg-gray-100 h-[695px] relative mb-4 overflow-hidden">
            <Image
              src={peripheral.image_url}
              alt={peripheral.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 p-6 text-center">
              <div className="flex flex-col gap-8 items-center text-center">
                <div className="absolute top-8">
                  <p className="text-sm font-avant-garde font-bold">{peripheral.date}</p>
                </div>
                <h3 className="text-2xl font-bold font-avant-garde tracking-wide">{peripheral.title}</h3>
                <div className="absolute flex flex-col bottom-8 gap-16 px-28">
                  <p className="text-sm font-avant-garde font-bold">{peripheral.desc}</p>
                  <p className="text-[10px] font-avant-garde">{peripheral.category}</p>
                </div>
              </div>
            </div>
          </div>
          {/* <p className="text-sm font-avant-garde mb-2">{peripheral.date}</p>
          <h3 className="text-xl font-bold font-avant-garde group-hover:underline mb-2">{peripheral.title}</h3>
          <span className="text-xs uppercase font-avant-garde">{peripheral.category}</span> */}
        </Link>
      ))}
    </div>
  )
}

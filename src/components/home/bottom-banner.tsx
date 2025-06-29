import Image from "next/image"

export default function BottomBanner() {
  return (
    <div className="relative w-full h-[488px] md:h-[719px] mt-12 overflow-hidden">
      <Image src="/images/bottom_banner.png" alt="Beyond Running" fill className="object-cover h-[488px]" priority />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white font-avant-garde tracking-wide">BEYOND : RUNNING</h2>
      </div>
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <p className="text-xs md:text-sm text-white max-w-2xl mx-auto px-8 font-avant-garde">
        Beyond running is a running apparel brand based in jakarta. Each collection is built from a collective response of the running community, designed to seamlessly fit in a runner’s wardrobe and tested to suit all running purposes.
        </p>
      </div>
    </div>
  )
}

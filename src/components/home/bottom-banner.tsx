import Image from "next/image"

export default function BottomBanner() {
  return (
    <div className="relative w-full h-[719px] mt-12 overflow-hidden">
      <Image src="/images/bottom_banner.png" alt="Beyond Running" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-5xl font-bold text-white font-avant-garde tracking-wide">BEYOND : RUNNING</h2>
      </div>
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <p className="text-sm text-white max-w-2xl mx-auto px-8 font-avant-garde">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet
          dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
          suscipit lobortis nisl ut.
        </p>
      </div>
    </div>
  )
}

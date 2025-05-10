import Link from "next/link"
import { ArrowRight, Instagram, Twitter } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t border-black h-[333px] w-full pt-12">
      <div className="w-full px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 h-[333px] pb-12">
          <div className="flex flex-col h-full justify-between w-sm">
            <Image 
              src="/icons/logoB.gif" 
              alt="Beyond Running Animation" 
              height={178}
              width={178}
              className="bg-black object-cover"
              unoptimized = {true} // Important for GIFs to animate properly
            />
            <div>BEYOND RUNNING © 2025. All Rights Reserved</div>
          </div>

          <div className="h-full w-xs ml-24 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold bg-background mb-4">JOIN THE MOTION</h3>
              <p className="text-sm mb-6">Keep up with the new drops, insights, runners stories and more.</p>
            </div>
            <div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full border-b border-[#000000] pb-2 focus:outline-none focus:border-black"
                />
                <button className="absolute right-0 bottom-2">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 text-sm">
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <Link href="/contact" className="hover:underline">
                    Contact Us
                  </Link>
                  <Link href="/faq" className="hover:underline">
                    FAQ
                  </Link>
                </div>
              </div>
            </div>
            
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-4">FOLLOW US ON SOCIAL MEDIA</h3>
              <p className="text-sm mb-6">
                Beyond running is a running apparel brand based in Jakarta. Each collection is built from a collective
                response of the running community, designed to seamlessly fit in a runner's wardrobe and tested to suit
                all running purposes.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="https://instagram.com" aria-label="Instagram" className="hover:opacity-70">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter" className="hover:opacity-70">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

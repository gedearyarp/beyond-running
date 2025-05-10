import Image from "next/image"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"

export default function PeripheralsDetailPage() {
  const peripheral = {
    title: "BEYOND SOLSTICE",
    date: "January 29, 2024",
    author: "Jonathan Escalante-Phillips",
    photographer: "Simon Noyes",
    quote: "\"This Isn't Just A Race; It's A Celebration Of Bali,\" Said Ayu Wibowo, A First-Time Marathoner.",
    content: [
      "The Bali 2025 Marathon. Shaking a record-breaking over 500 runners from around the globe for a 5 kilometer run that first traversed the island's stunning geography and culture landscape. Held in the north of Bali, the event was a celebration of running and offered a glimpse of the island's vibrant charm.",
      "Starting at Serangan Beach under a golden sunrise, the route led participants through rice fields, traditional villages, and along the coastal roads. The finish line at the breathtaking Uluwatu Temple, perched on a cliff above the Indian Ocean, showcased Bali's incredible blend of natural beauty and cultural heritage, making this marathon a truly symbolic journey, adding a cultural touch to the event.",
      'The event was a mix of serious athletes and first-time runners, creating a diverse and inclusive atmosphere. "I\'ve been running marathons around the world for years, but the Bali Solstice Marathon offered something special," Maya Jansen, an experienced runner from the Netherlands, shared. "The combination of challenging terrain, beautiful scenery, and the warm welcome from locals made this unlike anything I\'ve ever experienced," she said.',
      'As the finish line near Uluwatu Temple came into view, participants found new energy despite the exhaustion. "Crossing that finish line with the temple and ocean as my backdrop was a moment of sheer accomplishment," Theo Nguyen, a first-time marathoner from Vietnam, recalled. "The physical challenge was significant, but the spiritual experience of running this particular course, Bali today, we came together as a community."',
      "With the sun climbing higher and runners dispersing to prepare for next day, the Solstice left a lasting impression. For many, it was a reminder of the tight-knit nature of the local running community, destinations to explore, and the power of shared experiences through movement.",
    ],
    images: [
      {
        src: "/images/image 13.png",
        alt: "Group of runners at night with motion blur"
      },
      {
        src: "/images/image 14 (1).png",
        alt: "Two runners at night"
      },
      {
        src: "/images/image 15.png",
        alt: "Runners at sunrise",
      },
      {
        src: "/images/image 16.png",
        alt: "Marathon finish line",
      },
      {
        src: "/images/image 18.png",
        alt: "Marathon finish line",
      },
    ],
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 text-white bg-black pb-42">
        <div className="relative w-full h-[705px]">
          <Image src="/images/per_detail_1.png" alt={peripheral.title} fill className="object-cover" priority />
        </div>

        <div className="container mx-auto px-4 py-16 flex flex-col gap-36">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-avant-garde mb-6">{peripheral.title}</h1>
              <p className="text-sm font-avant-garde mb-6">{peripheral.date}</p>
              <p className="text-sm font-avant-garde">Words: {peripheral.author}</p>
              <p className="text-sm font-avant-garde">Photos: {peripheral.photographer}</p>
            </div>
            <div>
              <div className="text-base font-avant-garde leading-relaxed space-y-6">
                <p>{peripheral.content[0]}</p>
                <p>{peripheral.content[1]}</p>
              </div>
            </div>
          </div>
          <div className="my-36 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-avant-garde leading-tight">{peripheral.quote}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
            <div className="text-base font-avant-garde leading-relaxed">
              <p>{peripheral.content[2]}</p>
            </div>
            <div className="text-base font-avant-garde leading-relaxed">
              <p>{peripheral.content[3]}</p>
            </div>
          </div>
				</div>

          {peripheral.images.length <= 2 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 px-4 max-w-screen-xl mx-auto">
              {peripheral.images.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    width={0}
                    height={0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full h-auto"
                    style={{
                      maxHeight: "600px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full mb-24 flex flex-row overflow-x-auto hide-scrollbar">
							<div className="flex space-x-6">
								{peripheral.images.map((image, index) => (
									<div
										key={index}
										className="flex items-center justify-center"
									>
										<Image
											src={image.src || "/placeholder.svg"}
											alt={image.alt}
											width={0}
											height={0}
											sizes="500px"
											className="min-w-[880px] min-h-[900px] object-contain"
										/>
									</div>
								))}
							</div>
						</div>

          )}
          <div className="max-w-3xl ml-34 mb-24">
            <p className="text-base font-avant-garde leading-relaxed">{peripheral.content[4]}</p>
          </div>
      </main>
      <Footer />
    </div>
  )
}

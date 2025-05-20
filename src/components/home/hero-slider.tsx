"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Slide {
  id: number
  image: string
  title: string
  subtitle?: string
  description: string
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/images/Hero1_Raw.png",
    title: "BEYOND : RUNNING",
    subtitle: "ROTTERDAM 2025",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut.",
  },
  {
    id: 2,
    image: "/images/Hero1.png",
    title: "MOMENT",
    subtitle: "OF STILLNESS",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut.",
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[764px] md:h-[900px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/30" />

            {/* Title in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <div className="max-w-4xl px-8">
                <h2 className="text-6xl font-bold font-avant-garde tracking-tight">
                  {slide.title}
                  {slide.subtitle && (
                    <>
                      <br />
                      <span className={`${index === 0 ? "text-red-500" : ""}`}>{slide.subtitle}</span>
                    </>
                  )}
                </h2>
              </div>
            </div>

            {/* Description at bottom */}
            <div className="absolute bottom-16 left-0 right-0 text-center text-white">
              <p className="text-base max-w-3xl mx-auto px-8 font-avant-garde">{slide.description}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls Container */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="hidden md:block mx-4 p-2 rounded-full text-white hover:bg-black/50 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Navigation Dots */}
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="hidden md:block mx-4 p-2 rounded-full text-white hover:bg-black/50 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

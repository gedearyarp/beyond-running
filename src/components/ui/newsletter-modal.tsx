"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  // Handle escape key to close
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isOpen, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Close modal after success message
      setTimeout(() => {
        onClose()
        // Reset state after modal closes
        setTimeout(() => {
          setEmail("")
          setIsSuccess(false)
        }, 500)
      }, 2000)
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-all duration-300">
      <div
        ref={modalRef}
        className={`relative w-full max-w-4xl bg-black overflow-hidden rounded-lg shadow-2xl transition-all duration-500 transform ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image - Left side */}
          <div className="w-full md:w-1/2 relative h-64 md:h-auto">
            <Image
              src="/images/per_1.png"
              alt="Beyond Running Community"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Content - Right side */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <div className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">SIGN UP FOR 15% OFF</h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">YOUR FIRST ORDER</h3>

              <p className="text-sm text-white/80 mb-6">
                Subscribe to the Beyond Running Community, hear about our latest releases, access exclusive offers and
                receive updates from behind the scenes. Plus receive 15% off your first order.
              </p>

              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email"
                      className="w-full bg-transparent border-b border-white/30 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/70 transition-colors duration-200"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-[#d17928] hover:bg-[#c06820] text-white py-3 font-medium transition-all duration-300 relative overflow-hidden ${
                      isSubmitting ? "cursor-not-allowed opacity-80" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "JOIN THE MOTION"
                    )}
                  </button>

                  <p className="text-xs text-white/60 text-center mt-4">
                    By Signing Up, You Agree To Our{" "}
                    <span className="underline cursor-pointer">TERMS AND CONDITIONS</span>
                  </p>
                </form>
              ) : (
                <div className="text-center py-6 animate-fade-in">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">Thank You!</h3>
                  <p className="text-white/80">Your 15% discount code has been sent to your email.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

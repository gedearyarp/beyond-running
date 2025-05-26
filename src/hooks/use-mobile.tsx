"use client"
import { useState, useEffect } from "react"

export default function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're on the client-side
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      // Initial check
      checkMobile()

      // Add event listener for window resize
      window.addEventListener("resize", checkMobile)

      // Clean up
      return () => {
        window.removeEventListener("resize", checkMobile)
      }
    }
  }, [])

  return isMobile
}

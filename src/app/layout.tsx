import type React from "react"
import "./globals.css"
import "./fonts.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Beyond Running",
  description: "Running apparel brand based in Jakarta",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-avant-garde pt-[88px]">{children}</body>
    </html>
  )
}
